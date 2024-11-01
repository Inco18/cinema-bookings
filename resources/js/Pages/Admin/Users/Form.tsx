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
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { User } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import React, { FormEventHandler } from "react";
import { toast } from "react-toastify";

type Props = { user?: User };

const UserForm = ({ user }: Props) => {
    const { data, setData, patch, post, errors, clearErrors, processing } =
        useForm({
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            email: user?.email || "",
            role: user?.role || "client",
        });

    console.log(errors);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (user) {
            patch(route("users.update", { user }), {
                onError: () =>
                    toast.error("Nie udało się zaktualizować użytkownika"),
            });
        } else {
            post(route("users.store"), {
                onError: () => toast.error("Nie udało się dodać użytkownika"),
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
                    <Label htmlFor="first_name">Imię</Label>
                    <Input
                        type="text"
                        id="first_name"
                        value={data.first_name}
                        onChange={(e) => {
                            clearErrors("first_name");
                            setData("first_name", e.target.value);
                        }}
                        className={`${
                            errors.first_name ? "border-destructive" : ""
                        }`}
                    />
                    {errors.first_name && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.first_name}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="last_name">Nazwisko</Label>
                    <Input
                        type="text"
                        id="last_name"
                        value={data.last_name}
                        onChange={(e) => {
                            clearErrors("last_name");
                            setData("last_name", e.target.value);
                        }}
                        className={`${
                            errors.last_name ? "border-destructive" : ""
                        }`}
                    />
                    {errors.last_name && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.last_name}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        value={data.email}
                        onChange={(e) => {
                            clearErrors("email");
                            setData("email", e.target.value);
                        }}
                        className={`${
                            errors.email ? "border-destructive" : ""
                        }`}
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>
                <div>
                    <Label>
                        Rola
                        <Select
                            onValueChange={(val) =>
                                setData("role", val as "client" | "admin")
                            }
                            defaultValue={data.role}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Wybierz rolę" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="client">Klient</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </Label>
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
