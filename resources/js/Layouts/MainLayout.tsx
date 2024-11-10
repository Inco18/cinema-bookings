import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Separator } from "@/Components/ui/separator";
import { hasRole } from "@/lib/utils";
import { RoleType } from "@/types/enums";
import { Link, usePage } from "@inertiajs/react";
import { UserRound } from "lucide-react";
import { PropsWithChildren, ReactNode, useState } from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function MainLayout({
    children,
    header,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    console.log(user);

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white">
                    <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex shrink-0 items-center">
                                    <Link href="/">
                                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                    </Link>
                                </div>

                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <Link
                                        href={route("main.showings")}
                                        className={`inline-flex items-center hover:text-indigo-700 transition ${
                                            route().current("main.showings")
                                                ? "text-indigo-700 font-semibold"
                                                : ""
                                        }`}
                                    >
                                        Repertuar
                                    </Link>
                                </div>
                            </div>

                            {user ? (
                                <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                    <div className="relative ms-3">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-indigo-700 focus:outline-none"
                                                    >
                                                        {user.first_name}{" "}
                                                        {user.last_name}
                                                        <svg
                                                            className="-me-0.5 ms-2 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                {hasRole(
                                                    user,
                                                    RoleType.ADMIN
                                                ) && (
                                                    <Dropdown.Link
                                                        href={route(
                                                            "dashboard"
                                                        )}
                                                    >
                                                        Panel kontrolny
                                                    </Dropdown.Link>
                                                )}
                                                <Dropdown.Link
                                                    href={route("profile.edit")}
                                                >
                                                    Profil
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route("logout")}
                                                    method="post"
                                                    as="button"
                                                >
                                                    Wyloguj się
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
                            ) : (
                                <div className="hidden sm:block sm:items-center">
                                    <div className="flex h-max sm:mt-3">
                                        <Link
                                            href={route("login")}
                                            className="flex items-center gap-3 rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-indigo-700"
                                        >
                                            <UserRound className="rounded-full" />
                                            Zaloguj się
                                        </Link>
                                        <Separator
                                            orientation="vertical"
                                            className="h-auto"
                                        />
                                        <Link
                                            href={route("register")}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-indigo-700"
                                        >
                                            Zarejestruj się
                                        </Link>
                                    </div>
                                </div>
                            )}

                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState
                                        )
                                    }
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            className={
                                                !showingNavigationDropdown
                                                    ? "inline-flex"
                                                    : "hidden"
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={
                                                showingNavigationDropdown
                                                    ? "inline-flex"
                                                    : "hidden"
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            (showingNavigationDropdown ? "block" : "hidden") +
                            " sm:hidden"
                        }
                    >
                        <div className="space-y-1 pb-3 pt-2">
                            <ResponsiveNavLink
                                href={route("main.showings")}
                                active={route().current("main.showings")}
                            >
                                Repertuar
                            </ResponsiveNavLink>
                        </div>

                        {user ? (
                            <div className="border-t border-gray-200 pb-1 pt-4">
                                <div className="px-4">
                                    <div className="text-base font-medium text-gray-800">
                                        {user.first_name} {user.last_name}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {user.email}
                                    </div>
                                </div>

                                <div className="mt-3 space-y-1">
                                    {hasRole(user, RoleType.ADMIN) && (
                                        <ResponsiveNavLink
                                            href={route("dashboard")}
                                        >
                                            Panel kontrolny
                                        </ResponsiveNavLink>
                                    )}
                                    <ResponsiveNavLink
                                        href={route("profile.edit")}
                                    >
                                        Profil
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        method="post"
                                        href={route("logout")}
                                        as="button"
                                    >
                                        Wyloguj się
                                    </ResponsiveNavLink>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 text-base font-medium transition duration-150 ease-in-out focus:outline-none`}
                                >
                                    Zaloguj się
                                </Link>
                                <Separator
                                    orientation="vertical"
                                    className="h-auto"
                                />
                                <Link
                                    href={route("register")}
                                    className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 text-base font-medium transition duration-150 ease-in-out focus:outline-none`}
                                >
                                    Zarejestruj się
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {header && (
                    <header className="bg-white border-t border-gray-100 shadow">
                        <div className="mx-auto max-w-screen-2xl px-4 py-3 sm:px-6 lg:px-8 flex items-center">
                            {header}
                        </div>
                    </header>
                )}
                <main>{children}</main>
            </div>
            <ToastContainer theme="colored" />
        </>
    );
}
