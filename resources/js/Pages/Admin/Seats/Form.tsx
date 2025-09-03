import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { SeatRequest } from "@/schema";
import { Hall, Seat } from "@/types";
import { SeatType } from "@/types/enums";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ZodIssue } from "zod";

type Props = { seat?: Seat; halls: Hall[] };

const SeatForm = ({ seat, halls }: Props) => {
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
        hall_id: seat?.hall_id || 1,
        type: seat?.type || SeatType.NORMAL,
        row: seat?.row || 1,
        column: seat?.column || 1,
        number: seat?.number || 1,
    });
    const [didFail, setDidFail] = useState(false);
    const inputsRef = useRef<{
        hall_id: HTMLInputElement | null;
        type: HTMLInputElement | null;
        row: HTMLInputElement | null;
        column: HTMLInputElement | null;
        number: HTMLInputElement | null;
    }>({
        hall_id: null,
        type: null,
        row: null,
        column: null,
        number: null,
    });

    const validateInputs = () => {
        const parsed = SeatRequest.safeParse(data);
        const zodErrors =
            parsed?.error?.flatten((issue: ZodIssue) => ({
                message: issue.message,
                errorCode: issue.code,
            })).fieldErrors || {};
        Object.keys(data).forEach((key) => {
            if (key === "hall_id") return;
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
        if (seat) {
            patch(route("seats.update", { seat }, false), {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się zaktualizować siedzenia");
                },
            });
        } else {
            post(route("seats.store"), {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się dodać siedzenia");
                },
            });
        }
    };
    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {seat ? "Siedzenia - Edycja" : "Siedzenia - Tworzenie"}
                    </h2>
                </>
            }
        >
            <Head
                title={seat ? "Siedzenia - Edycja" : "Siedzenia - Tworzenie"}
            />
            <form
                onSubmit={submit}
                className="mt-2 space-y-6 max-w-lg m-auto bg-background p-4 sm:rounded-lg sm:p-8 border"
            >
                <div className="flex items-start w-full gap-5">
                    <div className="flex-1">
                        <Label
                            htmlFor="row"
                            className={`${
                                errors.row ? "!text-destructive" : ""
                            }`}
                        >
                            Rząd
                        </Label>
                        <Input
                            type="number"
                            ref={(ref) =>
                                (inputsRef.current.row =
                                    ref as HTMLInputElement)
                            }
                            id="row"
                            value={data.row}
                            onChange={(e) => {
                                setData("row", Number(e.target.value));
                            }}
                            className={`mt-1 ${
                                errors.row ? "!border-destructive" : ""
                            }`}
                        />
                        {errors.row && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.row}
                            </p>
                        )}
                    </div>
                    <div className="flex-1">
                        <Label
                            htmlFor="column"
                            className={`${
                                errors.column ? "!text-destructive" : ""
                            }`}
                        >
                            Kolumna
                        </Label>
                        <Input
                            type="number"
                            ref={(ref) =>
                                (inputsRef.current.column =
                                    ref as HTMLInputElement)
                            }
                            id="column"
                            value={data.column}
                            onChange={(e) => {
                                setData("column", Number(e.target.value));
                            }}
                            className={`mt-1 ${
                                errors.column ? "!border-destructive" : ""
                            }`}
                        />
                        {errors.column && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.column}
                            </p>
                        )}
                    </div>
                    <div className="flex-1">
                        <Label
                            htmlFor="number"
                            className={`${
                                errors.number ? "!text-destructive" : ""
                            }`}
                        >
                            Numer
                        </Label>
                        <Input
                            type="number"
                            ref={(ref) =>
                                (inputsRef.current.number =
                                    ref as HTMLInputElement)
                            }
                            id="number"
                            value={data.number}
                            onChange={(e) => {
                                setData("number", Number(e.target.value));
                            }}
                            className={`mt-1 ${
                                errors.number ? "!border-destructive" : ""
                            }`}
                        />
                        {errors.number && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.number}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-start w-full gap-5">
                    <div className="flex-1">
                        <Label
                            htmlFor="hall_id"
                            className={`${
                                errors.hall_id ? "!text-destructive" : ""
                            }`}
                        >
                            Sala
                        </Label>
                        <Select
                            onValueChange={(val) => {
                                clearErrors("hall_id");
                                setData("hall_id", Number(val));
                            }}
                            defaultValue={String(data.hall_id)}
                        >
                            <SelectTrigger
                                id="hall_id"
                                ref={(ref) =>
                                    (inputsRef.current.hall_id =
                                        ref as HTMLInputElement)
                                }
                                className={`mt-1 ${
                                    errors.hall_id ? "!border-destructive" : ""
                                }`}
                            >
                                <SelectValue placeholder="Wybierz salę" />
                            </SelectTrigger>
                            <SelectContent>
                                {halls.map((hall) => {
                                    return (
                                        <SelectItem
                                            key={hall.id}
                                            value={String(hall.id)}
                                        >
                                            Sala {hall.number}, (typ:{" "}
                                            {hall.type})
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                        {errors.hall_id && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.hall_id}
                            </p>
                        )}
                    </div>
                    <div className="flex-1">
                        <Label
                            htmlFor="type"
                            className={`${
                                errors.type ? "!text-destructive" : ""
                            }`}
                        >
                            Typ
                        </Label>
                        <Select
                            onValueChange={(val) => {
                                clearErrors("type");
                                setData("type", val as SeatType);
                            }}
                            defaultValue={data.type}
                        >
                            <SelectTrigger
                                id="type"
                                ref={(ref) =>
                                    (inputsRef.current.type =
                                        ref as HTMLInputElement)
                                }
                                className={`mt-1 ${
                                    errors.type ? "!border-destructive" : ""
                                }`}
                            >
                                <SelectValue placeholder="Wybierz typ" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(SeatType).map((seatType) => {
                                    return (
                                        <SelectItem
                                            key={seatType}
                                            value={seatType}
                                        >
                                            {seatType}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.type}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() =>
                            router.get(
                                route("seats.index", route().queryParams)
                            )
                        }
                    >
                        Anuluj
                    </Button>
                    <Button disabled={processing}>
                        {seat ? "Zapisz" : "Stwórz"}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default SeatForm;
