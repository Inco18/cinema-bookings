import MainLayout from "@/Layouts/MainLayout";
import { Booking } from "@/types";
import { Head, usePoll } from "@inertiajs/react";
import { useEffect } from "react";

type Props = { booking: Booking; token: string };

function BookingError({ booking, token }: Props) {
    usePoll(5000);
    return (
        <MainLayout>
            <Head title="Oczekująca płatność" />

            <div className="m-auto w-fit text-center mt-10 flex flex-col">
                <h1 className="text-3xl font-medium mb-5">
                    Płatność oczekuje na potwierdzenie
                </h1>
                <p className="text-muted-foreground text-sm">
                    Id rezerwacji: {booking.id}
                </p>
            </div>
        </MainLayout>
    );
}

export default BookingError;
