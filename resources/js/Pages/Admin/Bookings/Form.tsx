import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";

import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { BookingRequest } from "@/schema";
import { Booking, Hall, Showing, User } from "@/types";
import { BookingStatus } from "@/types/enums";
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
};

export const TICKET_PRICE = 31.5;

const BookingForm = ({
    booking,
    showings,
    users,
    showing_id,
    hall,
    bookings,
}: Props) => {
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
        showing_id: booking?.showing_id || showing_id || showings[0].id,
        user_id: booking?.user_id || null,
        num_people: booking?.num_people || 0,
        price: booking?.price || 0,
        first_name: booking?.first_name || "",
        last_name: booking?.last_name || "",
        email: booking?.email || "",
        status: booking?.status || BookingStatus.PAID,
        seats: booking?.seats?.map((seat) => seat.id) || [],
    });
    const [didFail, setDidFail] = useState(false);
    const inputsRef = useRef<{
        showing_id: HTMLButtonElement | null;
        user_id: HTMLButtonElement | null;
        num_people: HTMLInputElement | null;
        price: HTMLInputElement | null;
        first_name: HTMLInputElement | null;
        last_name: HTMLInputElement | null;
        email: HTMLInputElement | null;
        status: HTMLInputElement | null;
    }>({
        showing_id: null,
        user_id: null,
        num_people: null,
        price: null,
        first_name: null,
        last_name: null,
        email: null,
        status: null,
    });

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
        const zodErrors = validateInputs();
        if (Object.keys(zodErrors).length !== 0) {
            inputsRef.current[
                Object.keys(zodErrors)[0] as keyof typeof zodErrors
            ]?.focus();
            setDidFail(true);
            return;
        }
        if (booking) {
            patch(route("bookings.update", { booking }, false), {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się zaktualizować rezerwacji");
                },
            });
        } else {
            post(route("bookings.store"), {
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
            <div className="flex justify-center gap-5 items-start">
                <form
                    onSubmit={submit}
                    className="mt-2 space-y-6 max-w-xl bg-background p-4 sm:rounded-lg sm:p-8 border"
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
                                    num_people: 0,
                                }));
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
                            <p className="text-sm text-destructive mt-1">
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
                            <p className="text-sm text-destructive mt-1">
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
                                className={`${
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
                            <p className="text-sm text-destructive mt-1">
                                {errors.status}
                            </p>
                        )}
                    </div>
                    <div className="flex items-start w-full gap-5">
                        <div className="flex-1">
                            <Label
                                htmlFor="num_people"
                                className={`${
                                    errors.num_people ? "!text-destructive" : ""
                                }`}
                            >
                                Liczba osób
                            </Label>
                            <Input
                                disabled
                                type="number"
                                ref={(ref) =>
                                    (inputsRef.current.num_people =
                                        ref as HTMLInputElement)
                                }
                                id="num_people"
                                value={data.num_people}
                                onChange={(e) => {
                                    setData(
                                        "num_people",
                                        Number(e.target.value)
                                    );
                                }}
                                className={`${
                                    errors.num_people
                                        ? "!border-destructive"
                                        : ""
                                }`}
                            />

                            {errors.num_people && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.num_people}
                                </p>
                            )}
                        </div>
                        <div className="flex-1">
                            <Label
                                htmlFor="price"
                                className={`${
                                    errors.price ? "!text-destructive" : ""
                                }`}
                            >
                                Cena
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
                                className={`${
                                    errors.price ? "!border-destructive" : ""
                                }`}
                            />

                            {errors.price && (
                                <p className="text-sm text-destructive mt-1">
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
                                className={`${
                                    errors.first_name
                                        ? "!border-destructive"
                                        : ""
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
                                    errors.last_name
                                        ? "!border-destructive"
                                        : ""
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
                                    num_people: newSeats.length,
                                    price: newSeats.length * TICKET_PRICE,
                                };
                            });
                        }}
                    />
                    {errors.seats && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.seats}
                        </p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default BookingForm;
