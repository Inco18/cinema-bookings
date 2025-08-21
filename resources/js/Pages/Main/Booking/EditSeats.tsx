import { Separator } from "@/Components/ui/separator";
import MainLayout from "@/Layouts/MainLayout";
import { Booking, Showing } from "@/types";
import { Head, router } from "@inertiajs/react";
import { add, differenceInSeconds, format } from "date-fns";
import { pl } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import SeatPicker from "../../../Components/SeatPicker";
import { Button } from "@/Components/ui/button";
import { LoaderCircle, MoveRight } from "lucide-react";
import { toast } from "react-toastify";
import { formatTime } from "@/lib/utils";

type Props = {
    showing: Showing;
    seats: number[];
    booking: Booking;
    token: string;
};

export default function EditSeats({ showing, seats, booking, token }: Props) {
    const [selectedSeats, setSelectedSeats] = useState<number[]>(seats);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const [remainingTimeSeconds, setRemainingTimeSeconds] = useState(
        differenceInSeconds(
            add(new Date(booking.updated_at!), { minutes: 15 }),
            new Date()
        )
    );
    useEffect(() => {
        const interval = setInterval(() => {
            if (remainingTimeSeconds < 1) {
                router.delete(
                    route("main.bookings.destroy", {
                        booking: booking.id,
                        type: "timeRunOut",
                        token: token,
                    })
                );
            }
            setRemainingTimeSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    });

    return (
        <MainLayout>
            <Head title="Wybierz miejsca" />
            <div className="bg-white mt-2 w-fit mx-auto px-2 rounded-md">
                Czas pozostały na wypełnienie danych:{" "}
                <span className="font-semibold">
                    {formatTime(remainingTimeSeconds)}
                </span>
            </div>
            <div className="py-3 mb-16">
                <div className="mx-auto max-w-7xl lg:px-8">
                    <div className="bg-indigo-700 text-primary-foreground shadow-sm lg:rounded-lg py-6 px-6 lg:px-12">
                        <div className="flex flex-col md:flex-row md:justify-between items-end md:items-center gap-2">
                            <p className="font-medium text-lg">
                                Sala {showing.hall?.id}
                            </p>
                            <Separator className="flex md:hidden opacity-50" />
                            <p className="font-bold text-xl">
                                {format(
                                    new Date(showing.start_time),
                                    "dd MMMM yyyy HH:mm",
                                    { locale: pl }
                                )}
                            </p>
                        </div>
                        <Separator className="opacity-50 my-5" />
                        <div className="flex flex-col md:flex-row md:items-center text-xl md:text-3xl gap-2">
                            <h1 className="font-bold">
                                {showing.movie?.title}
                            </h1>
                            <div className="flex items-center text-sm opacity-70 md:opacity-100 md:text-3xl gap-2">
                                <span className="hidden md:inline">/</span>
                                <p> {showing.type.toUpperCase()}</p>
                                {showing.speech_lang === "PL" && (
                                    <>
                                        /<p> POLSKI</p>
                                    </>
                                )}
                                {showing.subtitles_lang && (
                                    <>
                                        /<p>NAPISY: {showing.subtitles_lang}</p>
                                    </>
                                )}
                                {showing.dubbing_lang && (
                                    <>
                                        /<p>DUBBING: {showing.dubbing_lang}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <SeatPicker
                        hall={showing.hall!}
                        showingBookings={showing.bookings!}
                        selectedSeats={selectedSeats}
                        setSelectedSeats={setSelectedSeats}
                    />
                </div>
            </div>
            <div className="fixed bottom-0 w-full bg-background">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4 w-full flex justify-between">
                    <Button
                        size={"lg"}
                        variant="secondary"
                        disabled={isCanceling}
                        onClick={() => {
                            setIsCanceling(true);
                            router.delete(
                                route("main.bookings.destroy", {
                                    booking: booking.id,
                                    token: token,
                                }),
                                {
                                    onError: (error) => {
                                        setIsCanceling(false);
                                        toast.error(Object.values(error)[0]);
                                    },
                                }
                            );
                        }}
                    >
                        {isCanceling && (
                            <LoaderCircle className="h-5! w-5! animate-spin" />
                        )}
                        Anuluj
                    </Button>
                    <Button
                        size={"lg"}
                        disabled={selectedSeats.length < 1 || isUpdating}
                        onClick={() => {
                            setIsUpdating(true);
                            router.patch(
                                route("main.bookings.update_seats", {
                                    booking: booking.id,
                                    token: token,
                                }),
                                {
                                    seats: selectedSeats,
                                },
                                {
                                    preserveScroll: true,
                                    preserveState: true,
                                    onError: (error) => {
                                        setIsUpdating(false);
                                        toast.error(Object.values(error)[0]);
                                    },
                                }
                            );
                        }}
                    >
                        {isUpdating && (
                            <LoaderCircle className="h-5! w-5! animate-spin" />
                        )}
                        Dalej
                        <MoveRight />
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
}
