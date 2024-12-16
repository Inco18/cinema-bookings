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
import { User } from "@/types";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { forwardRef } from "react";

type Props = {
    users: User[];
    value: string | undefined;
    setValue: (value: string) => void;
    id: string;
};

const UserPicker = forwardRef<HTMLButtonElement, Props>(function UserPicker(
    { users, value, setValue, id },
    ref
) {
    const [open, setOpen] = React.useState(false);
    const usersList = users.map((user) => {
        return {
            value: String(user.id),
            label: `${user.first_name} ${user.last_name} (${user.email})`,
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
                    className="w-full justify-between"
                >
                    {value
                        ? usersList.find((movie) => movie.value === value)
                              ?.label
                        : "Wybierz użytkownika..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder="Szukaj użytkownika..."
                        className="focus:ring-0 focus:border-indigo-700"
                    />
                    <CommandList>
                        <CommandEmpty>Nie znaleziono użytkownika</CommandEmpty>
                        <CommandGroup>
                            {usersList.map((user) => (
                                <CommandItem
                                    keywords={[user.label]}
                                    key={user.value}
                                    value={user.value}
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
                                            value === user.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {user.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
});

export default UserPicker;
