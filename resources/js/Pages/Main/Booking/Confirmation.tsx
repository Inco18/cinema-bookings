import { buttonVariants } from "@/Components/ui/button";
import MainLayout from "@/Layouts/MainLayout";
import { Booking } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Download } from "lucide-react";

type Props = { booking: Booking; token: string };

const BookingConfirmation = ({ booking, token }: Props) => {
    return (
        <MainLayout>
            <Head title="Dziękujemy za zakup" />

            <div className="m-auto w-fit text-center mt-10 flex flex-col">
                <h1 className="text-3xl font-medium mb-5">
                    Dziękujemy za dokonanie rezerwacji
                </h1>
                <h2 className="text-xl mb-2">
                    Twoje bilety zostały wysłane na podany adres e-mail
                </h2>
                <h3>Możesz też pobrać je teraz naciskając poniższy przycisk</h3>
                <a
                    href={route("main.bookings.tickets", {
                        booking: booking.id,
                        token: token,
                    })}
                    target="_blank"
                    className={
                        buttonVariants({
                            variant: "default",
                            size: "lg",
                        }) + " mt-5"
                    }
                >
                    <Download />
                    Pobierz bilety
                </a>
                <p className="text-muted-foreground text-sm">
                    Id rezerwacji: {booking.id}
                </p>
            </div>
        </MainLayout>
    );
};

export default BookingConfirmation;
