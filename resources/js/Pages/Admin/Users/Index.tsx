import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Paginated, Role, User } from "@/types";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../../../Components/DataTable";
import { Button } from "@/Components/ui/button";
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    MoreVertical,
    Plus,
    X,
} from "lucide-react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { toast } from "react-toastify";
import { translatedRoles } from "@/lib/utils";
import { MultiSelect } from "@/Components/ui/multiple-select";
import { RoleType } from "@/types/enums";

type Props = {
    users: Paginated<User>;
    rowCount: number;
    page: number;
    sortBy: string;
    sortDesc: number;
    search: string;
    rolesFilter: RoleType[];
};

const columns: ColumnDef<User>[] = [
    {
        accessorKey: "first_name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Imię
                    {column.getIsSorted() === "asc" && (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                    {column.getIsSorted() === "desc" && (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    )}
                    {!column.getIsSorted() && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
        size: 20,
    },
    {
        accessorKey: "last_name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Nazwisko
                    {column.getIsSorted() === "asc" && (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                    {column.getIsSorted() === "desc" && (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    )}
                    {!column.getIsSorted() && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
        size: 250,
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Email
                    {column.getIsSorted() === "asc" && (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                    {column.getIsSorted() === "desc" && (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    )}
                    {!column.getIsSorted() && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
        sortDescFirst: false,
        maxSize: 200,
    },
    {
        accessorKey: "roles",
        header: "Role",
        cell: ({ row }) => {
            return (row.getValue("roles") as Role[])
                .map((value) => translatedRoles[value.name])
                .join(", ");
        },
        maxSize: 100,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isDeleting, setIsDeleting] = useState(false);
            const [modalOpen, setModalOpen] = useState(false);
            const user = row.original;
            const deleteUser = () => {
                setIsDeleting(true);
                router.delete(route("users.destroy", { user }), {
                    preserveScroll: true,
                    onSuccess: () =>
                        toast.success("Wybrany użytkownik został usunięty"),
                    onError: () =>
                        toast.error(
                            "Nie udało się usunąć wybranego użytkownika"
                        ),
                    onFinish: () => {
                        setIsDeleting(false);
                        setModalOpen(false);
                    },
                });
            };

            return (
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Otwórz menu</span>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route("users.edit", {
                                        user,
                                        ...route().queryParams,
                                    })}
                                >
                                    Edytuj
                                </Link>
                            </DropdownMenuItem>
                            <DialogTrigger asChild>
                                <DropdownMenuItem>Usuń</DropdownMenuItem>
                            </DialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Czy jesteś pewny że chcesz usunąć użytkonika:{" "}
                                {user.first_name} {user.last_name}
                            </DialogTitle>
                            <DialogDescription>
                                Tej czynności nie można cofnąć. Czy na pewno
                                chcesz trwale usunąć tego użytkownika?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Anuluj
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                variant={"destructive"}
                                onClick={deleteUser}
                                disabled={isDeleting}
                            >
                                Usuń
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );
        },
        size: 50,
        meta: {
            myCustomClass: "py-0",
        },
    },
];

const UsersIndex = ({
    users,
    rowCount,
    page,
    sortBy,
    sortDesc,
    search,
    rolesFilter,
}: Props) => {
    const [searchValue, setSearchValue] = useState<string>(search || "");
    const { flash }: any = usePage().props;

    useEffect(() => {
        if (flash.message) {
            if (flash.type === "success") toast.success(flash.message);
        }
    }, []);

    useEffect(() => {
        if ((!search && !searchValue) || search === searchValue) return;
        const timeout = setTimeout(() => {
            router.get(
                route("users.index", {
                    search: searchValue || null,
                }),
                {},
                { preserveState: true }
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchValue]);

    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Użytkownicy
                    </h2>
                    <div className="flex items-center ml-8 min-w-80 gap-1">
                        <Input
                            placeholder="Wyszukaj imię, nazwisko lub email..."
                            className="max-w-sm m-0 w-full"
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                            }}
                        />
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className={`aspect-square ${
                                searchValue ? "visible" : "invisible"
                            }`}
                            onClick={() => setSearchValue("")}
                        >
                            <X />
                        </Button>
                    </div>
                    <div className="ml-1">
                        <MultiSelect
                            onValueChange={(value) =>
                                router.get(
                                    route("users.index", {
                                        roles: value || null,
                                    }),
                                    {},
                                    { preserveState: true }
                                )
                            }
                            defaultValue={rolesFilter || []}
                            placeholder="Filtruj wg. ról"
                            variant="inverted"
                            options={Object.values(RoleType).map((role) => {
                                return {
                                    label: translatedRoles[role],
                                    value: role,
                                };
                            })}
                        />
                    </div>
                    <Button className="ml-auto" asChild>
                        <Link href={route("users.create")}>
                            <Plus /> Dodaj
                        </Link>
                    </Button>
                </>
            }
        >
            <Head title="Użytkownicy" />
            <DataTable
                columns={columns}
                data={users.data}
                rowCount={rowCount}
                page={page}
                sortBy={sortBy}
                sortDesc={sortDesc}
                routeName="users.index"
            />
        </AuthenticatedLayout>
    );
};

export default UsersIndex;
