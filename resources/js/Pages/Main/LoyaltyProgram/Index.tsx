import MainLayout from "@/Layouts/MainLayout";
import { formatPrice } from "@/lib/utils";
import { PointsHistory, PriceCamelCase } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { HandCoins } from "lucide-react";

type Props = {
    points: PointsHistory[];
};

export default function LoyaltyProgramIndex({ points }: Props) {
    const user = usePage().props.auth.user;

    return (
        <MainLayout>
            <Head title="Program lojalnościowy - Punkty" />

            <div className="flex mt-2 my-5 max-w-4xl mx-auto px-3 md:px-0 items-center gap-3">
                <h1 className="text-2xl m-0">Twoje punkty</h1>
                <div
                    className="bg-background rounded-full py-2 px-5 cursor-default flex gap-2 text-amber-600 items-center"
                    title="Punkty programu lojalnościowego"
                >
                    <HandCoins />
                    {user.points_number}
                </div>
            </div>
            <div className="mt-2 space-y-6 max-w-4xl bg-background p-2 sm:rounded-lg sm:p-4 border mx-auto mb-20">
                <div className="flex flex-col w-full gap-3">
                    <div className="flex-1 flex flex-col md:flex-row md:items-center gap-3 bg-primary text-background p-2 rounded-lg">
                        <div className="flex flex-col items-start gap-0 justify-start">
                            <p className="font-medium text-lg">Opis</p>
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
                                            : `-${point.points_change}`}{" "}
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
                                    Nie masz jeszcze żadnych punktów.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
