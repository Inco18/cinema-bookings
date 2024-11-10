import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { MultiSelect } from "@/Components/ui/multiple-select";
import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { UserRequest } from "@/schema";
import { User } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ZodIssue } from "zod";
import { RoleType } from "@/types/enums";
import { translatedRoles } from "@/lib/utils";

type Props = { user?: User; roles: RoleType[] };

const UserForm = ({ user, roles }: Props) => {
    const {
        data,
        setData,
        patch,
        post,
        errors,
        clearErrors,
        setError,
        processing,
    } = useForm({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        roles: user?.roles?.map((role) => role.name) || [],
    });
    const [didFail, setDidFail] = useState(false);
    const inputsRef = useRef<{
        first_name: HTMLInputElement | null;
        last_name: HTMLInputElement | null;
        email: HTMLInputElement | null;
        roles: HTMLInputElement | null;
    }>({ first_name: null, last_name: null, email: null, roles: null });

    const validateInputs = () => {
        const parsed = UserRequest.safeParse(data);
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
        if (user) {
            patch(route("users.update", { user }), {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się zaktualizować użytkownika");
                },
            });
        } else {
            post(route("users.store"), {
                onError: () => {
                    setDidFail(true);
                    toast.error("Nie udało się dodać użytkownika");
                },
            });
        }
    };
    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {user
                            ? "Użytkownicy - Edycja"
                            : "Użytkownicy - Tworzenie"}
                    </h2>
                </>
            }
        >
            <Head
                title={
                    user ? "Użytkownicy - Edycja" : "Użytkownicy - Tworzenie"
                }
            />
            <form
                onSubmit={submit}
                className="mt-2 space-y-6 max-w-lg m-auto bg-background p-4 sm:rounded-lg sm:p-8 border"
            >
                <div>
                    <Label
                        htmlFor="first_name"
                        className={`${
                            errors.first_name ? "!text-destructive" : ""
                        }`}
                    >
                        Imię
                    </Label>
                    <Input
                        type="text"
                        ref={(ref) =>
                            (inputsRef.current.first_name =
                                ref as HTMLInputElement)
                        }
                        id="first_name"
                        value={data.first_name}
                        onChange={(e) => {
                            setData("first_name", e.target.value);
                        }}
                        className={`${
                            errors.first_name ? "!border-destructive" : ""
                        }`}
                    />
                    {errors.first_name && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.first_name}
                        </p>
                    )}
                </div>
                <div>
                    <Label
                        htmlFor="last_name"
                        className={`${
                            errors.last_name ? "!text-destructive" : ""
                        }`}
                    >
                        Nazwisko
                    </Label>
                    <Input
                        type="text"
                        ref={(ref) =>
                            (inputsRef.current.last_name =
                                ref as HTMLInputElement)
                        }
                        id="last_name"
                        value={data.last_name}
                        onChange={(e) => {
                            setData("last_name", e.target.value);
                        }}
                        className={`${
                            errors.last_name ? "!border-destructive" : ""
                        }`}
                    />
                    {errors.last_name && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.last_name}
                        </p>
                    )}
                </div>
                <div>
                    <Label
                        htmlFor="email"
                        className={`${errors.email ? "!text-destructive" : ""}`}
                    >
                        Email
                    </Label>
                    <Input
                        type="email"
                        ref={(ref) =>
                            (inputsRef.current.email = ref as HTMLInputElement)
                        }
                        id="email"
                        value={data.email}
                        onChange={(e) => {
                            setData("email", e.target.value);
                        }}
                        className={`${
                            errors.email ? "!border-destructive" : ""
                        }`}
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>
                <div>
                    <Label
                        className={`${errors.roles ? "!text-destructive" : ""}`}
                        htmlFor="roles"
                    >
                        Role
                    </Label>
                    <MultiSelect
                        onValueChange={(value) =>
                            setData("roles", value as RoleType[])
                        }
                        id="roles"
                        ref={(ref) =>
                            (inputsRef.current.roles = ref as HTMLInputElement)
                        }
                        className={`${
                            errors.roles ? "!border-destructive" : ""
                        }`}
                        defaultValue={data.roles}
                        placeholder="Wybierz role"
                        variant="inverted"
                        options={roles.map((role) => {
                            return {
                                value: role,
                                label: translatedRoles[role],
                            };
                        })}
                    />
                    {errors["roles"] && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.roles}
                        </p>
                    )}
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() =>
                            router.get(
                                route("users.index", route().queryParams)
                            )
                        }
                    >
                        Anuluj
                    </Button>
                    <Button disabled={processing}>
                        {user ? "Zapisz" : "Stwórz"}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default UserForm;
