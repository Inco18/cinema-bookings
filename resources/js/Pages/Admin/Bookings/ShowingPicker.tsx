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
import { Showing } from "@/types";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { forwardRef } from "react";

type Props = {
    showings: Showing[];
    value: string;
    setValue: (value: string) => void;
    id: string;
};

const ShowingPicker = forwardRef<HTMLButtonElement, Props>(
    function ShowingPicker({ showings, value, setValue, id }, ref) {
        const [open, setOpen] = React.useState(false);
        const showingsList = showings.map((showing) => {
            return {
                value: String(showing.id),
                label: `Sala: ${showing.hall?.number}, Film: ${showing.movie?.title} (${showing.start_time} - ${showing.end_time})`,
                movieTitle: showing.movie?.title!,
                start_time: showing.start_time,
                hall_number: showing.hall?.number!,
            };
        });
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild ref={ref}>
                    <Button
                        variant="outline"
                        id={id}
                        role="combobox"
                        aria-expanded={open}
                        className="mt-1 w-full justify-between"
                    >
                        <p className="line-clamp-1">
                            {value
                                ? showingsList.find(
                                      (movie) => movie.value === value
                                  )?.label
                                : "Wybierz seans..."}
                        </p>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full max-w-lg p-0">
                    <Command>
                        <CommandInput
                            placeholder="Szukaj seansu..."
                            className="focus:ring-0 focus:border-indigo-700"
                        />
                        <CommandList>
                            <CommandEmpty>Nie znaleziono seansu</CommandEmpty>
                            <CommandGroup>
                                {showingsList.map((showing) => (
                                    <CommandItem
                                        keywords={[
                                            showing.movieTitle,
                                            showing.start_time,
                                            showing.hall_number,
                                        ]}
                                        key={showing.value}
                                        value={showing.value}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === showing.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {showing.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    }
);

export default ShowingPicker;
