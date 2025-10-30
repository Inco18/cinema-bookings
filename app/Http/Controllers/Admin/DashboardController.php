<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Enums\UserRewardStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Movie;
use App\Models\Showing;
use App\Models\User;
use App\Models\UserReward;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Statystyki ogólne
        $totalBookings = Booking::count();
        $totalRevenue = Booking::where('status', BookingStatus::PAID)->sum('price');
        $totalUsers = User::count();
        $totalMovies = Movie::count();

        // Rezerwacje w tym miesiącu
        $bookingsThisMonth = Booking::whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();

        // Przychód w tym miesiącu
        $revenueThisMonth = Booking::where('status', BookingStatus::PAID)
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('price');

        // Wykres rezerwacji z ostatnich 7 dni
        $bookingsLast7Days = Booking::where('created_at', '>=', Carbon::now()->subDays(6)->startOfDay())
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(CASE WHEN status = \''.BookingStatus::PAID->value.'\' THEN price ELSE 0 END) as revenue')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('d.m'),
                    'bookings' => $item->count,
                    'revenue' => floatval($item->revenue),
                ];
            });

        // Wypełnij brakujące dni
        $last7DaysData = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dateFormatted = $date->format('d.m');
            $existing = $bookingsLast7Days->firstWhere('date', $dateFormatted);

            $last7DaysData->push([
                'date' => $dateFormatted,
                'bookings' => $existing ? $existing['bookings'] : 0,
                'revenue' => $existing ? $existing['revenue'] : 0,
            ]);
        }

        // Top 5 najpopularniejszych filmów (według liczby rezerwacji)
        $topMovies = Movie::withCount(['showings as bookings_count' => function ($query) {
            $query->join('bookings', 'showings.id', '=', 'bookings.showing_id');
        }])
            ->orderBy('bookings_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($movie) {
                return [
                    'title' => $movie->title,
                    'bookings' => $movie->bookings_count,
                ];
            });

        // Nadchodzące seanse (następne 5)
        $upcomingShowings = Showing::with(['movie', 'hall'])
            ->where('start_time', '>', Carbon::now())
            ->orderBy('start_time')
            ->limit(5)
            ->get()
            ->map(function ($showing) {
                $seatsCount = $showing->hall->seats()->count();
                $bookedSeats = $showing->bookings()->withCount('seats')->get()->sum('seats_count');
                $occupancy = $seatsCount > 0 ? $bookedSeats / $seatsCount : 0;

                return [
                    'id' => $showing->id,
                    'movie_title' => $showing->movie->title,
                    'hall_number' => $showing->hall->number,
                    'start_time' => $showing->start_time,
                    'bookings_count' => $showing->bookings()->count(),
                    'movie_poster' => $showing->movie->poster_image,
                    'occupancy' => $occupancy,
                ];
            });

        // Status rezerwacji (rozkład)
        $bookingsByStatus = Booking::select(['status', DB::raw('COUNT(*) as count')])
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => $item->status,
                    'count' => $item->count,
                ];
            });

        // Wykorzystane nagrody w tym miesiącu
        $rewardsUsedThisMonth = UserReward::where('status', UserRewardStatus::USED)
            ->whereMonth('updated_at', Carbon::now()->month)
            ->whereYear('updated_at', Carbon::now()->year)
            ->count();

        // Nowi użytkownicy w ostatnich 30 dniach
        $newUsersLast30Days = User::where('created_at', '>=', Carbon::now()->subDays(30))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('d.m'),
                    'users' => $item->count,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalBookings' => $totalBookings,
                'totalRevenue' => floatval($totalRevenue),
                'totalUsers' => $totalUsers,
                'totalMovies' => $totalMovies,
                'bookingsThisMonth' => $bookingsThisMonth,
                'revenueThisMonth' => floatval($revenueThisMonth),
                'rewardsUsedThisMonth' => $rewardsUsedThisMonth,
            ],
            'bookingsLast7Days' => $last7DaysData,
            'topMovies' => $topMovies,
            'upcomingShowings' => $upcomingShowings,
            'bookingsByStatus' => $bookingsByStatus,
            'newUsersLast30Days' => $newUsersLast30Days,
        ]);
    }
}
