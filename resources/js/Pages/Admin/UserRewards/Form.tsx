import { Button } from "@/Components/ui/button";
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
import { UserRewardRequest } from "@/schema";
import { Reward, User, UserReward } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ZodIssue } from "zod";
import UserPicker from "../Bookings/UserPicker";
import RewardPicker from "./RewardPicker";
import { UserRewardStatus } from "@/types/enums";

type Props = {
    userReward?: UserReward;
    users: User[];
    rewards: Reward[];
};

const UserRewardForm = ({ userReward, users, rewards }: Props) => {
    const { data, setData, post, errors, clearErrors, setError, processing } =
        useForm({
            user_id: userReward?.user_id || "",
            reward_id: userReward?.reward_id || "",
            booking_id: userReward?.booking_id || null,
            status: userReward?.status || UserRewardStatus.ACTIVE,
            _method: userReward ? "put" : "post",
        });
    const [didFail, setDidFail] = useState(false);
    const inputsRef = useRef<{
        user_id?: HTMLButtonElement | null;
        reward_id?: HTMLButtonElement | null;
        booking_id?: HTMLInputElement | null;
        status?: HTMLInputElement | null;
    }>({
        user_id: null,
        reward_id: null,
        booking_id: null,
        status: null,
    });

    const validateInputs = () => {
        const parsed = UserRewardRequest.safeParse(data);
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
        if (userReward) {
            post(route("userRewards.update", { userReward }, false), {
                onError: () => {
                    setDidFail(true);
                    toast.error(
                        "Nie udało się zaktualizować nagrody użytkownika"
                    );
                },
            });
        } else {
            post(route("userRewards.store"), {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się dodać nagrody użytkownika");
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {userReward
                            ? "Nagrody użytkowników - Edycja"
                            : "Nagrody użytkowników - Tworzenie"}
                    </h2>
                </>
            }
        >
            <Head
                title={
                    userReward
                        ? "Nagrody użytkowników - Edycja"
                        : "Nagrody użytkowników - Tworzenie"
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
                        htmlFor="reward"
                        className={`${
                            errors.reward_id ? "!text-destructive" : ""
                        }`}
                    >
                        Nagroda
                    </Label>
                    <RewardPicker
                        id="reward"
                        ref={(ref) =>
                            (inputsRef.current.reward_id =
                                ref as HTMLButtonElement)
                        }
                        rewards={rewards}
                        value={String(data.reward_id)}
                        setValue={(value: string) => {
                            setData("reward_id", Number(value));
                        }}
                    />
                    {errors.reward_id && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.reward_id}
                        </p>
                    )}
                </div>
                <div>
                    <Label
                        htmlFor="status"
                        className={`${
                            errors.status ? "!text-destructive" : ""
                        }`}
                    >
                        Status
                    </Label>
                    <Select
                        onValueChange={(val) => {
                            clearErrors("status");
                            setData("status", val);
                        }}
                        defaultValue={data.status}
                    >
                        <SelectTrigger
                            id="status"
                            ref={(ref) =>
                                (inputsRef.current.status =
                                    ref as HTMLInputElement)
                            }
                            className={`mt-1 w-full ${
                                errors.status ? "!border-destructive" : ""
                            }`}
                        >
                            <SelectValue placeholder="Wybierz status" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(UserRewardStatus).map((status) => {
                                return (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                    {errors.status && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.status}
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
                <div className="flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() =>
                            router.get(
                                route("userRewards.index", route().queryParams)
                            )
                        }
                    >
                        Anuluj
                    </Button>
                    <Button disabled={processing}>
                        {userReward ? "Zapisz" : "Stwórz"}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default UserRewardForm;
