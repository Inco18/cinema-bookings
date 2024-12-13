import * as React from "react";
import { add, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { TimePicker } from "./time-picker";
import { pl } from "date-fns/locale";

type Props = {
    date?: Date;
    onChange: (date: Date | undefined) => void;
    className?: string;
};

export const DateTimePicker = React.forwardRef<HTMLButtonElement, Props>(
    function DateTimePicker(
        { date, onChange: setDate, className }: Props,
        ref
    ) {
        /**
         * carry over the current time when a user clicks a new day
         * instead of resetting to 00:00
         */
        const handleSelect = (newDay: Date | undefined) => {
            if (!newDay) return;
            if (!date) {
                setDate(newDay);
                return;
            }
            const diff = newDay.getTime() - date.getTime();
            const diffInDays = diff / (1000 * 60 * 60 * 24);
            const newDateFull = add(date, { days: Math.ceil(diffInDays) });
            setDate(newDateFull);
        };

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                            className
                        )}
                        ref={ref}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                            format(date, "PPP HH:mm:ss", { locale: pl })
                        ) : (
                            <span>Wybierz datę</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        fromYear={new Date().getFullYear()}
                        toYear={new Date().getFullYear() + 1}
                        locale={pl}
                        selected={date}
                        onSelect={(d) => handleSelect(d)}
                        initialFocus
                    />
                    <div className="p-3 border-t border-border flex items-center justify-center">
                        <TimePicker setDate={setDate} date={date} />
                    </div>
                </PopoverContent>
            </Popover>
        );
    }
);
