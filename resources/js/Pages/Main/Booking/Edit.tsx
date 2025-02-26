import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Separator } from "@/Components/ui/separator";
import MainLayout from "@/Layouts/MainLayout";
import { formatTime } from "@/lib/utils";
import { MainBookingRequest } from "@/schema";
import { Booking } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { add, differenceInSeconds, format } from "date-fns";
import { pl } from "date-fns/locale";
import { LoaderCircle, MoveLeft } from "lucide-react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ZodIssue } from "zod";

type Props = {
    booking: Booking;
    token: string;
};

const EditBooking = ({ booking, token }: Props) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const [isGoingBack, setIsGoingBack] = useState(false);
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

    const {
        data,
        setData,
        post,
        patch,
        errors,
        clearErrors,
        setError,
        processing,
    } = useForm({
        first_name: booking?.first_name || "",
        last_name: booking?.last_name || "",
        email: booking?.email || "",
        _type: "fillData",
        token: token,
    });
    const [didFail, setDidFail] = useState(false);
    const inputsRef = useRef<{
        first_name: HTMLInputElement | null;
        last_name: HTMLInputElement | null;
        email: HTMLInputElement | null;
    }>({
        first_name: null,
        last_name: null,
        email: null,
    });

    const validateInputs = () => {
        const parsed = MainBookingRequest.safeParse(data);
        const zodErrors =
            parsed?.error?.flatten((issue: ZodIssue) => ({
                message: issue.message,
                errorCode: issue.code,
            })).fieldErrors || {};
        Object.keys(data).forEach((key) => {
            if (zodErrors[key as keyof typeof zodErrors]) {
                setError(
                    key as keyof typeof zodErrors,
                    //@ts-ignore
                    zodErrors[key as keyof typeof zodErrors][0].message
                );
            } else {
                clearErrors(key as keyof typeof zodErrors);
            }
        });
        return zodErrors;
    };

    useEffect(() => {
        if (!didFail) return;
        validateInputs();
    }, [data]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const zodErrors = validateInputs();
        if (Object.keys(zodErrors).length !== 0) {
            inputsRef.current[
                Object.keys(zodErrors)[0] as keyof typeof zodErrors
            ]?.focus();
            setDidFail(true);
            return;
        }
        setIsUpdating(true);
        patch(route("main.bookings.update", { booking }, false), {
            onError: () => {
                setDidFail(true);
                setIsUpdating(false);
                toast.error("Nie udało się wypełnić danych rezerwacji");
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Uzupełnij dane rezerwacji" />
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
            <form
                onSubmit={submit}
                id="editBookingForm"
                className="mt-2 space-y-6 max-w-xl bg-background p-4 sm:rounded-lg sm:p-8 border mx-auto"
            >
                <div className="flex items-start w-full gap-5">
                    <div className="flex-1">
                        <Label
                            htmlFor="first_name"
                            className={`${
                                errors.first_name ? "!text-destructive" : ""
                            }`}
                        >
                            Imię
                        </Label>
                        <Input
                            type="text"
                            ref={(ref) =>
                                (inputsRef.current.first_name =
                                    ref as HTMLInputElement)
                            }
                            id="first_name"
                            value={data.first_name}
                            onChange={(e) => {
                                setData("first_name", e.target.value);
                            }}
                            className={`${
                                errors.first_name ? "!border-destructive" : ""
                            }`}
                        />

                        {errors.first_name && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.first_name}
                            </p>
                        )}
                    </div>
                    <div className="flex-1">
                        <Label
                            htmlFor="last_name"
                            className={`${
                                errors.last_name ? "!text-destructive" : ""
                            }`}
                        >
                            Nazwisko
                        </Label>
                        <Input
                            type="text"
                            ref={(ref) =>
                                (inputsRef.current.last_name =
                                    ref as HTMLInputElement)
                            }
                            id="last_name"
                            value={data.last_name}
                            onChange={(e) => {
                                setData("last_name", e.target.value);
                            }}
                            className={`${
                                errors.last_name ? "!border-destructive" : ""
                            }`}
                        />

                        {errors.last_name && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.last_name}
                            </p>
                        )}
                    </div>
                </div>
                <div>
                    <Label
                        htmlFor="email"
                        className={`${errors.email ? "!text-destructive" : ""}`}
                    >
                        Email
                    </Label>
                    <Input
                        type="text"
                        ref={(ref) =>
                            (inputsRef.current.email = ref as HTMLInputElement)
                        }
                        id="email"
                        value={data.email}
                        onChange={(e) => {
                            setData("email", e.target.value);
                        }}
                        className={`${
                            errors.email ? "!border-destructive" : ""
                        }`}
                    />

                    {errors.email && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>
                <div className="flex items-start w-full gap-5">
                    <div className="flex-1">
                        <Label htmlFor="num_people">Liczba osób</Label>
                        <Input
                            disabled
                            type="number"
                            id="num_people"
                            value={booking.num_people}
                        />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="price">Cena</Label>
                        <Input
                            disabled
                            type="number"
                            step={0.01}
                            id="price"
                            value={booking.price}
                        />
                    </div>
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
                            <LoaderCircle className="!h-5 !w-5 animate-spin" />
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
                            <LoaderCircle className="!h-5 !w-5 animate-spin" />
                        )}
                    </Button>
                    <Button
                        size={"lg"}
                        form="editBookingForm"
                        type="submit"
                        disabled={isUpdating}
                    >
                        {isUpdating && (
                            <LoaderCircle className="!h-5 !w-5 animate-spin" />
                        )}
                        Potwierdź
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
};

export default EditBooking;
