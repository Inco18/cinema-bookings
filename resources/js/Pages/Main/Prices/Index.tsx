import MainLayout from "@/Layouts/MainLayout";
import { formatPrice } from "@/lib/utils";
import { PriceCamelCase } from "@/types";
import { Head } from "@inertiajs/react";

type Props = {
    prices: PriceCamelCase[];
    validFrom: string;
};

export default function PricesIndex({ prices, validFrom }: Props) {
    return (
        <MainLayout>
            <Head title="Cennik" />

            <h1 className="text-2xl mt-2 space-y-6 max-w-4xl mx-auto px-3 md:px-0">
                Cennik
            </h1>
            <p className="text-sm text-foreground/60 space-y-6 max-w-4xl mx-auto px-3 md:px-0">
                Obowiązuje od: {validFrom}
            </p>
            <div className="mt-2 space-y-6 max-w-4xl bg-background p-2 sm:rounded-lg sm:p-4 border mx-auto mb-20">
                <div className="flex flex-col w-full gap-3">
                    <div className="flex-1 flex flex-col md:flex-row justify-between md:items-center gap-3 bg-primary text-background p-2 rounded-lg">
                        <div className="flex flex-col items-start gap-0 justify-start">
                            <p className="font-medium text-lg">Typ biletu</p>
                        </div>
                        <div className="flex items-center">
                            <p className="text-xs flex items-center">
                                Cena min. -{" "}
                                <span className="font-semibold mx-1">
                                    Cena podst.
                                </span>{" "}
                                - Cena max.
                            </p>
                        </div>
                    </div>
                    {prices.map((price) => (
                        <div className="flex-1 flex flex-col md:flex-row justify-between md:items-center gap-3 bg-secondary p-2 rounded-lg">
                            <div className="flex flex-col items-start gap-0 justify-start">
                                <p className="font-medium text-lg">
                                    {price.ticketType}
                                </p>
                                {price.description && (
                                    <p className="text-foreground/60 text-xs">
                                        {price.description}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <p className="text-xs flex items-center">
                                    {formatPrice(price.minPrice)} -{" "}
                                    <span className="text-2xl font-semibold mx-1">
                                        {formatPrice(price.basePrice)}
                                    </span>{" "}
                                    - {formatPrice(price.maxPrice)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
