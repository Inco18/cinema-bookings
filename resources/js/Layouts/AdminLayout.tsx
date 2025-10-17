import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { buttonVariants } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { hasRole } from "@/lib/utils";
import { RoleType } from "@/types/enums";
import { Link, usePage } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function Admin({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const { flash }: any = usePage().props;
    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);
    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white border-b border-gray-100">
                    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex items-center shrink-0">
                                    <Link href="/">
                                        <ApplicationLogo className="block w-auto text-gray-800 fill-current h-9" />
                                    </Link>
                                </div>

                                <div className="hidden space-x-4 sm:-my-px sm:ms-10 sm:flex">
                                    {hasRole(user, RoleType.ADMIN) && (
                                        <NavLink
                                            href={route("dashboard")}
                                            active={route().current(
                                                "dashboard"
                                            )}
                                        >
                                            Panel kontrolny
                                        </NavLink>
                                    )}
                                    {hasRole(user, RoleType.ADMIN) && (
                                        <NavLink
                                            href={route("users.index")}
                                            active={route().current("users.*")}
                                        >
                                            Użytkownicy
                                        </NavLink>
                                    )}
                                    {hasRole(user, RoleType.ADMIN) && (
                                        <NavLink
                                            href={route("movies.index")}
                                            active={route().current("movies.*")}
                                        >
                                            Filmy
                                        </NavLink>
                                    )}
                                    {hasRole(user, RoleType.ADMIN) && (
                                        <NavLink
                                            href={route("genres.index")}
                                            active={route().current("genres.*")}
                                        >
                                            Gatunki
                                        </NavLink>
                                    )}
                                    {hasRole(user, RoleType.ADMIN) && (
                                        <NavLink
                                            href={route("halls.index")}
                                            active={route().current("halls.*")}
                                        >
                                            Sale
                                        </NavLink>
                                    )}
                                    {hasRole(user, RoleType.ADMIN) && (
                                        <NavLink
                                            href={route("seats.index")}
                                            active={route().current("seats.*")}
                                        >
                                            Siedzenia
                                        </NavLink>
                                    )}
                                    {hasRole(user, RoleType.ADMIN) && (
                                        <NavLink
                                            href={route("showings.index")}
                                            active={route().current(
                                                "showings.*"
                                            )}
                                        >
                                            Seanse
                                        </NavLink>
                                    )}
                                    {hasRole(user, RoleType.ADMIN) && (
                                        <NavLink
                                            href={route("bookings.index")}
                                            active={route().current(
                                                "bookings.*"
                                            )}
                                        >
                                            Rezerwacje
                                        </NavLink>
                                    )}
                                    {hasRole(user, RoleType.ADMIN) && (
                                        <NavLink
                                            href={route("rewards.index")}
                                            active={route().current(
                                                "rewards.*"
                                            )}
                                        >
                                            Nagrody
                                        </NavLink>
                                    )}
                                    {hasRole(user, RoleType.ADMIN) && (
                                        <NavLink
                                            href={route("userRewards.index")}
                                            active={route().current(
                                                "userRewards.*"
                                            )}
                                        >
                                            Nagrody użytkowników
                                        </NavLink>
                                    )}
                                    {hasRole(user, RoleType.ADMIN) && (
                                        <NavLink
                                            href={route("pointsHistory.index")}
                                            active={route().current(
                                                "pointsHistory.*"
                                            )}
                                        >
                                            Historia punktów
                                        </NavLink>
                                    )}
                                    {hasRole(user, RoleType.ADMIN) && (
                                        <NavLink
                                            href={route("prices.index")}
                                            active={route().current(
                                                "prices.*"
                                            )}
                                        >
                                            Cennik
                                        </NavLink>
                                    )}
                                </div>
                            </div>

                            <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                <div className="relative ms-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            className={
                                                buttonVariants({
                                                    variant: "ghost",
                                                }) + " text-foreground/60"
                                            }
                                        >
                                            {user.first_name} {user.last_name}
                                            <ChevronDown />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent
                                            className="origin-top-right"
                                            align="end"
                                            alignOffset={10}
                                        >
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={route("profile.edit")}
                                                    className="cursor-pointer"
                                                >
                                                    Profil
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                    className={
                                                        "cursor-pointer w-full"
                                                    }
                                                >
                                                    Wyloguj się
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <div className="flex items-center -me-2 sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState
                                        )
                                    }
                                    className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                                >
                                    <svg
                                        className="w-6 h-6"
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
                        <div className="pt-2 pb-3 space-y-1">
                            {hasRole(user, RoleType.ADMIN) && (
                                <ResponsiveNavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                >
                                    Panel kontrolny
                                </ResponsiveNavLink>
                            )}
                            {hasRole(user, RoleType.ADMIN) && (
                                <ResponsiveNavLink
                                    href={route("users.index")}
                                    active={route().current("users.*")}
                                >
                                    Użytkownicy
                                </ResponsiveNavLink>
                            )}
                            {hasRole(user, RoleType.ADMIN) && (
                                <ResponsiveNavLink
                                    href={route("movies.index")}
                                    active={route().current("movies.*")}
                                >
                                    Filmy
                                </ResponsiveNavLink>
                            )}
                            {hasRole(user, RoleType.ADMIN) && (
                                <ResponsiveNavLink
                                    href={route("genres.index")}
                                    active={route().current("genres.*")}
                                >
                                    Gatunki
                                </ResponsiveNavLink>
                            )}
                            {hasRole(user, RoleType.ADMIN) && (
                                <ResponsiveNavLink
                                    href={route("halls.index")}
                                    active={route().current("halls.*")}
                                >
                                    Sale
                                </ResponsiveNavLink>
                            )}
                            {hasRole(user, RoleType.ADMIN) && (
                                <ResponsiveNavLink
                                    href={route("seats.index")}
                                    active={route().current("seats.*")}
                                >
                                    Siedzenia
                                </ResponsiveNavLink>
                            )}
                            {hasRole(user, RoleType.ADMIN) && (
                                <ResponsiveNavLink
                                    href={route("showings.index")}
                                    active={route().current("showings.*")}
                                >
                                    Seanse
                                </ResponsiveNavLink>
                            )}
                            {hasRole(user, RoleType.ADMIN) && (
                                <ResponsiveNavLink
                                    href={route("bookings.index")}
                                    active={route().current("bookings.*")}
                                >
                                    Rezerwacje
                                </ResponsiveNavLink>
                            )}
                            {hasRole(user, RoleType.ADMIN) && (
                                <ResponsiveNavLink
                                    href={route("rewards.index")}
                                    active={route().current("rewards.*")}
                                >
                                    Nagrody
                                </ResponsiveNavLink>
                            )}
                            {hasRole(user, RoleType.ADMIN) && (
                                <ResponsiveNavLink
                                    href={route("userRewards.index")}
                                    active={route().current("userRewards.*")}
                                >
                                    Nagrody użytkowników
                                </ResponsiveNavLink>
                            )}
                            {hasRole(user, RoleType.ADMIN) && (
                                <ResponsiveNavLink
                                    href={route("pointsHistory.index")}
                                    active={route().current("pointsHistory.*")}
                                >
                                    Historia punktów
                                </ResponsiveNavLink>
                            )}
                            {hasRole(user, RoleType.ADMIN) && (
                                <ResponsiveNavLink
                                    href={route("prices.index")}
                                    active={route().current("prices.*")}
                                >
                                    Cennik
                                </ResponsiveNavLink>
                            )}
                        </div>

                        <div className="pt-4 pb-1 border-t border-gray-200">
                            <div className="px-4">
                                <div className="text-base font-medium text-gray-800">
                                    {user.first_name} {user.last_name}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {user.email}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route("profile.edit")}>
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
                    </div>
                </nav>

                {header && (
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-3 sm:px-6 lg:px-8 flex items-center">
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
