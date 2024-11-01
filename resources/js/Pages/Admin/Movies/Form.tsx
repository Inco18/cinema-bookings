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
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { cn } from "@/lib/utils";
import { Genre, Movie } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import React, { FormEventHandler, useRef } from "react";
import { toast } from "react-toastify";

type Props = { movie?: Movie; genres: Genre[] };

const MovieForm = ({ movie, genres }: Props) => {
    const { data, setData, post, errors, clearErrors, processing } = useForm({
        title: movie?.title || "",
        director: movie?.director || "",
        duration_seconds: movie?.duration_seconds || 0,
        poster_image: null,
        release_date: movie?.release_date || new Date().toDateString(),
        age_rating: movie?.age_rating || 3,
        description: movie?.description || "",
        genre_id: movie?.genre_id || 1,
        removePoster: false,
        _method: movie ? "put" : "post",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (movie) {
            post(route("movies.update", { movie }, false), {
                onError: () => toast.error("Nie udało się zaktualizować filmu"),
            });
        } else {
            post(route("movies.store"), {
                onError: () => toast.error("Nie udało się dodać filmu"),
            });
        }
    };
    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {movie ? "Filmy - Edycja" : "Filmy - Tworzenie"}
                    </h2>
                </>
            }
        >
            <Head title={movie ? "Filmy - Edycja" : "Filmy - Tworzenie"} />
            <form
                onSubmit={submit}
                className="mt-2 space-y-6 max-w-lg m-auto bg-background p-4 sm:rounded-lg sm:p-8 border"
            >
                <div>
                    <Label htmlFor="title">Tytuł</Label>
                    <Input
                        type="text"
                        id="title"
                        value={data.title}
                        onChange={(e) => {
                            clearErrors("title");
                            setData("title", e.target.value);
                        }}
                        className={`${
                            errors.title ? "border-destructive" : ""
                        }`}
                    />
                    {errors.title && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.title}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="director">Reżyser</Label>
                    <Input
                        type="text"
                        id="director"
                        value={data.director}
                        onChange={(e) => {
                            clearErrors("director");
                            setData("director", e.target.value);
                        }}
                        className={`${
                            errors.director ? "border-destructive" : ""
                        }`}
                    />
                    {errors.director && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.director}
                        </p>
                    )}
                </div>
                <div>
                    <Label>
                        Gatunek
                        <Select
                            onValueChange={(val) =>
                                setData("genre_id", Number(val))
                            }
                            defaultValue={String(data.genre_id)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Wybierz gatunek" />
                            </SelectTrigger>
                            <SelectContent>
                                {genres.map((genre) => {
                                    return (
                                        <SelectItem
                                            key={genre.id}
                                            value={String(genre.id)}
                                        >
                                            {genre.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </Label>
                </div>
                <div className="flex gap-2 justify-center items-center">
                    {movie?.poster_image && (
                        <img
                            className="max-w-[40%] rounded-sm"
                            src={`/storage/${movie?.poster_image}`}
                        />
                    )}
                    <div className="flex-1">
                        <Label htmlFor="poster_image">Plakat</Label>
                        <Input
                            type="file"
                            ref={fileInputRef}
                            id="poster_image"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    clearErrors("poster_image");
                                    //@ts-ignore
                                    setData("poster_image", e.target.files[0]);
                                }
                            }}
                            className={`${
                                errors.poster_image ? "border-destructive" : ""
                            }`}
                        />
                        {errors.poster_image && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.poster_image}
                            </p>
                        )}
                        {movie?.poster_image && !data.poster_image && (
                            <div className="flex items-center space-x-2 mt-2">
                                <Checkbox
                                    id="removePoster"
                                    checked={data.removePoster}
                                    onCheckedChange={(value) =>
                                        setData("removePoster", Boolean(value))
                                    }
                                />
                                <label
                                    htmlFor="removePoster"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Usuń plakat
                                </label>
                            </div>
                        )}

                        {data.poster_image && (
                            <div className="text-sm mt-1 flex items-center gap-2">
                                Wybrany plik: {(data.poster_image as File).name}
                                <Button
                                    size={"icon"}
                                    variant={"ghost"}
                                    type="button"
                                    onClick={() => {
                                        setData("poster_image", null);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = "";
                                        }
                                    }}
                                >
                                    <X />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <Label htmlFor="duration_seconds">
                        Czas trwania
                        <DurationInput
                            durationSeconds={data.duration_seconds}
                            onChange={(seconds) => {
                                clearErrors("duration_seconds");
                                setData("duration_seconds", seconds);
                            }}
                        />
                    </Label>
                    {errors.duration_seconds && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.duration_seconds}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="release_date" className="block mb-1">
                        Data premiery
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !data.release_date &&
                                        "text-muted-foreground",
                                    errors.release_date && "border-destructive"
                                )}
                            >
                                <CalendarIcon />
                                {data.release_date ? (
                                    format(data.release_date, "PPP", {
                                        locale: pl,
                                    })
                                ) : (
                                    <span>Wybierz datę</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                captionLayout="dropdown-buttons"
                                locale={pl}
                                selected={new Date(data.release_date)}
                                defaultMonth={new Date(data.release_date)}
                                fromYear={1800}
                                toYear={new Date().getFullYear() + 10}
                                onSelect={(day) => {
                                    clearErrors("release_date");
                                    setData(
                                        "release_date",
                                        day?.toDateString() as string
                                    );
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {errors.release_date && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.release_date}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="age_rating">Ograniczenia wiekowe</Label>
                    <Input
                        type="number"
                        id="age_rating"
                        min={0}
                        max={99}
                        value={data.age_rating}
                        onChange={(e) => {
                            clearErrors("age_rating");
                            setData("age_rating", e.target.value);
                        }}
                        className={`${
                            errors.age_rating ? "border-destructive" : ""
                        }`}
                    />
                    {errors.age_rating && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.age_rating}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="description">Opis</Label>
                    <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => {
                            clearErrors("description");
                            setData("description", e.target.value);
                        }}
                        className={`${
                            errors.description ? "border-destructive" : ""
                        }`}
                    />
                    {errors.description && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.description}
                        </p>
                    )}
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() =>
                            router.get(
                                route("movies.index", route().queryParams)
                            )
                        }
                    >
                        Anuluj
                    </Button>
                    <Button disabled={processing}>
                        {movie ? "Zapisz" : "Stwórz"}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default MovieForm;
