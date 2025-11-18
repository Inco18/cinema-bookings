import { Button } from "@/Components/ui/button";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    return (
        <GuestLayout>
            <Head title="Weryfikacja email" />

            <div className="mb-4 text-sm text-gray-600">
                Dziękujemy za zapisanie się! Zanim zaczniesz, czy możesz
                zweryfikować swój adres e-mail, klikając na link, który właśnie
                do Ciebie wysłaliśmy? Jeśli nie otrzymałeś wiadomości e-mail,
                chętnie wyślemy Ci inną.
            </div>

            {status === "verification-link-sent" && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    Nowy link weryfikacyjny został wysłany na adres e-mail
                    podany podczas rejestracji.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="flex items-center justify-between mt-4">
                    <Button disabled={processing}>
                        Ponownie wyślij email weryfikacyjny
                    </Button>

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="text-sm text-gray-600 underline rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Wyloguj się
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
