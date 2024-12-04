import { Button } from "@/Components/ui/button";
import { FloatingInput, FloatingLabel } from "@/Components/ui/floating-input";
import { MultiSelect } from "@/Components/ui/multiple-select";
import { BookingStatus } from "@/types/enums";
import { router } from "@inertiajs/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    statusFilter: BookingStatus[];
    movieSearch: string;
    personSearch: string;
    showingIdSearch: string;
    hallSearch: string;
};

const BookingsFilters = ({
    statusFilter,
    movieSearch,
    personSearch,
    showingIdSearch,
    hallSearch,
}: Props) => {
    const [showingIdSearchValue, setShowingIdSearchValue] = useState<string>(
        showingIdSearch || ""
    );
    const [movieSearchValue, setMovieSearchValue] = useState<string>(
        movieSearch || ""
    );
    const [personSearchValue, setPersonSearchValue] = useState<string>(
        personSearch || ""
    );
    const [hallSearchValue, setHallSearchValue] = useState<string>(
        hallSearch || ""
    );

    useEffect(() => {
        if (
            ((!movieSearch && !movieSearchValue) ||
                movieSearch === movieSearchValue) &&
            ((!personSearch && !personSearchValue) ||
                personSearch === personSearchValue) &&
            ((!showingIdSearch && !showingIdSearchValue) ||
                showingIdSearch === showingIdSearchValue) &&
            ((!hallSearch && !hallSearchValue) ||
                hallSearch === hallSearchValue)
        )
            return;

        const timeout = setTimeout(() => {
            router.get(
                route("bookings.index", {
                    movieSearch: movieSearchValue || null,
                    personSearch: personSearchValue || null,
                    showingIdSearch: showingIdSearchValue || null,
                    hallSearch: hallSearchValue || null,
                    statusFilter: statusFilter || null,
                }),
                {},
                { preserveState: true }
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [
        showingIdSearchValue,
        movieSearchValue,
        personSearchValue,
        hallSearchValue,
    ]);

    return (
        <>
            <div className="flex items-center ml-8 min-w-80 gap-1">
                <div className="relative">
                    <FloatingInput
                        id="id"
                        className="w-24 m-0"
                        value={showingIdSearchValue}
                        onChange={(e) => {
                            setShowingIdSearchValue(e.target.value);
                        }}
                    />
                    <FloatingLabel htmlFor="id">Id seansu</FloatingLabel>
                </div>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={`aspect-square ${
                        showingIdSearchValue ? "visible" : "invisible"
                    }`}
                    onClick={() => setShowingIdSearchValue("")}
                >
                    <X />
                </Button>
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
                        id="person"
                        className="w-36 m-0"
                        value={personSearchValue}
                        onChange={(e) => {
                            setPersonSearchValue(e.target.value);
                        }}
                    />
                    <FloatingLabel htmlFor="person">Osoba</FloatingLabel>
                </div>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={`aspect-square ${
                        personSearchValue ? "visible" : "invisible"
                    }`}
                    onClick={() => setPersonSearchValue("")}
                >
                    <X />
                </Button>
                <div className="relative">
                    <FloatingInput
                        id="hall"
                        className="w-16 m-0"
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
            </div>
            <div className="ml-1">
                <MultiSelect
                    onValueChange={(value) =>
                        router.get(
                            route("bookings.index", {
                                movieSearch: movieSearchValue || null,
                                personSearch: personSearchValue || null,
                                showingIdSearch: showingIdSearchValue || null,
                                hallSearch: hallSearchValue || null,
                                statusFilter: value || null,
                            }),
                            {},
                            { preserveState: true }
                        )
                    }
                    value={statusFilter || []}
                    placeholder="Status"
                    variant="inverted"
                    options={Object.values(BookingStatus).map((status) => {
                        return {
                            label: status,
                            value: status,
                        };
                    })}
                />
            </div>
        </>
    );
};

export default BookingsFilters;
