import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { PointsHistoryRequest } from "@/schema";
import { PointsHistory, User } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ZodIssue } from "zod";
import UserPicker from "../Bookings/UserPicker";

type Props = {
    pointsHistory?: PointsHistory;
    users: User[];
};

const PointsHistoryForm = ({ pointsHistory, users }: Props) => {
    const { data, setData, post, errors, clearErrors, setError, processing } =
        useForm({
            user_id: pointsHistory?.user_id || "",
            booking_id: pointsHistory?.booking_id || null,
            user_reward_id: pointsHistory?.user_reward_id || null,
            points_change: pointsHistory?.points_change || 0,
            description: pointsHistory?.description || "",
            _method: pointsHistory ? "put" : "post",
        });
    const [didFail, setDidFail] = useState(false);
    const inputsRef = useRef<{
        user_id?: HTMLButtonElement | null;
        booking_id?: HTMLInputElement | null;
        user_reward_id?: HTMLInputElement | null;
        points_change?: HTMLInputElement | null;
        description?: HTMLTextAreaElement | null;
    }>({
        user_id: null,
        booking_id: null,
        user_reward_id: null,
        points_change: null,
        description: null,
    });

    const validateInputs = () => {
        const parsed = PointsHistoryRequest.safeParse(data);
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
        if (pointsHistory) {
            post(route("pointsHistory.update", { pointsHistory }, false), {
                onError: () => {
                    setDidFail(true);
                    toast.error(
                        "Nie udało się zaktualizować wpisu historii punktów"
                    );
                },
            });
        } else {
            post(route("pointsHistory.store"), {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się dodać wpisu historii punktów");
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {pointsHistory
                            ? "Historia punktów - Edycja"
                            : "Historia punktów - Tworzenie"}
                    </h2>
                </>
            }
        >
            <Head
                title={
                    pointsHistory
                        ? "Historia punktów - Edycja"
                        : "Historia punktów - Tworzenie"
                }
            />
            <form
                onSubmit={submit}
                className="max-w-lg p-4 m-auto mt-2 space-y-6 border bg-background sm:rounded-lg sm:p-8"
            >
                <div>
                    <Label
                        htmlFor="user"
                        className={`${
                            errors.user_id ? "!text-destructive" : ""
                        }`}
                    >
                        Użytkownik
                    </Label>
                    <UserPicker
                        id="user"
                        ref={(ref) =>
                            (inputsRef.current.user_id =
                                ref as HTMLButtonElement)
                        }
                        users={users}
                        value={String(data.user_id)}
                        setValue={(value: string) => {
                            setData("user_id", Number(value));
                        }}
                    />
                    {errors.user_id && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.user_id}
                        </p>
                    )}
                </div>
                <div>
                    <Label
                        htmlFor="points_change"
                        className={`${
                            errors.points_change ? "!text-destructive" : ""
                        }`}
                    >
                        Zmiana punktów
                    </Label>
                    <Input
                        type="number"
                        ref={(ref) => (inputsRef.current.points_change = ref)}
                        id="points_change"
                        value={data.points_change}
                        onChange={(e) => {
                            setData("points_change", Number(e.target.value));
                        }}
                        className={`mt-1 ${
                            errors.points_change ? "!border-destructive" : ""
                        }`}
                    />
                    {errors.points_change && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.points_change}
                        </p>
                    )}
                </div>
                <div>
                    <Label
                        htmlFor="description"
                        className={`${
                            errors.description ? "!text-destructive" : ""
                        }`}
                    >
                        Opis
                    </Label>
                    <Textarea
                        ref={(ref) => (inputsRef.current.description = ref)}
                        id="description"
                        value={data.description}
                        onChange={(e) => {
                            setData("description", e.target.value);
                        }}
                        className={`mt-1 ${
                            errors.description ? "!border-destructive" : ""
                        }`}
                        rows={4}
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.description}
                        </p>
                    )}
                </div>
                <div>
                    <Label
                        htmlFor="booking"
                        className={`${
                            errors.booking_id ? "!text-destructive" : ""
                        }`}
                    >
                        ID rezerwacji (opcjonalne)
                    </Label>
                    <Input
                        type="number"
                        ref={(ref) => (inputsRef.current.booking_id = ref)}
                        id="booking"
                        value={data.booking_id ?? ""}
                        onChange={(e) => {
                            setData("booking_id", Number(e.target.value));
                        }}
                        className={`mt-1 ${
                            errors.booking_id ? "!border-destructive" : ""
                        }`}
                    />
                    {errors.booking_id && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.booking_id}
                        </p>
                    )}
                </div>
                <div>
                    <Label
                        htmlFor="user_reward"
                        className={`${
                            errors.user_reward_id ? "!text-destructive" : ""
                        }`}
                    >
                        ID nagrody użytkownika (opcjonalne)
                    </Label>
                    <Input
                        type="number"
                        ref={(ref) => (inputsRef.current.user_reward_id = ref)}
                        id="user_reward"
                        value={data.user_reward_id ?? ""}
                        onChange={(e) => {
                            setData("user_reward_id", Number(e.target.value));
                        }}
                        className={`mt-1 ${
                            errors.user_reward_id ? "!border-destructive" : ""
                        }`}
                    />
                    {errors.user_reward_id && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.user_reward_id}
                        </p>
                    )}
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() =>
                            router.get(
                                route("pointsHistory.index", route().queryParams)
                            )
                        }
                    >
                        Anuluj
                    </Button>
                    <Button disabled={processing}>
                        {pointsHistory ? "Zapisz" : "Stwórz"}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default PointsHistoryForm;
