import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { cn } from "@/lib/utils";
import { Movie } from "@/types";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { forwardRef, MutableRefObject } from "react";

type Props = {
    movies: Movie[];
    value: string;
    setValue: (value: string) => void;
};

const MoviePicker = forwardRef<HTMLButtonElement, Props>(function MoviePicker(
    { movies, value, setValue },
    ref
) {
    const [open, setOpen] = React.useState(false);
    const moviesList = movies.map((movie) => {
        return {
            value: String(movie.id),
            label: `${movie.title} (${movie.release_date})`,
        };
    });
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild ref={ref}>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? moviesList.find((movie) => movie.value === value)
                              ?.label
                        : "Wybierz film..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder="Szukaj filmu..."
                        className="focus:ring-0 focus:border-indigo-700"
                    />
                    <CommandList>
                        <CommandEmpty>Nie znaleziono filmu</CommandEmpty>
                        <CommandGroup>
                            {moviesList.map((movie) => (
                                <CommandItem
                                    keywords={[movie.label]}
                                    key={movie.value}
                                    value={movie.value}
                                    onSelect={(currentValue) => {
                                        setValue(
                                            currentValue === value
                                                ? ""
                                                : currentValue
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === movie.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {movie.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
});

export default MoviePicker;
