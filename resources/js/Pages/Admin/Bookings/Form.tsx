import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";

import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { BookingRequest } from "@/schema";
import { Booking, Hall, Showing, User, Price } from "@/types";
import { BookingStatus, TicketType } from "@/types/enums";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ZodIssue } from "zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import ShowingPicker from "./ShowingPicker";
import UserPicker from "./UserPicker";
import SeatPicker from "@/Components/SeatPicker";

type Props = {
    booking?: Booking;
    showings: Showing[];
    users: User[];
    showing_id: number;
    hall: Hall;
    bookings: Booking[];
    prices: { normal: number; reduced: number };
};

const BookingForm = ({
    booking,
    showings,
    users,
    showing_id,
    hall,
    bookings,
    prices,
}: Props) => {
    const [normalTickets, setNormalTickets] = useState(0);
    const [reducedTickets, setReducedTickets] = useState(0);

    // Przygotuj dane seat_prices z booking
    const prepareSeatPrices = () => {
        if (!booking || !booking.seats) return [];
        return booking.seats.map(seat => ({
            seat_id: seat.id,
            price: seat.pivot?.price || 0,
            type: seat.pivot?.type || TicketType.NORMAL,
        }));
    };

    // Policz bilety z booking
    useEffect(() => {
        if (booking?.seats) {
            const normal = booking.seats.filter(s => s.pivot?.type === TicketType.NORMAL).length;
            const reduced = booking.seats.filter(s => s.pivot?.type === TicketType.REDUCED).length;
            setNormalTickets(normal);
            setReducedTickets(reduced);
        }
    }, [booking]);

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
        id: booking?.id || null,
        showing_id: booking?.showing_id || showing_id || showings[0].id,
        user_id: booking?.user_id || null,
        price: booking?.price || 0,
        first_name: booking?.first_name || "",
        last_name: booking?.last_name || "",
        email: booking?.email || "",
        status: booking?.status || BookingStatus.PAID,
        seats: booking?.seats?.map((seat) => seat.id) || [],
        normal_tickets: 0,
        reduced_tickets: 0,
        seat_prices: prepareSeatPrices(),
    });
    const [didFail, setDidFail] = useState(false);
    const inputsRef = useRef<{
        showing_id: HTMLButtonElement | null;
        user_id: HTMLButtonElement | null;
        normal_tickets: HTMLInputElement | null;
        reduced_tickets: HTMLInputElement | null;
        price: HTMLInputElement | null;
        first_name: HTMLInputElement | null;
        last_name: HTMLInputElement | null;
        email: HTMLInputElement | null;
        status: HTMLInputElement | null;
    }>({
        showing_id: null,
        user_id: null,
        normal_tickets: null,
        reduced_tickets: null,
        price: null,
        first_name: null,
        last_name: null,
        email: null,
        status: null,
    });

    useEffect(() => {
        if (data.seats.length === 0) {
            setData('seat_prices', []);
            return;
        }

        const totalTickets = normalTickets + reducedTickets;
        if (totalTickets !== data.seats.length) {
            return;
        }

        const newSeatPrices = data.seats.map((seatId, index) => ({
            seat_id: seatId,
            price: index < normalTickets ? prices.normal : prices.reduced,
            type: index < normalTickets ? TicketType.NORMAL : TicketType.REDUCED,
        }));

        setData('seat_prices', newSeatPrices);

        const totalPrice = newSeatPrices.reduce((sum, sp) => sum + Number(sp.price), 0);
        setData('price', totalPrice);
    }, [data.seats, normalTickets, reducedTickets]);

    const validateInputs = () => {
        const parsed = BookingRequest.safeParse(data);
        const zodErrors =
            parsed?.error?.flatten((issue: ZodIssue) => ({
                message: issue.message,
                errorCode: issue.code,
            })).fieldErrors || {};
        Object.keys(data).forEach((key) => {
            if (key === "showing_id" || key === "user_id") return;
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

        if (normalTickets + reducedTickets !== data.seats.length) {
            toast.error("Liczba biletów musi odpowiadać liczbie wybranych miejsc");
            return;
        }

        setData('normal_tickets', normalTickets);
        setData('reduced_tickets', reducedTickets);

        const zodErrors = validateInputs();
        if (Object.keys(zodErrors).length !== 0) {
            inputsRef.current[
                Object.keys(zodErrors)[0] as keyof typeof zodErrors
            ]?.focus();
            setDidFail(true);
            return;
        }

        const submitData = {
            ...data,
            normal_tickets: normalTickets,
            reduced_tickets: reducedTickets,
        };

        if (booking) {
            router.patch(route("bookings.update", { booking }), submitData, {
                onError: (e) => {
                    setDidFail(true);
                    console.log(e);
                    toast.error("Nie udało się zaktualizować rezerwacji");
                },
            });
        } else {
            router.post(route("bookings.store"), submitData, {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się dodać rezerwacji");
                },
            });
        }
    };


    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {booking
                            ? "Rezerwacje - Edycja"
                            : "Rezerwacje - Tworzenie"}
                    </h2>
                </>
            }
        >
            <Head
                title={
                    booking ? "Rezerwacje - Edycja" : "Rezerwacje - Tworzenie"
                }
            />
            <div className="flex items-start justify-center gap-5">
                <form
                    onSubmit={submit}
                    className="max-w-xl p-4 mt-2 space-y-6 border bg-background sm:rounded-lg sm:p-8"
                >
                    <div>
                        <Label
                            htmlFor="showing"
                            className={`${
                                errors.showing_id ? "!text-destructive" : ""
                            }`}
                        >
                            Seans
                        </Label>
                        <ShowingPicker
                            id="showing"
                            ref={(ref) =>
                                (inputsRef.current.showing_id =
                                    ref as HTMLButtonElement)
                            }
                            showings={showings}
                            value={String(data.showing_id)}
                            setValue={(value: string) => {
                                setData((data) => ({
                                    ...data,
                                    showing_id: Number(value),
                                    seats: [],
                                }));
                                setNormalTickets(0);
                                setReducedTickets(0);
                                router.visit(
                                    route(
                                        `bookings.${
                                            booking ? "edit" : "create"
                                        }`,
                                        {
                                            ...route().queryParams,
                                            booking: booking
                                                ? booking.id
                                                : null,
                                            showing_id: value,
                                        }
                                    ),
                                    {
                                        only: ["hall", "bookings"],
                                        preserveState: true,
                                        replace: true,
                                    }
                                );
                            }}
                        />
                        {errors.showing_id && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.showing_id}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label
                            htmlFor="user"
                            className={`${
                                errors.user_id ? "!text-destructive" : ""
                            }`}
                        >
                            Użytkownik (opcjonalny)
                        </Label>
                        <UserPicker
                            id="user"
                            ref={(ref) =>
                                (inputsRef.current.user_id =
                                    ref as HTMLButtonElement)
                            }
                            users={users}
                            value={
                                data.user_id ? String(data.user_id) : undefined
                            }
                            setValue={(value: string) => {
                                setData("user_id", Number(value));
                            }}
                        />
                        {errors.user_id && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.user_id}
                            </p>
                        )}
                    </div>
                    <div className="flex-1">
                        <Label
                            htmlFor="status"
                            className={`${
                                errors.status ? "!text-destructive" : ""
                            }`}
                        >
                            Status
                        </Label>
                        <Select
                            onValueChange={(val) => {
                                clearErrors("status");
                                setData("status", val as BookingStatus);
                            }}
                            defaultValue={data.status}
                        >
                            <SelectTrigger
                                id="status"
                                ref={(ref) =>
                                    (inputsRef.current.status =
                                        ref as HTMLInputElement)
                                }
                                className={`mt-1 ${
                                    errors.status ? "!border-destructive" : ""
                                }`}
                            >
                                <SelectValue placeholder="Wybierz typ" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(BookingStatus).map(
                                    (bookingStatus) => {
                                        return (
                                            <SelectItem
                                                key={bookingStatus}
                                                value={bookingStatus}
                                            >
                                                {bookingStatus}
                                            </SelectItem>
                                        );
                                    }
                                )}
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.status}
                            </p>
                        )}
                    </div>
                    <div className="flex items-start w-full gap-5">
                        <div className="flex-1">
                            <Label
                                htmlFor="normal_tickets"
                                className={`${
                                    errors.normal_tickets ? "!text-destructive" : ""
                                }`}
                            >
                                Bilety normalne
                            </Label>
                            <Input
                                type="number"
                                ref={(ref) =>
                                    (inputsRef.current.normal_tickets =
                                        ref as HTMLInputElement)
                                }
                                id="normal_tickets"
                                value={normalTickets}
                                onChange={(e) => {
                                    setNormalTickets(Number(e.target.value));
                                }}
                                className={`mt-1 ${
                                    errors.normal_tickets
                                        ? "!border-destructive"
                                        : ""
                                }`}
                                min="0"
                            />

                            {errors.normal_tickets && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.normal_tickets}
                                </p>
                            )}
                        </div>
                        <div className="flex-1">
                            <Label
                                htmlFor="reduced_tickets"
                                className={`${
                                    errors.reduced_tickets ? "!text-destructive" : ""
                                }`}
                            >
                                Bilety ulgowe
                            </Label>
                            <Input
                                type="number"
                                ref={(ref) =>
                                    (inputsRef.current.reduced_tickets =
                                        ref as HTMLInputElement)
                                }
                                id="reduced_tickets"
                                value={reducedTickets}
                                onChange={(e) => {
                                    setReducedTickets(Number(e.target.value));
                                }}
                                className={`mt-1 ${
                                    errors.reduced_tickets
                                        ? "!border-destructive"
                                        : ""
                                }`}
                                min="0"
                            />

                            {errors.reduced_tickets && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.reduced_tickets}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start w-full gap-5">
                        <div className="flex-1">
                            <Label htmlFor="seats_info" className="text-muted-foreground">
                                Wybrane miejsca
                            </Label>
                            <Input
                                disabled
                                type="number"
                                id="seats_info"
                                value={data.seats.length}
                                className="mt-1"
                            />
                        </div>
                        <div className="flex-1">
                            <Label
                                htmlFor="price"
                                className={`${
                                    errors.price ? "!text-destructive" : ""
                                }`}
                            >
                                Cena całkowita (zł)
                            </Label>
                            <Input
                                type="number"
                                step={0.01}
                                ref={(ref) =>
                                    (inputsRef.current.price =
                                        ref as HTMLInputElement)
                                }
                                id="price"
                                value={data.price}
                                onChange={(e) => {
                                    setData("price", Number(e.target.value));
                                }}
                                className={`mt-1 ${
                                    errors.price ? "!border-destructive" : ""
                                }`}
                            />

                            {errors.price && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.price}
                                </p>
                            )}
                        </div>
                    </div>
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
                                className={`mt-1 ${
                                    errors.first_name
                                        ? "!border-destructive"
                                        : ""
                                }`}
                            />

                            {errors.first_name && (
                                <p className="mt-1 text-sm text-destructive">
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
                                className={`mt-1 ${
                                    errors.last_name
                                        ? "!border-destructive"
                                        : ""
                                }`}
                            />

                            {errors.last_name && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.last_name}
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <Label
                            htmlFor="email"
                            className={`${
                                errors.email ? "!text-destructive" : ""
                            }`}
                        >
                            Email
                        </Label>
                        <Input
                            type="text"
                            ref={(ref) =>
                                (inputsRef.current.email =
                                    ref as HTMLInputElement)
                            }
                            id="email"
                            value={data.email}
                            onChange={(e) => {
                                setData("email", e.target.value);
                            }}
                            className={`mt-1 ${
                                errors.email ? "!border-destructive" : ""
                            }`}
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() =>
                                router.get(route("bookings.index"), {
                                    ...route().queryParams,
                                    showing_id: undefined,
                                })
                            }
                        >
                            Anuluj
                        </Button>
                        <Button disabled={processing}>
                            {booking ? "Zapisz" : "Stwórz"}
                        </Button>
                    </div>
                </form>
                <div>
                    <SeatPicker
                        hall={hall}
                        showingBookings={bookings}
                        selectedSeats={data.seats}
                        setSelectedSeats={(updater) => {
                            setData((data) => {
                                //@ts-ignore
                                const newSeats = updater(data.seats);
                                return {
                                    ...data,
                                    seats: newSeats,
                                };
                            });
                        }}
                    />
                    {errors.seats && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.seats}
                        </p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default BookingForm;
