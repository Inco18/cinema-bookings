import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Separator } from "@/Components/ui/separator";
import MainLayout from "@/Layouts/MainLayout";
import { formatPrice, formatTime } from "@/lib/utils";
import { Booking } from "@/types";
import { TicketType } from "@/types/enums";
import { Head, router, useForm } from "@inertiajs/react";
import { add, differenceInSeconds, format } from "date-fns";
import { pl } from "date-fns/locale";
import { LoaderCircle, Minus, MoveLeft, MoveRight, Plus } from "lucide-react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    booking: Booking;
    token: string;
    prices: Record<TicketType, number>;
};

const ChooseTickets = ({ booking, token, prices }: Props) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const [isGoingBack, setIsGoingBack] = useState(false);
    const [remainingTimeSeconds, setRemainingTimeSeconds] = useState(
        differenceInSeconds(
            add(new Date(booking.updated_at!), { minutes: 15 }),
            new Date()
        )
    );
    const numPeople = booking.seats?.length || 0;
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
    const normalCount = booking.seats?.filter(
        (seat) => seat.pivot.type === TicketType.NORMAL
    ).length;
    const reducedCount = booking.seats?.filter(
        (seat) => seat.pivot.type === TicketType.REDUCED
    ).length;

    const { data, setData, patch, errors } = useForm({
        normal:
            normalCount === 0 && reducedCount === 0 ? numPeople : normalCount,
        reduced: reducedCount || 0,
        prices: prices,
        token: token,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (data.normal + data.reduced !== numPeople) {
            toast.error(
                "Liczba biletów nie zgadza się z wybraną ilością miejsc"
            );
            return;
        }

        setIsUpdating(true);
        patch(route("main.bookings.updateTickets", { booking }, false), {
            onError: () => {
                setIsUpdating(false);
                toast.error("Nie udało się wybrać biletów");
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Wybierz bilety" />
            <div className="bg-white mt-2 w-fit mx-auto px-2 rounded-md">
                Czas pozostały na wypełnienie danych:{" "}
                <span className="font-semibold">
                    {formatTime(remainingTimeSeconds)}
                </span>
            </div>
            <div className="py-3">
                <div className="mx-auto max-w-7xl lg:px-8">
                    <div className="bg-indigo-700 text-primary-foreground shadow-sm lg:rounded-lg py-3 px-3 lg:px-6">
                        <div className="flex flex-col md:flex-row md:justify-between items-end md:items-center gap-2">
                            <p className="font-medium text-md">
                                Sala {booking.showing?.hall?.id}
                            </p>
                            <Separator className="flex md:hidden opacity-50" />
                            <p className="font-bold text-md">
                                {format(
                                    new Date(booking.showing?.start_time!),
                                    "dd MMMM yyyy HH:mm",
                                    { locale: pl }
                                )}
                            </p>
                        </div>
                        <Separator className="opacity-50 my-2" />
                        <div className="flex flex-col md:flex-row md:items-center text-md md:text-lg gap-2">
                            <h1 className="font-bold">
                                {booking.showing?.movie?.title}
                            </h1>
                            <div className="flex items-center text-xs opacity-70 md:opacity-100 md:text-lg gap-2">
                                <span className="hidden md:inline">/</span>
                                <p> {booking.showing?.type.toUpperCase()}</p>
                                {booking.showing?.speech_lang === "PL" && (
                                    <>
                                        /<p> POLSKI</p>
                                    </>
                                )}
                                {booking.showing?.subtitles_lang && (
                                    <>
                                        /
                                        <p>
                                            NAPISY:{" "}
                                            {booking.showing?.subtitles_lang}
                                        </p>
                                    </>
                                )}
                                {booking.showing?.dubbing_lang && (
                                    <>
                                        /
                                        <p>
                                            DUBBING:{" "}
                                            {booking.showing?.dubbing_lang}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        <Separator className="opacity-50 my-2" />
                        <div className="flex flex-row md:items-center text-sm md:text-md gap-2">
                            Miejsca (rząd/numer):{" "}
                            {booking.seats?.map((seat) => (
                                <span key={seat.id}>
                                    {seat.row}/{seat.number}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <h1 className="text-2xl mt-2 space-y-6 max-w-4xl mx-auto px-3 md:px-0">
                Wybierz bilety
            </h1>
            <form
                onSubmit={submit}
                id="chooseTicketsForm"
                className="mt-2 space-y-6 max-w-4xl bg-background p-2 sm:rounded-lg sm:p-4 border mx-auto mb-20"
            >
                <div className="flex flex-col w-full gap-3">
                    <div className="flex-1 flex flex-col md:flex-row justify-between md:items-center gap-3 bg-secondary p-2 rounded-lg">
                        <Label htmlFor="normal">Normalny</Label>
                        <div className="flex items-center gap-5">
                            <p className="text-sm">
                                {formatPrice(prices.normal)}
                            </p>
                            <Separator orientation="vertical" className="h-8" />
                            <div className="flex">
                                <Button
                                    type="button"
                                    variant={"outline"}
                                    className="w-12 h-12 !rounded-r-none"
                                    onClick={() => {
                                        if (data.normal > 0) {
                                            setData({
                                                ...data,
                                                normal: data.normal - 1,
                                                reduced: data.reduced + 1,
                                            });
                                        }
                                    }}
                                >
                                    <Minus />
                                </Button>
                                <div className="text-2xl bg-background border shadow-xs flex items-center justify-center w-16 h-12">
                                    {data.normal}
                                </div>
                                <Button
                                    type="button"
                                    variant={"outline"}
                                    className="w-12 h-12 !rounded-l-none"
                                    onClick={() => {
                                        if (data.normal < numPeople) {
                                            setData({
                                                ...data,
                                                normal: data.normal + 1,
                                                reduced: data.reduced - 1,
                                            });
                                        }
                                    }}
                                >
                                    <Plus />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col md:flex-row justify-between md:items-center gap-3 bg-secondary p-2 rounded-lg">
                        <Label
                            htmlFor="reduced"
                            className="flex flex-col items-start gap-0 justify-start"
                        >
                            Ulgowy
                            <p className="text-foreground/60 text-xs">
                                Dostępny dla dzieci, młodzieży, studentów i
                                seniorów za okazaniem ważnej legitymacji.
                            </p>
                        </Label>
                        <div className="flex items-center gap-5">
                            <p className="text-sm">
                                {formatPrice(prices.reduced)}
                            </p>
                            <Separator orientation="vertical" className="h-8" />
                            <div className="flex">
                                <Button
                                    type="button"
                                    variant={"outline"}
                                    className="w-12 h-12 !rounded-r-none"
                                    onClick={() => {
                                        if (data.reduced > 0) {
                                            setData({
                                                ...data,
                                                reduced: data.reduced - 1,
                                                normal: data.normal + 1,
                                            });
                                        }
                                    }}
                                >
                                    <Minus />
                                </Button>
                                <div className="text-2xl bg-background border shadow-xs flex items-center justify-center w-16 h-12">
                                    {data.reduced}
                                </div>
                                <Button
                                    type="button"
                                    variant={"outline"}
                                    className="w-12 h-12 !rounded-l-none"
                                    onClick={() => {
                                        if (data.reduced < numPeople) {
                                            setData({
                                                ...data,
                                                reduced: data.reduced + 1,
                                                normal: data.normal - 1,
                                            });
                                        }
                                    }}
                                >
                                    <Plus />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <Input
                        name="discount_code"
                        placeholder="Kod rabatowy"
                        className="md:max-w-52"
                    />
                    <p className="text-xl text-right">
                        Łączna cena:{" "}
                        <span className="font-semibold">
                            {formatPrice(
                                prices.normal * data.normal +
                                    prices.reduced * data.reduced
                            )}
                        </span>
                    </p>
                </div>
            </form>
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
                        className="ml-auto mr-2"
                        size={"lg"}
                        variant="outline"
                        disabled={isGoingBack}
                        onClick={() => {
                            setIsGoingBack(true);
                            router.get(
                                route("main.bookings.edit_seats", {
                                    booking: booking.id,
                                    token: token,
                                })
                            );
                        }}
                    >
                        <MoveLeft /> Wróć
                        {isGoingBack && (
                            <LoaderCircle className="h-5! w-5! animate-spin" />
                        )}
                    </Button>
                    <Button
                        size={"lg"}
                        form="chooseTicketsForm"
                        type="submit"
                        disabled={isUpdating}
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
};

export default ChooseTickets;
