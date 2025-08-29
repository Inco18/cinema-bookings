import {
    Tabs,
    TabsContent,
    TabsContents,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/shadcn-io/tabs";
import MainLayout from "@/Layouts/MainLayout";
import { PointsHistory, Reward } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { HandCoins } from "lucide-react";
import Rewards from "./Rewards";

type Props = {
    points: PointsHistory[];
    rewards: Reward[];
};

export default function LoyaltyProgramIndex({ points, rewards }: Props) {
    const user = usePage().props.auth.user;

    return (
        <>
            <Head title="Program lojalnościowy - Punkty" />
            <Tabs defaultValue="points" className="max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="points">Twoje punkty</TabsTrigger>
                    <TabsTrigger value="rewardsShop">Nagrody</TabsTrigger>
                    <TabsTrigger value="rewards">Odebrane nagrody</TabsTrigger>
                </TabsList>

                <TabsContents>
                    <TabsContent value="points" className="px-5">
                        <div className="flex mt-2 my-5 px-3 md:px-0 items-center justify-between gap-3">
                            <h1 className="text-2xl m-0">Twoje punkty</h1>
                            <div
                                className="bg-background rounded-full py-2 px-5 cursor-default flex gap-2 text-amber-600 items-center"
                                title="Punkty programu lojalnościowego"
                            >
                                <HandCoins />
                                {user.points_number}
                            </div>
                        </div>
                        <div className="mt-2 space-y-6 bg-background p-2 sm:rounded-lg sm:p-4 border mb-20">
                            <div className="flex flex-col w-full gap-3">
                                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-3 bg-primary text-background p-2 rounded-lg">
                                    <div className="flex flex-col items-start gap-0 justify-start">
                                        <p className="font-medium text-lg">
                                            Opis
                                        </p>
                                    </div>
                                    <div className="flex md:justify-end md:w-40 md:ml-auto">
                                        <p className="text-sm flex items-center">
                                            Zmiana punktów
                                        </p>
                                    </div>
                                    <div className="flex md:justify-end md:w-32">
                                        <p className="text-sm flex justify-end text-right">
                                            Data
                                        </p>
                                    </div>
                                </div>
                                {points.length > 0 ? (
                                    points.map((point) => (
                                        <div className="flex-1 flex flex-col md:flex-row gap-3 bg-secondary p-2 rounded-lg">
                                            <div className="flex flex-col items-start gap-0 justify-start">
                                                <p className="font-medium text-lg">
                                                    {point.description}
                                                </p>
                                            </div>
                                            <div className="flex md:justify-end md:w-40 md:ml-auto">
                                                <p
                                                    className={`text-sm flex items-center ${
                                                        point.points_change > 0
                                                            ? "text-green-500"
                                                            : "text-red-500"
                                                    }`}
                                                >
                                                    {point.points_change > 0
                                                        ? `+${point.points_change}`
                                                        : `${point.points_change}`}{" "}
                                                    pkt
                                                </p>
                                            </div>
                                            <div className="flex md:justify-end md:w-32">
                                                <p className="text-sm flex items-center">
                                                    {new Date(
                                                        point.created_at
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex-1 flex flex-col md:flex-row gap-3 bg-secondary p-2 rounded-lg">
                                        <div className="flex flex-col items-start gap-0 justify-start">
                                            <p className="font-medium text-lg">
                                                Nie masz jeszcze żadnych
                                                punktów.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="rewardsShop" className="mb-5 px-5">
                        <Rewards
                            rewards={rewards}
                            userPoints={user.points_number}
                        />
                    </TabsContent>
                    <TabsContent value="rewards" className="space-y-6 p-6">
                        Test
                    </TabsContent>
                </TabsContents>
            </Tabs>
        </>
    );
}

LoyaltyProgramIndex.layout = (page: React.ReactNode) => (
    <MainLayout children={page} />
);
