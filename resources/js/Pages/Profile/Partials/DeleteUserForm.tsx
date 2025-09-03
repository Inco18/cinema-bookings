import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";

export default function DeleteUserForm({
    className = "",
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Usuń konto
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Po usunięciu konta wszystkie jego zasoby i dane zostaną
                    trwale usunięte. Przed usunięciem konta pobierz wszelkie
                    dane lub informacje, które chcesz zachować.
                </p>
            </header>

            <Button variant={"destructive"} onClick={confirmUserDeletion}>
                USUŃ KONTO
            </Button>

            <Dialog
                open={confirmingUserDeletion}
                onOpenChange={setConfirmingUserDeletion}
            >
                <DialogContent>
                    <form onSubmit={deleteUser} className="">
                        <h2 className="text-lg font-medium text-gray-900">
                            Czy na pewno chcesz usunąć swoje konto?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Po usunięciu konta wszystkie jego zasoby i dane
                            zostaną trwale usunięte. Wprowadź hasło, aby
                            potwierdzić, że chcesz trwale usunąć swoje konto.
                        </p>

                        <div className="mt-6">
                            <Label htmlFor="password" className="sr-only">
                                Hasło
                            </Label>

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="mt-1 block w-3/4"
                                autofocus
                                placeholder="Hasło"
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button variant={"outline"} onClick={closeModal} type="button">
                                Anuluj
                            </Button>

                            <Button
                                variant={"destructive"}
                                className="ms-3"
                                disabled={processing}
                            >
                                USUŃ KONTO
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}
