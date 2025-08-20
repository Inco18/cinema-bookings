import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Separator } from "@/Components/ui/separator";
import MainLayout from "@/Layouts/MainLayout";
import { Genre, Showing } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { useEffect, useRef } from "react";
import ShowingsList from "./ShowingsList";
import { toast } from "react-toastify";

function createDays(currentDay = new Date()) {
    return Array.from({ length: 7 }, (v, k) => {
        const dt = new Date(currentDay);
        dt.setDate(currentDay.getDate() + k);
        return dt;
    });
}
const days = createDays();

type Props = {
    day: string;
    genres: Genre[];
    subtitles_lang?: string;
    speech_lang?: string;
    dubbing_lang?: string;
    genre_id?: string;
    showings: { [key: string]: Showing[] };
};

export default function ShowingsIndex(props: Props) {
    const { flash }: any = usePage().props;
    useEffect(() => {
        if (flash.message) {
            if (flash.type === "error") toast.error(flash.message);
            if (flash.type === "success") toast.success(flash.message);
        }
    }, []);
    return (
        <MainLayout>
            <Head title="Repertuar" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl lg:px-8">
                    <div className="bg-indigo-700 text-primary-foreground shadow-sm lg:rounded-lg py-6 lg:px-12">
                        <div className="flex flex-col lg:flex-row justify-between mb-6">
                            <div className="pl-6 lg:pl-0">
                                <h2 className="font-bold text-lg mb-4">
                                    REPERTUAR - KINO
                                </h2>
                                <h1 className="font-bold text-3xl">
                                    TERAZ GRAMY
                                </h1>
                            </div>
                            <div className="overflow-x-auto max-w-full flex flex-row gap-1 items-center m-auto mt-10 lg:m-0 pb-1 scrollbar">
                                {days.map((day) => (
                                    <Link
                                        preserveState
                                        href={route("main.showings.index", {
                                            day: format(day, "yyyy-MM-dd"),
                                        })}
                                        key={format(day, "yyyy-MM-dd")}
                                        className={`h-16 aspect-square border border-primary-foreground/50 rounded-md p-1 flex flex-col items-center justify-center hover:bg-primary-foreground hover:text-foreground cursor-pointer transition ${
                                            props.day ===
                                            format(day, "yyyy-MM-dd")
                                                ? "bg-primary-foreground text-foreground"
                                                : ""
                                        }`}
                                    >
                                        <p>
                                            {format(day, "eee", { locale: pl })}
                                        </p>
                                        <p>
                                            {format(day, "dd MMM", {
                                                locale: pl,
                                            })}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="px-6 lg:px-0">
                            <Separator className="opacity-50" />
                        </div>
                        <div className="mt-6 px-6 lg:px-0 flex md:justify-between flex-col md:flex-row">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Link
                                    href={route("main.showings.index", {
                                        day: props.day,
                                        subtitles_lang:
                                            props.subtitles_lang === "PL"
                                                ? null
                                                : "PL",
                                    })}
                                    className={`border border-primary-foreground/50 rounded-md py-1 px-3 transition hover:bg-primary-foreground hover:text-foreground ${
                                        props.subtitles_lang === "PL"
                                            ? "bg-primary-foreground text-foreground"
                                            : ""
                                    }`}
                                    preserveState
                                >
                                    NAPISY
                                </Link>
                                <Link
                                    href={route("main.showings.index", {
                                        day: props.day,
                                        dubbing_lang:
                                            props.dubbing_lang === "PL"
                                                ? null
                                                : "PL",
                                    })}
                                    className={`border border-primary-foreground/50 rounded-md py-1 px-3 transition hover:bg-primary-foreground hover:text-foreground ${
                                        props.dubbing_lang === "PL"
                                            ? "bg-primary-foreground text-foreground"
                                            : ""
                                    }`}
                                    preserveState
                                >
                                    DUBBING
                                </Link>
                                <Link
                                    href={route("main.showings.index", {
                                        day: props.day,
                                        speech_lang:
                                            props.speech_lang === "PL"
                                                ? null
                                                : "PL",
                                    })}
                                    className={`border border-primary-foreground/50 rounded-md py-1 px-3 transition hover:bg-primary-foreground hover:text-foreground ${
                                        props.speech_lang === "PL"
                                            ? "bg-primary-foreground text-foreground"
                                            : ""
                                    }`}
                                    preserveState
                                >
                                    POLSKI
                                </Link>
                            </div>
                            <Separator className="opacity-50 my-5 flex md:hidden" />
                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                                <Label htmlFor="genre_id">Gatunek</Label>
                                <Select
                                    onValueChange={(val) => {
                                        router.get(
                                            route("main.showings.index", {
                                                ...route().queryParams,
                                                genre_id:
                                                    val === "all" ? null : val,
                                            }),
                                            undefined,
                                            { preserveState: true }
                                        );
                                    }}
                                    value={
                                        props.genre_id ? props.genre_id : "all"
                                    }
                                >
                                    <SelectTrigger
                                        id="genre_id"
                                        className="text-foreground bg-background !ring-background/50 w-full md:w-48"
                                    >
                                        <SelectValue placeholder="Wybierz gatunek" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={"all"}>
                                            Wszystkie
                                        </SelectItem>
                                        {props.genres.map((genre) => {
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
                            </div>
                        </div>
                    </div>
                    <ShowingsList showings={props.showings} />
                </div>
            </div>
        </MainLayout>
    );
}
