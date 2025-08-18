import { Button } from "@/Components/ui/button";
import { FloatingInput, FloatingLabel } from "@/Components/ui/floating-input";
import { MultiSelect } from "@/Components/ui/multiple-select";
import { ShowingType } from "@/types/enums";
import { router } from "@inertiajs/react";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
    movieSearch: string;
    hallSearch: string;
    speechSearch: string;
    dubbingSearch: string;
    subtitlesSearch: string;
    typeFilter: ShowingType[];
};

const Filters = ({
    movieSearch,
    hallSearch,
    speechSearch,
    dubbingSearch,
    subtitlesSearch,
    typeFilter,
}: Props) => {
    const [movieSearchValue, setMovieSearchValue] = useState<string>(
        movieSearch || ""
    );
    const [hallSearchValue, setHallSearchValue] = useState<string>(
        hallSearch || ""
    );
    const [speechSearchValue, setSpeechSearchValue] = useState<string>(
        speechSearch || ""
    );
    const [dubbingSearchValue, setDubbingSearchValue] = useState<string>(
        dubbingSearch || ""
    );
    const [subtitlesSearchValue, setSubtitlesSearchValue] = useState<string>(
        subtitlesSearch || ""
    );

    useEffect(() => {
        if (
            ((!hallSearch && !hallSearchValue) ||
                hallSearch === hallSearchValue) &&
            ((!movieSearch && !movieSearchValue) ||
                movieSearch === movieSearchValue) &&
            ((!speechSearch && !speechSearchValue) ||
                speechSearch === speechSearchValue) &&
            ((!dubbingSearch && !dubbingSearchValue) ||
                dubbingSearch === dubbingSearchValue) &&
            ((!subtitlesSearch && !subtitlesSearchValue) ||
                subtitlesSearch === subtitlesSearchValue)
        )
            return;
        const timeout = setTimeout(() => {
            router.get(
                route("showings.index", {
                    movieSearch: movieSearchValue || null,
                    hallSearch: hallSearchValue || null,
                    speechSearch: speechSearchValue || null,
                    dubbingSearch: dubbingSearchValue || null,
                    subtitlesSearch: subtitlesSearchValue || null,
                    typeFilter: typeFilter || null,
                }),
                {},
                { preserveState: true }
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [
        movieSearchValue,
        hallSearchValue,
        speechSearchValue,
        dubbingSearchValue,
        subtitlesSearchValue,
    ]);

    return (
        <>
            <div className="flex items-center ml-8 min-w-80 max-w-180 gap-1">
                <div className="relative">
                    <FloatingInput
                        id="movie"
                        className="w-36 m-0"
                        value={movieSearchValue}
                        onChange={(e) => {
                            setMovieSearchValue(e.target.value);
                        }}
                    />
                    <FloatingLabel htmlFor="movie">Film</FloatingLabel>
                </div>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={`aspect-square ${
                        movieSearchValue ? "visible" : "invisible"
                    }`}
                    onClick={() => setMovieSearchValue("")}
                >
                    <X />
                </Button>

                <div className="relative">
                    <FloatingInput
                        id="hall"
                        className="max-w-sm m-0"
                        value={hallSearchValue}
                        onChange={(e) => {
                            setHallSearchValue(e.target.value);
                        }}
                    />
                    <FloatingLabel htmlFor="hall">Sala</FloatingLabel>
                </div>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={`aspect-square ${
                        hallSearchValue ? "visible" : "invisible"
                    }`}
                    onClick={() => setHallSearchValue("")}
                >
                    <X />
                </Button>

                <div className="relative">
                    <FloatingInput
                        id="speech"
                        className="max-w-sm m-0"
                        value={speechSearchValue}
                        onChange={(e) => {
                            setSpeechSearchValue(e.target.value);
                        }}
                    />
                    <FloatingLabel htmlFor="speech">Mowa</FloatingLabel>
                </div>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={`aspect-square ${
                        speechSearchValue ? "visible" : "invisible"
                    }`}
                    onClick={() => setSpeechSearchValue("")}
                >
                    <X />
                </Button>

                <div className="relative">
                    <FloatingInput
                        id="dubbing"
                        className="max-w-sm m-0"
                        value={dubbingSearchValue}
                        onChange={(e) => {
                            setDubbingSearchValue(e.target.value);
                        }}
                    />
                    <FloatingLabel htmlFor="dubbing">Dubbing</FloatingLabel>
                </div>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={`aspect-square ${
                        dubbingSearchValue ? "visible" : "invisible"
                    }`}
                    onClick={() => setDubbingSearchValue("")}
                >
                    <X />
                </Button>

                <div className="relative">
                    <FloatingInput
                        id="subtitles"
                        className="max-w-sm m-0"
                        value={subtitlesSearchValue}
                        onChange={(e) => {
                            setSubtitlesSearchValue(e.target.value);
                        }}
                    />
                    <FloatingLabel htmlFor="subtitles">Napisy</FloatingLabel>
                </div>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={`aspect-square ${
                        subtitlesSearchValue ? "visible" : "invisible"
                    }`}
                    onClick={() => setSubtitlesSearchValue("")}
                >
                    <X />
                </Button>
            </div>
            <div className="ml-1">
                <MultiSelect
                    onValueChange={(value) =>
                        router.get(
                            route("showings.index", {
                                movieSearch: movieSearchValue || null,
                                hallSearch: hallSearchValue || null,
                                speechSearch: speechSearchValue || null,
                                dubbingSearch: dubbingSearchValue || null,
                                subtitlesSearch: subtitlesSearchValue || null,
                                typeFilter: value || null,
                            }),
                            {},
                            { preserveState: true }
                        )
                    }
                    value={typeFilter || []}
                    placeholder="Typ"
                    variant="inverted"
                    options={Object.values(ShowingType).map((type) => {
                        return {
                            label: type,
                            value: type,
                        };
                    })}
                />
            </div>
        </>
    );
};

export default Filters;
