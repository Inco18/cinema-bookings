import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { cn } from "@/lib/utils";
import { Showing } from "@/types";
import { Link } from "@inertiajs/react";
import { format, isPast } from "date-fns";
import React from "react";

type Props = {
    showings: Showing[][];
};

const ShowingsList = ({ showings }: Props) => {
    return (
        <div className="flex flex-col gap-2 mt-5">
            {showings.map((showingArr, idx) => {
                const movie = showingArr[0].movie;
                return (
                    <div
                        key={movie?.id}
                        className="bg-background p-4 rounded-md flex flex-col md:flex-row gap-5"
                    >
                        <div className="flex gap-5 md:block">
                            <div className="w-24 md:w-28 shrink-0">
                                <img
                                    src={
                                        movie?.poster_image
                                            ? `/storage/${movie?.poster_image}`
                                            : "/no-poster.webp"
                                    }
                                    className="rounded-md"
                                />
                            </div>
                            <div>
                                <h1 className="font-medium text-2xl block md:hidden">
                                    {movie?.title}
                                </h1>
                                <p className="line-clamp-2 md:hidden">
                                    {movie?.description}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h1 className="font-medium text-2xl hidden md:flex items-center gap-4">
                                {movie?.title}{" "}
                                <Badge variant={"secondary"}>
                                    Od {movie?.age_rating} lat
                                </Badge>
                            </h1>
                            <p className="hidden md:line-clamp-2">
                                {movie?.description}
                            </p>
                            <Separator className="my-3" />
                            <div className="gap-2 max-w-full grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
                                {showingArr.map((showing) => (
                                    <Link
                                        href={route("main.bookings.create", {
                                            showing_id: showing.id,
                                        })}
                                        key={showing.id}
                                        className={cn(
                                            "h-24 w-full border border-foreground/20 rounded-md py-1 px-2 flex flex-col hover:bg-indigo-700 hover:text-primary-foreground cursor-pointer transition",
                                            {
                                                "pointer-events-none opacity-50":
                                                    isPast(showing.end_time),
                                            }
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-nowrap">
                                                {format(
                                                    new Date(
                                                        showing.start_time
                                                    ),
                                                    "HH:mm"
                                                )}{" "}
                                                <span className="font-normal text-sm opacity-60">
                                                    -{" "}
                                                    {format(
                                                        new Date(
                                                            showing.end_time
                                                        ),
                                                        "HH:mm"
                                                    )}
                                                </span>
                                            </p>
                                            <Badge variant={"secondary"}>
                                                {showing.type.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <p className="text-sm opacity-75">
                                            Sala {showing.hall?.number}
                                        </p>
                                        {showing.subtitles_lang && (
                                            <p className="text-sm opacity-75">
                                                Napisy: {showing.subtitles_lang}
                                            </p>
                                        )}
                                        {showing.dubbing_lang && (
                                            <p className="text-sm opacity-75">
                                                Dubbing: {showing.dubbing_lang}
                                            </p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ShowingsList;
