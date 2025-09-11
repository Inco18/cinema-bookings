import DurationInput from "@/Components/DurationInput";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import { GenreRequest, HallRequest } from "@/schema";
import { Genre, Hall, Seat } from "@/types";
import { HallType } from "@/types/enums";
import { Head, router, useForm } from "@inertiajs/react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ZodIssue } from "zod";
import SeatViewer from "./SeatViewer";

type Props = { hall?: Hall; seats?: Seat[] };

const HallForm = ({ hall, seats }: Props) => {
    const {
        data,
        setData,
        patch,
        post,
        errors,
        clearErrors,
        setError,
        processing,
    } = useForm({
        number: hall?.number || "",
        type: hall?.type || "",
        planFile: null as File | null,
    });
    const [didFail, setDidFail] = useState(false);
    const inputsRef = useRef<{
        number: HTMLInputElement | null;
        type: HTMLInputElement | null;
        planFile: HTMLInputElement | null;
    }>({ number: null, type: null, planFile: null });

    const validateInputs = () => {
        const parsed = HallRequest.safeParse(data);
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
        if (hall) {
            patch(route("halls.update", { hall }), {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się zaktualizować sali");
                },
            });
        } else {
            post(route("halls.store"), {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się dodać sali");
                },
            });
        }
    };
    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {hall ? "Sale - Edycja" : "Sale - Tworzenie"}
                    </h2>
                </>
            }
        >
            <Head title={hall ? "Sale - Edycja" : "Sale - Tworzenie"} />
            <div className="flex items-start justify-center gap-5">
                <form
                    onSubmit={submit}
                    className="mt-2 space-y-6 max-w-lg bg-background p-4 sm:rounded-lg sm:p-8 border flex-1"
                >
                    <div>
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
                            min={1}
                            ref={(ref) =>
                                (inputsRef.current.number =
                                    ref as HTMLInputElement)
                            }
                            id="number"
                            value={data.number}
                            onChange={(e) => {
                                setData("number", e.target.value);
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
                    <div className="flex gap-3">
                        <div>
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
                                    setData("type", val);
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
                                    {Object.values(HallType).map((hallType) => {
                                        return (
                                            <SelectItem
                                                key={hallType}
                                                value={hallType}
                                            >
                                                {hallType}
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
                        {!hall && (
                            <div>
                                <Label
                                    htmlFor="poster_image"
                                    className={`${
                                        errors.planFile
                                            ? "!text-destructive"
                                            : ""
                                    }`}
                                >
                                    Plan sali z pliku (.txt)
                                </Label>
                                <Input
                                    type="file"
                                    ref={(ref) =>
                                        (inputsRef.current.planFile =
                                            ref as HTMLInputElement)
                                    }
                                    id="planFile"
                                    onChange={(e) => {
                                        if (
                                            e.target.files &&
                                            e.target.files[0]
                                        ) {
                                            //@ts-ignore
                                            setData(
                                                "planFile",
                                                e.target.files[0]
                                            );
                                        }
                                    }}
                                    className={`mt-1 ${
                                        errors.planFile
                                            ? "!border-destructive"
                                            : ""
                                    }`}
                                />
                                {errors.planFile && (
                                    <p className="text-sm text-destructive mt-1">
                                        {errors.planFile}
                                    </p>
                                )}

                                {data.planFile && (
                                    <div className="text-sm mt-1 flex items-center gap-2">
                                        Wybrany plik:{" "}
                                        {(data.planFile as File).name}
                                        <Button
                                            size={"icon"}
                                            variant={"ghost"}
                                            type="button"
                                            onClick={() => {
                                                setData("planFile", null);
                                                if (
                                                    inputsRef.current.planFile
                                                ) {
                                                    inputsRef.current.planFile.value =
                                                        "";
                                                }
                                            }}
                                        >
                                            <X />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() =>
                                router.get(
                                    route("halls.index", route().queryParams)
                                )
                            }
                        >
                            Anuluj
                        </Button>
                        <Button disabled={processing}>
                            {hall ? "Zapisz" : "Stwórz"}
                        </Button>
                    </div>
                </form>
                {seats && <SeatViewer seats={seats} />}
            </div>
        </AuthenticatedLayout>
    );
};

export default HallForm;
