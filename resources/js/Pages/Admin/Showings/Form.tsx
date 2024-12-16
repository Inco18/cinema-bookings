import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";

import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { ShowingRequest } from "@/schema";
import { Hall, Movie, Showing } from "@/types";
import { ShowingType } from "@/types/enums";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ZodIssue } from "zod";
import MoviePicker from "./MoviePicker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { add } from "date-fns";
import { DateTimePicker } from "@/Components/ui/datetime-picker";
import { Input } from "@/Components/ui/input";

type Props = { showing?: Showing; halls: Hall[]; movies: Movie[] };

const ShowingForm = ({ showing, halls, movies }: Props) => {
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
        hall_id: showing?.hall_id || 1,
        movie_id: showing?.movie_id || 1,
        start_time: showing?.start_time || new Date(),
        end_time: showing?.end_time || new Date(),
        speech_lang: showing?.speech_lang || "",
        dubbing_lang: showing?.dubbing_lang || "",
        subtitles_lang: showing?.subtitles_lang || "",
        type: showing?.type || ShowingType.TWO_D,
    });
    const [didFail, setDidFail] = useState(false);
    const inputsRef = useRef<{
        hall_id: HTMLInputElement | null;
        movie_id: HTMLButtonElement | null;
        start_time: HTMLButtonElement | null;
        end_time: HTMLButtonElement | null;
        speech_lang: HTMLInputElement | null;
        dubbing_lang: HTMLInputElement | null;
        subtitles_lang: HTMLInputElement | null;
        type: HTMLInputElement | null;
    }>({
        hall_id: null,
        movie_id: null,
        start_time: null,
        end_time: null,
        speech_lang: null,
        dubbing_lang: null,
        subtitles_lang: null,
        type: null,
    });

    const validateInputs = () => {
        const parsed = ShowingRequest.safeParse(data);
        const zodErrors =
            parsed?.error?.flatten((issue: ZodIssue) => ({
                message: issue.message,
                errorCode: issue.code,
            })).fieldErrors || {};
        Object.keys(data).forEach((key) => {
            if (key === "hall_id" || key === "movie_id") return;
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
        if (showing) {
            patch(route("showings.update", { showing }, false), {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się zaktualizować seansu");
                },
            });
        } else {
            post(route("showings.store"), {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się dodać seansu");
                },
            });
        }
    };
    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {showing ? "Seanse - Edycja" : "Seanse - Tworzenie"}
                    </h2>
                </>
            }
        >
            <Head title={showing ? "Seanse - Edycja" : "Seanse - Tworzenie"} />
            <form
                onSubmit={submit}
                className="mt-2 space-y-6 max-w-xl m-auto bg-background p-4 sm:rounded-lg sm:p-8 border"
            >
                <div>
                    <Label
                        htmlFor="movie"
                        className={`${
                            errors.movie_id ? "!text-destructive" : ""
                        }`}
                    >
                        Film
                    </Label>
                    <MoviePicker
                        ref={(ref) =>
                            (inputsRef.current.movie_id =
                                ref as HTMLButtonElement)
                        }
                        movies={movies}
                        value={String(data.movie_id)}
                        setValue={(value: string) => {
                            setData((data) => ({
                                ...data,
                                movie_id: Number(value),
                                end_time: add(data.start_time, {
                                    seconds: movies.find(
                                        (movie) => movie.id === Number(value)
                                    )?.duration_seconds,
                                }),
                            }));
                        }}
                    />
                    {errors.movie_id && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.movie_id}
                        </p>
                    )}
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
                                className={`${
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
                                setData("type", val as ShowingType);
                            }}
                            defaultValue={data.type}
                        >
                            <SelectTrigger
                                id="type"
                                ref={(ref) =>
                                    (inputsRef.current.type =
                                        ref as HTMLInputElement)
                                }
                                className={`${
                                    errors.type ? "!border-destructive" : ""
                                }`}
                            >
                                <SelectValue placeholder="Wybierz typ" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(ShowingType).map(
                                    (showingType) => {
                                        return (
                                            <SelectItem
                                                key={showingType}
                                                value={showingType}
                                            >
                                                {showingType}
                                            </SelectItem>
                                        );
                                    }
                                )}
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.type}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-start w-full gap-5">
                    <div className="flex-1">
                        <Label
                            htmlFor="start_time"
                            className={`${
                                errors.start_time ? "!text-destructive" : ""
                            }`}
                        >
                            Data rozpoczęcia
                        </Label>
                        <DateTimePicker
                            date={new Date(data.start_time)}
                            ref={(ref) =>
                                (inputsRef.current.start_time =
                                    ref as HTMLButtonElement)
                            }
                            onChange={(date) => {
                                setData((data) => ({
                                    ...data,
                                    start_time: date!,
                                    end_time: add(date!, {
                                        seconds: movies.find(
                                            (movie) =>
                                                movie.id === data.movie_id
                                        )?.duration_seconds,
                                    }),
                                }));
                            }}
                            className={`${
                                errors.start_time ? "!border-destructive" : ""
                            }`}
                        />

                        {errors.start_time && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.start_time}
                            </p>
                        )}
                    </div>
                    <div className="flex-1">
                        <Label
                            htmlFor="end_time"
                            className={`${
                                errors.end_time ? "!text-destructive" : ""
                            }`}
                        >
                            Data zakończenia
                        </Label>
                        <DateTimePicker
                            ref={(ref) =>
                                (inputsRef.current.end_time =
                                    ref as HTMLButtonElement)
                            }
                            date={new Date(data.end_time)}
                            onChange={(date) => setData("end_time", date!)}
                            className={`${
                                errors.end_time ? "!border-destructive" : ""
                            }`}
                        />

                        {errors.end_time && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.end_time}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-start w-full gap-5">
                    <div className="flex-1">
                        <Label
                            htmlFor="speech_lang"
                            className={`${
                                errors.speech_lang ? "!text-destructive" : ""
                            }`}
                        >
                            Jęz. mowy
                        </Label>
                        <Input
                            type="text"
                            ref={(ref) =>
                                (inputsRef.current.speech_lang =
                                    ref as HTMLInputElement)
                            }
                            id="speech_lang"
                            placeholder="PL"
                            value={data.speech_lang}
                            onChange={(e) => {
                                setData("speech_lang", e.target.value);
                            }}
                            className={`${
                                errors.speech_lang ? "!border-destructive" : ""
                            }`}
                        />

                        {errors.speech_lang && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.speech_lang}
                            </p>
                        )}
                    </div>
                    <div className="flex-1">
                        <Label
                            htmlFor="dubbing_lang"
                            className={`${
                                errors.dubbing_lang ? "!text-destructive" : ""
                            }`}
                        >
                            Jęz. dubbingu
                        </Label>
                        <Input
                            type="text"
                            ref={(ref) =>
                                (inputsRef.current.dubbing_lang =
                                    ref as HTMLInputElement)
                            }
                            id="dubbing_lang"
                            placeholder="PL"
                            value={data.dubbing_lang}
                            onChange={(e) => {
                                setData("dubbing_lang", e.target.value);
                            }}
                            className={`${
                                errors.dubbing_lang ? "!border-destructive" : ""
                            }`}
                        />

                        {errors.dubbing_lang && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.dubbing_lang}
                            </p>
                        )}
                    </div>
                    <div className="flex-1">
                        <Label
                            htmlFor="subtitles_lang"
                            className={`${
                                errors.subtitles_lang ? "!text-destructive" : ""
                            }`}
                        >
                            Jęz. napisów
                        </Label>
                        <Input
                            type="text"
                            ref={(ref) =>
                                (inputsRef.current.subtitles_lang =
                                    ref as HTMLInputElement)
                            }
                            id="subtitles_lang"
                            placeholder="PL"
                            value={data.subtitles_lang}
                            onChange={(e) => {
                                setData("subtitles_lang", e.target.value);
                            }}
                            className={`${
                                errors.subtitles_lang
                                    ? "!border-destructive"
                                    : ""
                            }`}
                        />

                        {errors.subtitles_lang && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.subtitles_lang}
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
                                route("showings.index", route().queryParams)
                            )
                        }
                    >
                        Anuluj
                    </Button>
                    <Button disabled={processing}>
                        {showing ? "Zapisz" : "Stwórz"}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default ShowingForm;
