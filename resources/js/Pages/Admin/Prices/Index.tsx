import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { Price } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Coins, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { PriceRequest } from "@/schema";
import { ZodIssue } from "zod";

type Props = {
    prices: Price[];
};

const PricesIndex = ({ prices }: Props) => {
    const [editingId, setEditingId] = useState<number | null>(null);

    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Zarządzanie cenami biletów
                    </h2>
                </>
            }
        >
            <Head title="Ceny biletów" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h3 className="mb-2 text-lg font-semibold">
                                    Dynamiczne ustalanie cen
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    System automatycznie dostosowuje ceny biletów w zależności od zajętości sali i czasu pozostałego do rozpoczęcia seansu.
                                    Możesz ustawić cenę bazową oraz minimalną i maksymalną granicę cenową dla każdego typu biletu.
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {prices.map((price) => (
                                    <PriceCard
                                        key={price.id}
                                        price={price}
                                        isEditing={editingId === price.id}
                                        onEditStart={() => setEditingId(price.id)}
                                        onEditEnd={() => setEditingId(null)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

type PriceCardProps = {
    price: Price;
    isEditing: boolean;
    onEditStart: () => void;
    onEditEnd: () => void;
};

const PriceCard = ({ price, isEditing, onEditStart, onEditEnd }: PriceCardProps) => {
    const { data, setData, put, errors, clearErrors, setError, processing } = useForm({
        base_price: price.base_price,
        min_price: price.min_price,
        max_price: price.max_price,
        description: price.description || "",
    });
    const [didFail, setDidFail] = useState(false);

    const validateInputs = () => {
        const parsed = PriceRequest.safeParse(data);
        const zodErrors =
            parsed?.error?.flatten((issue: ZodIssue) => ({
                message: issue.message,
                errorCode: issue.code,
            })).fieldErrors || {};
        Object.keys(data).forEach((key) => {
            if (zodErrors[key as keyof typeof zodErrors]) {
                setError(
                    key as keyof typeof zodErrors,
                    //@ts-ignore
                    zodErrors[key as keyof typeof zodErrors][0].message
                );
            } else {
                clearErrors(key as keyof typeof zodErrors);
            }
        });
        return zodErrors;
    };

    useEffect(() => {
        if (!didFail || !isEditing) return;
        validateInputs();
    }, [data, isEditing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const zodErrors = validateInputs();
        if (Object.keys(zodErrors).length !== 0) {
            setDidFail(true);
            return;
        }
        put(route("prices.update", { price }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Cena została zaktualizowana");
                setDidFail(false);
                onEditEnd();
            },
            onError: () => {
                toast.error("Nie udało się zaktualizować ceny");
                setDidFail(true);
            },
        });
    };

    const handleCancel = () => {
        setData({
            base_price: price.base_price,
            min_price: price.min_price,
            max_price: price.max_price,
            description: price.description || "",
        });
        clearErrors();
        setDidFail(false);
        onEditEnd();
    };

    const getTicketTypeLabel = (type: string) => {
        return type === "normal" ? "Normalny" : "Ulgowy";
    };

    const getTicketTypeIcon = (type: string) => {
        return type === "normal" ? <Coins className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />;
    };

    return (
        <Card className={`transition-all h-fit ${isEditing ? "ring-2 ring-primary " : ""}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {getTicketTypeIcon(price.ticket_type)}
                    Bilet {getTicketTypeLabel(price.ticket_type)}
                </CardTitle>
                <CardDescription>
                    Ustaw przedział cenowy dla biletów typu {getTicketTypeLabel(price.ticket_type).toLowerCase()}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {!isEditing ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <TrendingDown className="w-4 h-4" />
                                        Cena minimalna
                                    </div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {Number(price.min_price).toFixed(2)} zł
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Coins className="w-4 h-4" />
                                        Cena bazowa
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {Number(price.base_price).toFixed(2)} zł
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <TrendingUp className="w-4 h-4" />
                                        Cena maksymalna
                                    </div>
                                    <div className="text-2xl font-bold text-red-600">
                                        {Number(price.max_price).toFixed(2)} zł
                                    </div>
                                </div>
                            </div>
                            {price.description && (
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-muted-foreground">
                                        {price.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label
                                        htmlFor={`min_price_${price.id}`}
                                        className={errors.min_price ? "text-destructive" : ""}
                                    >
                                        Cena min. (zł)
                                    </Label>
                                    <Input
                                        id={`min_price_${price.id}`}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.min_price}
                                        onChange={(e) => setData("min_price", parseFloat(e.target.value))}
                                        className={`mt-1 ${errors.min_price ? "border-destructive" : ""}`}
                                    />
                                    {errors.min_price && (
                                        <p className="mt-1 text-xs text-destructive">
                                            {errors.min_price}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label
                                        htmlFor={`base_price_${price.id}`}
                                        className={errors.base_price ? "text-destructive" : ""}
                                    >
                                        Cena bazowa (zł)
                                    </Label>
                                    <Input
                                        id={`base_price_${price.id}`}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.base_price}
                                        onChange={(e) => setData("base_price", parseFloat(e.target.value))}
                                        className={`mt-1 ${errors.base_price ? "border-destructive" : ""}`}
                                    />
                                    {errors.base_price && (
                                        <p className="mt-1 text-xs text-destructive">
                                            {errors.base_price}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label
                                        htmlFor={`max_price_${price.id}`}
                                        className={errors.max_price ? "text-destructive" : ""}
                                    >
                                        Cena maks. (zł)
                                    </Label>
                                    <Input
                                        id={`max_price_${price.id}`}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.max_price}
                                        onChange={(e) => setData("max_price", parseFloat(e.target.value))}
                                        className={`mt-1 ${errors.max_price ? "border-destructive" : ""}`}
                                    />
                                    {errors.max_price && (
                                        <p className="mt-1 text-xs text-destructive">
                                            {errors.max_price}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor={`description_${price.id}`}>
                                    Opis (opcjonalny)
                                </Label>
                                <Textarea
                                    id={`description_${price.id}`}
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    className="mt-1"
                                    rows={3}
                                    placeholder="Dodatkowe informacje o cenie..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2 mt-5">
                    {!isEditing ? (
                        <Button type="button" onClick={onEditStart}>
                            Edytuj
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={processing}
                            >
                                Anuluj
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Zapisz
                            </Button>
                        </>
                    )}
                </CardFooter>
            </form>
        </Card>
    );
};

export default PricesIndex;
