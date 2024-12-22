import { Separator } from "@/Components/ui/separator";
import MainLayout from "@/Layouts/MainLayout";
import { Showing } from "@/types";
import { Head, router } from "@inertiajs/react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import React, { useState } from "react";
import SeatPicker from "../../../Components/SeatPicker";
import { Button } from "@/Components/ui/button";
import { MoveRight } from "lucide-react";
import { toast } from "react-toastify";

type Props = {
    showing: Showing;
};

export default function CreateBooking({ showing }: Props) {
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    return (
        <MainLayout>
            <Head title="Wybierz miejsca" />

            <div className="py-6">
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
            <div className="sticky bottom-0 w-full bg-background">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4 w-full flex justify-end">
                    <Button
                        size={"lg"}
                        disabled={selectedSeats.length < 1}
                        onClick={() => {
                            router.post(
                                route("main.bookings.store"),
                                {
                                    seats: selectedSeats,
                                    showing_id: showing.id,
                                },
                                {
                                    preserveScroll: true,
                                    preserveState: true,
                                    onError: (error) => {
                                        toast.error(Object.values(error)[0]);
                                    },
                                }
                            );
                        }}
                    >
                        Dalej
                        <MoveRight />
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
}
