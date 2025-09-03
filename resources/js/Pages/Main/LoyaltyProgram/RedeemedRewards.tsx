import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { QRCode } from "@/Components/ui/shadcn-io/qr-code";
import { UserReward } from "@/types";
import { RewardType, UserRewardStatus } from "@/types/enums";
import { DialogClose } from "@radix-ui/react-dialog";
import clsx from "clsx";
import { HandCoins, QrCode } from "lucide-react";

type Props = {
    redeemedRewards: UserReward[];
    userPoints: number;
};

const RedeemedRewards = ({ redeemedRewards, userPoints }: Props) => {
    return (
        <>
            <div className="flex mt-2 my-5 px-3 md:px-0 items-center justify-between gap-3">
                <h1 className="text-2xl m-0">Odebrane nagrody</h1>
                <div
                    className="bg-background rounded-full py-2 px-5 cursor-default flex gap-2 text-amber-600 items-center"
                    title="Punkty programu lojalnościowego"
                >
                    <HandCoins />
                    {userPoints}
                </div>
            </div>
            <div className="flex flex-col gap-3 mb-5">
                {redeemedRewards.map((redeemedReward) => {
                    return (
                        <Dialog>
                            <DialogTrigger
                                asChild
                                onClick={(e) => {
                                    if (
                                        redeemedReward.status ===
                                        UserRewardStatus.USED
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <div
                                    key={redeemedReward.id}
                                    className={clsx(
                                        "bg-background rounded-lg flex flex-col sm:flex-row sm:items-center gap-4 transition-all border",
                                        redeemedReward.status ===
                                            UserRewardStatus.USED
                                            ? "opacity-60 cursor-not-allowed px-4 py-2"
                                            : "cursor-pointer hover:ring-[3px] hover:ring-primary/30 hover:border-primary p-4"
                                    )}
                                >
                                    {redeemedReward.reward?.type !==
                                        RewardType.DISCOUNT && (
                                        <div
                                            className={clsx(
                                                "shrink-0",
                                                redeemedReward.status ===
                                                    UserRewardStatus.USED
                                                    ? "w-14 h-14 grayscale"
                                                    : "w-20 h-20"
                                            )}
                                        >
                                            <img
                                                src={
                                                    redeemedReward.reward?.image
                                                        ? `/storage/${redeemedReward.reward?.image}`
                                                        : "/reward-placeholder.jpg"
                                                }
                                                className="rounded-full"
                                            />
                                        </div>
                                    )}
                                    {redeemedReward.reward?.type ===
                                        RewardType.DISCOUNT && (
                                        <div
                                            className={clsx(
                                                "flex items-center justify-center bg-primary text-background rounded-full shrink-0",
                                                redeemedReward.status ===
                                                    UserRewardStatus.USED
                                                    ? "w-14 h-14 grayscale"
                                                    : "w-20 h-20"
                                            )}
                                        >
                                            <span
                                                className={clsx(
                                                    redeemedReward.status ===
                                                        UserRewardStatus.USED
                                                        ? "text-base"
                                                        : "text-xl font-bold"
                                                )}
                                            >
                                                {new Intl.NumberFormat(
                                                    "pl-PL",
                                                    {
                                                        maximumFractionDigits: 2,
                                                    }
                                                ).format(
                                                    redeemedReward.reward?.value
                                                )}
                                                {redeemedReward.reward
                                                    ?.value_type === "percent"
                                                    ? " %"
                                                    : " zł"}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <p
                                            className={clsx(
                                                "font-medium",
                                                redeemedReward.status ===
                                                    UserRewardStatus.USED
                                                    ? "text-lg"
                                                    : "text-xl"
                                            )}
                                        >
                                            {redeemedReward.reward?.name}
                                        </p>
                                        <p
                                            className={clsx(
                                                "text-foreground/70",
                                                redeemedReward.status ===
                                                    UserRewardStatus.USED &&
                                                    "text-sm"
                                            )}
                                        >
                                            {redeemedReward.reward?.details}
                                        </p>
                                    </div>
                                    {redeemedReward.status !==
                                        UserRewardStatus.USED && (
                                        <Button className="ml-auto shrink-0">
                                            <QrCode />
                                            Pokaż kod
                                        </Button>
                                    )}
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {redeemedReward.reward?.name}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Pokaż ten kod w kasie, aby wykorzystać
                                        nagrodę.
                                    </DialogDescription>
                                </DialogHeader>
                                <QRCode data={`REW${redeemedReward.id}`} />
                            </DialogContent>
                        </Dialog>
                    );
                })}
            </div>
        </>
    );
};

export default RedeemedRewards;
