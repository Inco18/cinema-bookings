import { ChartConfig, ChartContainer } from "@/Components/ui/chart";
import { AnimatedCircularProgressBar } from "@/Components/ui/magicui/animated-circular-progress-bar";
import { Reward } from "@/types";
import { RewardType } from "@/types/enums";
import clsx from "clsx";
import { HandCoins } from "lucide-react";
import React from "react";
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";

type Props = {
    rewards: Reward[];
    userPoints: number;
};

const chartData = [{ browser: "safari", visitors: 200, fill: "#000" }];
const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    safari: {
        label: "Safari",
        color: "#000",
    },
} satisfies ChartConfig;

const Rewards = ({ rewards, userPoints }: Props) => {
    return (
        <>
            <div className="flex mt-2 my-5 px-3 md:px-0 items-center justify-between gap-3">
                <h1 className="text-2xl m-0">Sklep z nagrodami</h1>
                <div
                    className="bg-background rounded-full py-2 px-5 cursor-default flex gap-2 text-amber-600 items-center"
                    title="Punkty programu lojalnościowego"
                >
                    <HandCoins />
                    {userPoints}
                </div>
            </div>
            <div className="flex flex-col gap-3">
                {rewards.map((reward) => {
                    return (
                        <div
                            key={reward.id}
                            className={clsx(
                                "bg-background p-4 md:rounded-lg flex flex-col sm:flex-row sm:items-center gap-4 transition-all",
                                reward.cost_points > userPoints
                                    ? "opacity-60 cursor-not-allowed"
                                    : "cursor-pointer"
                            )}
                        >
                            {reward.type !== RewardType.DISCOUNT && (
                                <div className="w-20 h-20 shrink-0">
                                    <img
                                        src={
                                            reward?.image
                                                ? `/storage/${reward?.image}`
                                                : "/reward-placeholder.jpg"
                                        }
                                        className="rounded-full"
                                    />
                                </div>
                            )}
                            {reward.type === RewardType.DISCOUNT && (
                                <div className="w-20 h-20 flex items-center justify-center bg-primary text-background rounded-full shrink-0">
                                    <span className="text-xl font-bold">
                                        {new Intl.NumberFormat("pl-PL", {
                                            maximumFractionDigits: 2,
                                        }).format(reward.value)}
                                        {reward.value_type === "percent"
                                            ? " %"
                                            : " zł"}
                                    </span>
                                </div>
                            )}
                            <div>
                                <p className="text-xl font-medium">
                                    {reward.name}
                                </p>
                                <p className="text-foreground/70">
                                    {reward.details}
                                </p>
                            </div>
                            <AnimatedCircularProgressBar
                                className="w-18 h-18 text-sm ml-auto shrink-0"
                                value={userPoints}
                                min={0}
                                max={reward.cost_points}
                                gaugePrimaryColor={
                                    userPoints >= reward.cost_points
                                        ? "oklch(66.6% 0.179 58.318)"
                                        : "#463acb"
                                }
                                gaugeSecondaryColor="hsl(240 4.8% 95.9%)"
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Rewards;
