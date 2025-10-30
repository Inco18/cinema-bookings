import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    TrendingUp,
    Users,
    DollarSign,
    Film,
    Calendar,
    Ticket,
    Award,
    ArrowUpRight,
    Clock,
} from "lucide-react";
import {
    Bar,
    BarChart,
    Line,
    LineChart,
    Pie,
    PieChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

type Props = {
    stats: {
        totalBookings: number;
        totalRevenue: number;
        totalUsers: number;
        totalMovies: number;
        bookingsThisMonth: number;
        revenueThisMonth: number;
        rewardsUsedThisMonth: number;
    };
    bookingsLast7Days: Array<{
        date: string;
        bookings: number;
        revenue: number;
    }>;
    topMovies: Array<{
        title: string;
        bookings: number;
    }>;
    upcomingShowings: Array<{
        id: number;
        movie_title: string;
        hall_number: string;
        start_time: string;
        bookings_count: number;
        movie_poster?: string;
        occupancy: number;
    }>;
    bookingsByStatus: Array<{
        status: string;
        count: number;
    }>;
    newUsersLast30Days: Array<{
        date: string;
        users: number;
    }>;
};
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
    }).format(value);
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const Dashboard = ({
    stats,
    bookingsLast7Days,
    topMovies,
    upcomingShowings,
    bookingsByStatus,
    newUsersLast30Days,
}: Props) => {
    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: "Oczekujące",
            confirmed: "Potwierdzone",
            cancelled: "Anulowane",
            expired: "Wygasłe",
        };
        return labels[status] || status;
    };

    console.log(newUsersLast30Days);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard - Panel Administracyjny
                    </h2>
                    <div className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString("pl-PL", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
                    {/* Statystyki ogólne */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Całkowity przychód
                                </CardTitle>
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(stats.totalRevenue)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {formatCurrency(stats.revenueThisMonth)} w
                                    tym miesiącu
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Rezerwacje
                                </CardTitle>
                                <Ticket className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.totalBookings}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.bookingsThisMonth} w tym miesiącu
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Użytkownicy
                                </CardTitle>
                                <Users className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.totalUsers}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {newUsersLast30Days.reduce(
                                        (acc, user) => acc + user.users,
                                        0
                                    )}{" "}
                                    nowych w tym miesiącu
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    Nagrody
                                </CardTitle>
                                <Award className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.rewardsUsedThisMonth}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Wykorzystanych w tym miesiącu
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Wykresy */}
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Rezerwacje i przychody z ostatnich 7 dni */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Rezerwacje i przychody (ostatnie 7 dni)
                                </CardTitle>
                                <CardDescription>
                                    Dzienny przegląd rezerwacji i przychodów
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{
                                        bookings: {
                                            label: "Rezerwacje",
                                            color: "#3b82f6",
                                        },
                                        revenue: {
                                            label: "Przychód (PLN)",
                                            color: "#10b981",
                                        },
                                    }}
                                    className="h-[300px] w-full"
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart data={bookingsLast7Days}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis
                                                yAxisId="left"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis
                                                yAxisId="right"
                                                orientation="right"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent
                                                        hideIndicator
                                                    />
                                                }
                                            />
                                            <Legend />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="bookings"
                                                fill="#3b82f6"
                                                name="Rezerwacje"
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <Bar
                                                yAxisId="right"
                                                dataKey="revenue"
                                                fill="#10b981"
                                                name="Przychód (PLN)"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Ilość rejestracji */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Ilość rejestracji
                                </CardTitle>
                                <CardDescription>
                                    Dzienny przegląd ilości nowych użytkowników
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {newUsersLast30Days.length > 0 ? (
                                        newUsersLast30Days
                                            .slice(-4)
                                            .reverse()
                                            .map((usersForDate) => (
                                                <div
                                                    key={usersForDate.date}
                                                    className="flex items-center justify-between px-4 py-1 transition-colors border rounded-lg hover:bg-accent/50"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <h4 className="font-semibold">
                                                                {
                                                                    usersForDate.date
                                                                }
                                                            </h4>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xl font-bold text-primary">
                                                            {usersForDate.users}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            rejestracji
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <div className="py-8 text-center text-muted-foreground">
                                            Brak nowych rejestracji w ciągu
                                            ostatnich 30 dni
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status rezerwacji */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status rezerwacji</CardTitle>
                                <CardDescription>
                                    Rozkład statusów wszystkich rezerwacji
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{
                                        count: {
                                            label: "Liczba",
                                        },
                                    }}
                                    className="h-[300px]"
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={bookingsByStatus}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ status, percent }) =>
                                                    `${getStatusLabel(
                                                        status
                                                    )}: ${(
                                                        percent * 100
                                                    ).toFixed(0)}%`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="count"
                                            >
                                                {bookingsByStatus.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                COLORS[
                                                                    index %
                                                                        COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <ChartTooltip
                                                content={({
                                                    active,
                                                    payload,
                                                }) => {
                                                    if (
                                                        active &&
                                                        payload &&
                                                        payload.length
                                                    ) {
                                                        return (
                                                            <div className="p-2 border rounded-lg shadow-lg bg-background">
                                                                <p className="font-semibold">
                                                                    {getStatusLabel(
                                                                        payload[0]
                                                                            .payload
                                                                            .status
                                                                    )}
                                                                </p>
                                                                <p className="text-sm">
                                                                    Liczba:{" "}
                                                                    {
                                                                        payload[0]
                                                                            .value
                                                                    }
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Top 5 filmów */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Najpopularniejsze filmy</CardTitle>
                                <CardDescription>
                                    Top 5 filmów według liczby rezerwacji
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={{
                                        bookings: {
                                            label: "Rezerwacje",
                                            color: "#8b5cf6",
                                        },
                                    }}
                                    className="h-[300px]"
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={topMovies}
                                            layout="vertical"
                                            margin={{ left: 100 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                type="number"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis
                                                dataKey="title"
                                                type="category"
                                                width={100}
                                                tick={{ fontSize: 11 }}
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent
                                                        hideIndicator
                                                    />
                                                }
                                            />
                                            <Bar
                                                dataKey="bookings"
                                                fill="#8b5cf6"
                                                name="Rezerwacje"
                                                radius={[0, 4, 4, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Nadchodzące seanse */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Nadchodzące seanse
                            </CardTitle>
                            <CardDescription>
                                5 najbliższych seansów w kinie
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingShowings.length > 0 ? (
                                    upcomingShowings.map((showing) => (
                                        <div
                                            key={showing.id}
                                            className="flex items-center justify-between p-4 transition-colors border rounded-lg hover:bg-accent/50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                                    {showing.movie_poster && (
                                                        <img
                                                            src={`/storage/${showing.movie_poster}`}
                                                            className="rounded-md"
                                                        />
                                                    )}
                                                    <Film className="w-6 h-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">
                                                        {showing.movie_title}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(
                                                                showing.start_time
                                                            ).toLocaleString(
                                                                "pl-PL",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </span>
                                                        <span>
                                                            Sala:{" "}
                                                            {
                                                                showing.hall_number
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-5">
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-primary">
                                                        {showing.bookings_count}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        rezerwacji
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-primary">
                                                        {new Intl.NumberFormat(
                                                            "pl-PL",
                                                            {
                                                                style: "percent",
                                                                minimumFractionDigits: 0,
                                                                maximumFractionDigits: 1,
                                                            }
                                                        ).format(
                                                            showing.occupancy
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        zajętości sali
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-muted-foreground">
                                        Brak nadchodzących seansów
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Dashboard;
