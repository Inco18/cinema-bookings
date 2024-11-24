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
import { GenreRequest } from "@/schema";
import { Genre } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ZodIssue } from "zod";

type Props = { genre?: Genre };

const GenreForm = ({ genre }: Props) => {
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
        name: genre?.name || "",
    });
    const [didFail, setDidFail] = useState(false);
    const inputsRef = useRef<{
        name: HTMLInputElement | null;
    }>({ name: null });

    const validateInputs = () => {
        const parsed = GenreRequest.safeParse(data);
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
        if (genre) {
            patch(route("genres.update", { genre }), {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się zaktualizować gatunku");
                },
            });
        } else {
            post(route("genres.store"), {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się dodać gatunku");
                },
            });
        }
    };
    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {genre ? "Gatunki - Edycja" : "Gatunki - Tworzenie"}
                    </h2>
                </>
            }
        >
            <Head title={genre ? "Gatunki - Edycja" : "Gatunki - Tworzenie"} />
            <form
                onSubmit={submit}
                className="mt-2 space-y-6 max-w-lg m-auto bg-background p-4 sm:rounded-lg sm:p-8 border"
            >
                <div>
                    <Label
                        htmlFor="title"
                        className={`${errors.name ? "!text-destructive" : ""}`}
                    >
                        Nazwa
                    </Label>
                    <Input
                        type="text"
                        ref={(ref) =>
                            (inputsRef.current.name = ref as HTMLInputElement)
                        }
                        id="title"
                        value={data.name}
                        onChange={(e) => {
                            setData("name", e.target.value);
                        }}
                        className={`${
                            errors.name ? "!border-destructive" : ""
                        }`}
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() =>
                            router.get(
                                route("genres.index", route().queryParams)
                            )
                        }
                    >
                        Anuluj
                    </Button>
                    <Button disabled={processing}>
                        {genre ? "Zapisz" : "Stwórz"}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default GenreForm;
