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
import { Reward } from "@/types";
import { RewardType } from "@/types/enums";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { forwardRef } from "react";

type Props = {
    rewards: Reward[];
    value: string;
    setValue: (value: string) => void;
    id: string;
};

const RewardPicker = forwardRef<HTMLButtonElement, Props>(function RewardPicker(
    { rewards, value, setValue, id },
    ref
) {
    const [open, setOpen] = React.useState(false);
    const rewardsList = rewards.map((reward) => {
        return {
            value: String(reward.id),
            label: `${reward.name} ${reward.value} ${reward.value_type} (${reward.cost_points} pkt)`,
            reward: reward,
        };
    });
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild ref={ref}>
                <Button
                    id={id}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between w-full mt-1"
                >
                    {value
                        ? rewardsList.find((reward) => reward.value === value)
                              ?.label
                        : "Wybierz nagrodę..."}
                    <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[28rem] p-0">
                <Command>
                    <CommandInput
                        placeholder="Szukaj nagrody..."
                        className="focus:ring-0 focus:border-indigo-700"
                    />
                    <CommandList>
                        <CommandEmpty>Nie znaleziono nagrody</CommandEmpty>
                        <CommandGroup>
                            {rewardsList.map((reward) => (
                                <CommandItem
                                    keywords={[reward.label]}
                                    key={reward.value}
                                    value={reward.value}
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
                                            value === reward.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {reward.reward.type !==
                                        RewardType.DISCOUNT && (
                                        <div className="w-9 h-9 shrink-0">
                                            <img
                                                src={
                                                    reward.reward.image
                                                        ? `/storage/${reward.reward.image}`
                                                        : "/reward-placeholder.jpg"
                                                }
                                                className="rounded-full"
                                            />
                                        </div>
                                    )}
                                    {reward.reward.type ===
                                        RewardType.DISCOUNT && (
                                        <div className="flex items-center justify-center rounded-full w-9 h-9 bg-primary text-background shrink-0">
                                            <span className="text-xs font-bold">
                                                {new Intl.NumberFormat(
                                                    "pl-PL",
                                                    {
                                                        maximumFractionDigits: 2,
                                                    }
                                                ).format(reward.reward.value)}
                                                {reward.reward.value_type ===
                                                "percent"
                                                    ? " %"
                                                    : " zł"}
                                            </span>
                                        </div>
                                    )}
                                    {reward.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
});

export default RewardPicker;
