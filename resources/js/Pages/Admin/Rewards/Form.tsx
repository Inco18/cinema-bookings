import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { RewardRequest } from "@/schema";
import { Reward } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { X } from "lucide-react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ZodIssue } from "zod";

type Props = {
    reward?: Reward;
    rewardTypes: string[];
    rewardValueTypes: string[];
};

const RewardForm = ({ reward, rewardTypes, rewardValueTypes }: Props) => {
    const { data, setData, post, errors, clearErrors, setError, processing } =
        useForm({
            name: reward?.name || "",
            cost_points: reward?.cost_points || 0,
            type: reward?.type || rewardTypes[0],
            value: Number(reward?.value) || "",
            value_type: reward?.value_type || rewardValueTypes[0],
            details: reward?.details || "",
            image: null,
            removeImage: false,
            _method: reward ? "put" : "post",
        });
    const [didFail, setDidFail] = useState(false);
    const inputsRef = useRef<{
        name: HTMLInputElement | null;
        cost_points: HTMLInputElement | null;
        type: HTMLInputElement | null;
        value: HTMLInputElement | null;
        value_type: HTMLInputElement | null;
        details: HTMLInputElement | null;
        image: HTMLInputElement | null;
    }>({
        name: null,
        cost_points: null,
        type: null,
        value: null,
        value_type: null,
        details: null,
        image: null,
    });

    const validateInputs = () => {
        const parsed = RewardRequest.safeParse(data);
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
        if (!didFail) return;
        validateInputs();
    }, [data]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const zodErrors = validateInputs();
        if (Object.keys(zodErrors).length !== 0) {
            inputsRef.current[
                Object.keys(zodErrors)[0] as keyof typeof zodErrors
            ]?.focus();
            setDidFail(true);
            return;
        }
        if (reward) {
            post(route("rewards.update", { reward }, false), {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się zaktualizować nagrody");
                },
            });
        } else {
            post(route("rewards.store"), {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się dodać nagrody");
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {reward ? "Nagrody - Edycja" : "Nagrody - Tworzenie"}
                    </h2>
                </>
            }
        >
            <Head title={reward ? "Nagrody - Edycja" : "Nagrody - Tworzenie"} />
            <form
                onSubmit={submit}
                className="max-w-lg p-4 m-auto mt-2 space-y-6 border bg-background sm:rounded-lg sm:p-8"
            >
                <div>
                    <Label
                        htmlFor="name"
                        className={`${errors.name ? "!text-destructive" : ""}`}
                    >
                        Nazwa
                    </Label>
                    <Input
                        type="text"
                        ref={(ref) => (inputsRef.current.name = ref)}
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className={`mt-1 ${
                            errors.name ? "!border-destructive" : ""
                        }`}
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.name}
                        </p>
                    )}
                </div>
                <div>
                    <Label
                        htmlFor="cost_points"
                        className={`${
                            errors.cost_points ? "!text-destructive" : ""
                        }`}
                    >
                        Koszt (pkt)
                    </Label>
                    <Input
                        type="number"
                        ref={(ref) => (inputsRef.current.cost_points = ref)}
                        id="cost_points"
                        value={data.cost_points}
                        onChange={(e) =>
                            setData("cost_points", Number(e.target.value))
                        }
                        className={`mt-1 ${
                            errors.cost_points ? "!border-destructive" : ""
                        }`}
                    />
                    {errors.cost_points && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.cost_points}
                        </p>
                    )}
                </div>
                <div>
                    <Label
                        htmlFor="type"
                        className={`${errors.type ? "!text-destructive" : ""}`}
                    >
                        Typ
                    </Label>
                    <Select
                        onValueChange={(val) => {
                            clearErrors("type");
                            setData("type", val);
                        }}
                        defaultValue={data.type}
                    >
                        <SelectTrigger
                            id="type"
                            ref={(ref) =>
                                (inputsRef.current.type =
                                    ref as HTMLInputElement)
                            }
                            className={`mt-1 w-full ${
                                errors.type ? "!border-destructive" : ""
                            }`}
                        >
                            <SelectValue placeholder="Wybierz typ" />
                        </SelectTrigger>
                        <SelectContent>
                            {rewardTypes.map((type) => {
                                return (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                    {errors.type && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.type}
                        </p>
                    )}
                </div>
                <div>
                    <Label
                        htmlFor="value"
                        className={`${errors.value ? "!text-destructive" : ""}`}
                    >
                        Wartość
                    </Label>
                    <Input
                        type="number"
                        ref={(ref) => (inputsRef.current.value = ref)}
                        id="value"
                        value={data.value}
                        onChange={(e) => {
                            setData("value", Number(e.target.value));
                        }}
                        className={`mt-1 ${
                            errors.value ? "!border-destructive" : ""
                        }`}
                    />
                    {errors.value && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.value}
                        </p>
                    )}
                </div>
                <div>
                    <Label
                        htmlFor="value_type"
                        className={`${
                            errors.value_type ? "!text-destructive" : ""
                        }`}
                    >
                        Typ wartości
                    </Label>
                    <Select
                        onValueChange={(val) => {
                            clearErrors("value_type");
                            setData("value_type", val);
                        }}
                        defaultValue={data.value_type}
                    >
                        <SelectTrigger
                            id="value_type"
                            ref={(ref) =>
                                (inputsRef.current.value_type =
                                    ref as HTMLInputElement)
                            }
                            className={`mt-1 w-full ${
                                errors.value_type ? "!border-destructive" : ""
                            }`}
                        >
                            <SelectValue placeholder="Wybierz typ wartości" />
                        </SelectTrigger>
                        <SelectContent>
                            {rewardValueTypes.map((valueType) => {
                                return (
                                    <SelectItem
                                        key={valueType}
                                        value={valueType}
                                    >
                                        {valueType}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                    {errors.value_type && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.value_type}
                        </p>
                    )}
                </div>
                <div>
                    <Label
                        htmlFor="details"
                        className={`${
                            errors.details ? "!text-destructive" : ""
                        }`}
                    >
                        Szczegóły
                    </Label>
                    <Input
                        type="text"
                        ref={(ref) => (inputsRef.current.details = ref)}
                        id="details"
                        value={data.details}
                        onChange={(e) => setData("details", e.target.value)}
                        className={`mt-1 ${
                            errors.details ? "!border-destructive" : ""
                        }`}
                    />
                    {errors.details && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.details}
                        </p>
                    )}
                </div>
                <div className="flex items-center justify-center gap-2">
                    {reward?.image && (
                        <img
                            className="max-w-[40%] rounded-sm"
                            src={`/storage/${reward?.image}`}
                        />
                    )}
                    <div className="flex-1">
                        <Label
                            htmlFor="image"
                            className={`${
                                errors.image ? "!text-destructive" : ""
                            }`}
                        >
                            Plakat
                        </Label>
                        <Input
                            type="file"
                            ref={(ref) =>
                                (inputsRef.current.image =
                                    ref as HTMLInputElement)
                            }
                            id="image"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    //@ts-ignore
                                    setData("image", e.target.files[0]);
                                }
                            }}
                            className={`mt-1 ${
                                errors.image ? "!border-destructive" : ""
                            }`}
                        />
                        {errors.image && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.image}
                            </p>
                        )}
                        {reward?.image && !data.image && (
                            <div className="flex items-center mt-2 space-x-2">
                                <Checkbox
                                    id="removeImage"
                                    checked={data.removeImage}
                                    onCheckedChange={(value) =>
                                        setData("removeImage", Boolean(value))
                                    }
                                />
                                <label
                                    htmlFor="removeImage"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Usuń plakat
                                </label>
                            </div>
                        )}

                        {data.image && (
                            <div className="flex items-center gap-2 mt-1 text-sm">
                                Wybrany plik: {(data.image as File).name}
                                <Button
                                    size={"icon"}
                                    variant={"ghost"}
                                    type="button"
                                    onClick={() => {
                                        setData("image", null);
                                        if (inputsRef.current.image) {
                                            inputsRef.current.image.value = "";
                                        }
                                    }}
                                >
                                    <X />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() =>
                            router.get(
                                route("rewards.index", route().queryParams)
                            )
                        }
                    >
                        Anuluj
                    </Button>
                    <Button disabled={processing}>
                        {reward ? "Zapisz" : "Stwórz"}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default RewardForm;
