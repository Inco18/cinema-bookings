import { Button, buttonVariants } from "@/Components/ui/button";
import MainLayout from "@/Layouts/MainLayout";
import { Booking } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import React from "react";
import { toast } from "react-toastify";

type Props = { booking: Booking; token: string };

function BookingError({ booking, token }: Props) {
    return (
        <MainLayout>
            <Head title="Bład" />

            <div className="m-auto w-fit text-center mt-10 flex flex-col">
                <h1 className="text-3xl font-medium mb-5">
                    Podczas płatności wystąpił błąd
                </h1>
                <div className="flex justify-center w-full gap-5">
                    <Link
                        className={`${buttonVariants({
                            variant: "default",
                        })} flex-1`}
                        href={route("main.bookings.retry_payment", {
                            booking: booking.id,
                            token: token,
                        })}
                    >
                        Ponów płatność
                    </Link>
                    <Button
                        className="flex-1"
                        variant={"outline"}
                        onClick={() => {
                            router.delete(
                                route("main.bookings.destroy", {
                                    booking: booking.id,
                                    token,
                                }),
                                {
                                    onError: (error) => {
                                        toast.error(Object.values(error)[0]);
                                    },
                                }
                            );
                        }}
                    >
                        Anuluj rezerwację
                    </Button>
                </div>
                <p className="text-muted-foreground text-sm">
                    Id rezerwacji: {booking.id}
                </p>
            </div>
        </MainLayout>
    );
}

export default BookingError;
