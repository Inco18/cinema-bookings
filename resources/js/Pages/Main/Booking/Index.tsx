import { Badge } from "@/Components/ui/badge";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import MainLayout from "@/Layouts/MainLayout";
import { Booking } from "@/types";
import { BookingStatus } from "@/types/enums";
import { Head, router, WhenVisible } from "@inertiajs/react";
import { format, isPast } from "date-fns";
import { pl } from "date-fns/locale";
import { Download, LoaderCircle } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

type Props = {
    bookings: Booking[];
    page: number;
    isNextPageExists: boolean;
};

function getMovieTitleWithInfo(booking: Booking): JSX.Element {
    return (
        <div className="opacity-100 line-clamp-1 break-all">
            <h1 className="font-bold inline">
                {booking.showing!.movie?.title}
            </h1>
            <span> /</span>
            <p className="inline"> {booking.showing!.type.toUpperCase()}</p>
            {booking.showing!.speech_lang === "PL" && (
                <>
                    {" "}
                    / <p className="inline"> POLSKI</p>
                </>
            )}
            {booking.showing!.subtitles_lang && (
                <>
                    {" "}
                    /{" "}
                    <p className="inline">
                        NAPISY: {booking.showing!.subtitles_lang}
                    </p>
                </>
            )}
            {booking.showing!.dubbing_lang && (
                <>
                    {" "}
                    /{" "}
                    <p className="inline">
                        DUBBING: {booking.showing!.dubbing_lang}
                    </p>
                </>
            )}
        </div>
    );
}

function getBookingBadge(booking: Booking): JSX.Element {
    if (booking.status === BookingStatus.RESERVED)
        return (
            <Badge className="bg-red-600 pointer-events-none">
                {booking.status}
            </Badge>
        );
    else if (booking.status === BookingStatus.FILLED)
        return (
            <Badge className="bg-orange-600 pointer-events-none">
                {booking.status}
            </Badge>
        );
    else if (booking.status === BookingStatus.PAID)
        return (
            <Badge className="bg-green-600 pointer-events-none">
                {booking.status}
            </Badge>
        );
    else return <Badge className="pointer-events-none">{booking.status}</Badge>;
}

const Index = ({ bookings, page, isNextPageExists }: Props) => {
    return (
        <MainLayout>
            <Head title="Twoje rezerwacje" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl lg:px-8">
                    <h1 className="text-3xl font-semibold">Twoje rezerwacje</h1>
                    <div className="flex flex-col gap-2 mt-5">
                        {bookings.map((booking) => {
                            const movie = booking.showing!.movie;
                            return (
                                <Sheet key={booking.id}>
                                    <SheetTrigger asChild>
                                        <div className="bg-background p-4 rounded-md flex flex-row items-center gap-5 cursor-pointer transition-all hover:scale-[102%] hover:shadow-xl">
                                            <div className="flex gap-5 md:block">
                                                <div className="w-16 md:w-20 shrink-0">
                                                    <img
                                                        src={
                                                            movie?.poster_image
                                                                ? `/storage/${movie?.poster_image}`
                                                                : "/no-poster.webp"
                                                        }
                                                        className="rounded-md"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-center md:text-xl gap-2">
                                                {getMovieTitleWithInfo(booking)}
                                                <p className="text-sm md:text-lg">
                                                    {format(
                                                        new Date(
                                                            booking.showing!.start_time
                                                        ),
                                                        "dd MMMM yyyy HH:mm",
                                                        { locale: pl }
                                                    )}
                                                </p>
                                            </div>
                                            <div className="ml-auto">
                                                {getBookingBadge(booking)}
                                                <p className="md:text-lg font-semibold my-2 text-right">
                                                    {booking.price} zł
                                                </p>
                                            </div>
                                        </div>
                                    </SheetTrigger>

                                    <SheetContent className="md:w-[35rem] !max-w-full max-h-screen overflow-y-auto">
                                        <SheetHeader>
                                            <SheetTitle className="font-normal md:text-2xl text-left">
                                                {getMovieTitleWithInfo(booking)}
                                            </SheetTitle>
                                        </SheetHeader>
                                        <div className="flex flex-col">
                                            <p className="text-sm md:text-lg">
                                                {format(
                                                    new Date(
                                                        booking.showing!.start_time
                                                    ),
                                                    "dd MMMM yyyy HH:mm",
                                                    { locale: pl }
                                                )}{" "}
                                                -{" "}
                                                {format(
                                                    new Date(
                                                        booking.showing!.end_time
                                                    ),
                                                    "dd MMMM yyyy HH:mm",
                                                    { locale: pl }
                                                )}
                                            </p>
                                            <p className="md:text-lg font-semibold">
                                                Sala:{" "}
                                                {booking.seats![0].hall?.number}
                                            </p>
                                            <p className="md:text-lg font-semibold mt-2">
                                                Miejsca:
                                            </p>
                                            <div className="flex flex-col gap-2">
                                                {booking.seats?.map(
                                                    (seat, i) => {
                                                        return (
                                                            <>
                                                                <div
                                                                    key={
                                                                        seat.id
                                                                    }
                                                                >
                                                                    rząd:{" "}
                                                                    <span className="font-semibold">
                                                                        {
                                                                            seat.row
                                                                        }
                                                                    </span>{" "}
                                                                    miejsce:{" "}
                                                                    <span className="font-semibold">
                                                                        {
                                                                            seat.number
                                                                        }
                                                                    </span>
                                                                    <p>
                                                                        Cena:{" "}
                                                                        <span className="font-semibold">
                                                                            {(
                                                                                booking.price /
                                                                                booking.num_people
                                                                            ).toFixed(
                                                                                2
                                                                            )}
                                                                            zł
                                                                        </span>
                                                                    </p>
                                                                    <p>
                                                                        Bilet:{" "}
                                                                        <span className="font-semibold">
                                                                            normalny
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                                <Separator
                                                                    key={
                                                                        "sep" +
                                                                        seat.id
                                                                    }
                                                                />
                                                            </>
                                                        );
                                                    }
                                                )}
                                            </div>
                                            <p className="mt-5">
                                                Łączna cena:{" "}
                                                <span className="font-semibold ">
                                                    {booking.price as number} zł
                                                </span>
                                            </p>
                                            <p className="mt-2">
                                                Imię:{" "}
                                                <span className="font-semibold">
                                                    {booking.first_name}
                                                </span>
                                            </p>
                                            <p>
                                                Nazwisko:{" "}
                                                <span className="font-semibold">
                                                    {booking.last_name}
                                                </span>
                                            </p>
                                            <p>
                                                Email:{" "}
                                                <span className="font-semibold">
                                                    {booking.email}
                                                </span>
                                            </p>

                                            <div className="w-fit mt-2">
                                                Status:{" "}
                                                {getBookingBadge(booking)}
                                            </div>

                                            {!isPast(
                                                booking.showing!.end_time
                                            ) &&
                                                booking.status ===
                                                    BookingStatus.PAID && (
                                                    <a
                                                        href={route(
                                                            "main.bookings.tickets",
                                                            {
                                                                booking:
                                                                    booking.id,
                                                                token: booking.token,
                                                            }
                                                        )}
                                                        target="_blank"
                                                        className={
                                                            buttonVariants({
                                                                variant:
                                                                    "default",
                                                                size: "lg",
                                                            }) + " mt-5"
                                                        }
                                                    >
                                                        <Download />
                                                        Pobierz bilety
                                                    </a>
                                                )}
                                            {booking.status !==
                                                BookingStatus.PAID && (
                                                <Button
                                                    className="flex-1 mt-2"
                                                    variant={"secondary"}
                                                    onClick={() => {
                                                        router.delete(
                                                            route(
                                                                "main.bookings.destroy",
                                                                {
                                                                    booking:
                                                                        booking.id,
                                                                    token: booking.token,
                                                                }
                                                            ),
                                                            {
                                                                onError: (
                                                                    error
                                                                ) => {
                                                                    toast.error(
                                                                        Object.values(
                                                                            error
                                                                        )[0]
                                                                    );
                                                                },
                                                            }
                                                        );
                                                    }}
                                                >
                                                    Anuluj rezerwację
                                                </Button>
                                            )}

                                            <p className="text-gray-400 text-sm mt-2 mx-auto">
                                                Rezerwacja {booking.id}
                                            </p>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            );
                        })}
                    </div>
                    {isNextPageExists && (
                        <WhenVisible
                            always
                            params={{
                                data: {
                                    page: +page + 1,
                                },
                                only: ["bookings", "page", "isNextPageExists"],
                            }}
                            fallback={
                                <div className="w-full flex items-center justify-center p-3">
                                    <LoaderCircle className="animate-spin w-8 h-8" />
                                </div>
                            }
                        >
                            <div className="w-full flex items-center justify-center p-3">
                                <LoaderCircle className="animate-spin w-8 h-8" />
                            </div>
                        </WhenVisible>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Index;
