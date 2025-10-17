import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { Paginated, PointsHistory } from "@/types";
import { useEffect, useState } from "react";
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
import { Head, Link, router } from "@inertiajs/react";
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
import { FloatingInput, FloatingLabel } from "@/Components/ui/floating-input";

type Props = {
    pointsHistory: Paginated<PointsHistory>;
    rowCount: number;
    page: number;
    sortBy: string;
    sortDesc: number;
    userSearch: string;
    descriptionSearch: string;
};

const columns: ColumnDef<PointsHistory>[] = [
    {
        accessorKey: "user.first_name",
        header: "Imię użytkownika",
        size: 100,
    },
    {
        accessorKey: "user.last_name",
        header: "Nazwisko użytkownika",
        size: 100,
    },
    {
        accessorKey: "points_change",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Zmiana punktów
                    {column.getIsSorted() === "asc" && (
                        <ArrowDown className="w-4 h-4 ml-2" />
                    )}
                    {column.getIsSorted() === "desc" && (
                        <ArrowUp className="w-4 h-4 ml-2" />
                    )}
                    {!column.getIsSorted() && (
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    )}
                </Button>
            );
        },
        cell: ({ row }) => {
            const pointsHistory = row.original;
            const isPositive = pointsHistory.points_change > 0;
            return (
                <span
                    className={`font-semibold ${
                        isPositive ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {isPositive ? "+" : ""}
                    {pointsHistory.points_change}
                </span>
            );
        },
        size: 120,
    },
    {
        accessorKey: "description",
        header: "Opis",
        size: 200,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Data utworzenia
                    {column.getIsSorted() === "asc" && (
                        <ArrowDown className="w-4 h-4 ml-2" />
                    )}
                    {column.getIsSorted() === "desc" && (
                        <ArrowUp className="w-4 h-4 ml-2" />
                    )}
                    {!column.getIsSorted() && (
                        <ArrowUpDown className="w-4 h-4 ml-2" />
                    )}
                </Button>
            );
        },
        cell: ({ row }) => {
            const pointsHistory = row.original;
            return new Date(pointsHistory.created_at).toLocaleString("pl-PL");
        },
        size: 150,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isDeleting, setIsDeleting] = useState(false);
            const [modalOpen, setModalOpen] = useState(false);
            const pointsHistory = row.original;
            const deletePointsHistory = () => {
                setIsDeleting(false);
                router.delete(
                    route("pointsHistory.destroy", { pointsHistory }),
                    {
                        preserveScroll: true,
                        onError: () =>
                            toast.error(
                                "Nie udało się usunąć wybranego wpisu historii punktów"
                            ),
                        onFinish: () => {
                            setIsDeleting(false);
                            setModalOpen(false);
                        },
                    }
                );
            };

            return (
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-8 h-8 p-0">
                                <span className="sr-only">Otwórz menu</span>
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route("pointsHistory.edit", {
                                        pointsHistory,
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
                                Czy jesteś pewny że chcesz usunąć wpis historii
                                punktów?
                            </DialogTitle>
                            <DialogDescription>
                                Tej czynności nie można cofnąć. Czy na pewno
                                chcesz trwale usunąć ten wpis?
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
                                onClick={deletePointsHistory}
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
            myCustomClass: "py-0 text-right",
        },
    },
];

const PointsHistoryIndex = ({
    pointsHistory,
    rowCount,
    page,
    sortBy,
    sortDesc,
    userSearch,
    descriptionSearch,
}: Props) => {
    const [userSearchValue, setUserSearchValue] = useState<string>(
        userSearch || ""
    );
    const [descriptionSearchValue, setDescriptionSearchValue] =
        useState<string>(descriptionSearch || "");

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route("pointsHistory.index"),
                {
                    userSearch: userSearchValue,
                    descriptionSearch: descriptionSearchValue,
                },
                { preserveState: true }
            );
        }, 500);
        return () => clearTimeout(timeout);
    }, [userSearchValue, descriptionSearchValue]);

    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Historia punktów
                    </h2>
                    <div className="flex items-center gap-1 ml-8 min-w-80">
                        <div className="relative">
                            <FloatingInput
                                id="userSearch"
                                className="m-0 w-70"
                                value={userSearchValue}
                                onChange={(e) => {
                                    setUserSearchValue(e.target.value);
                                }}
                            />
                            <FloatingLabel htmlFor="userSearch">
                                Imię lub nazwisko użytkownika
                            </FloatingLabel>
                        </div>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className={`aspect-square ${
                                userSearchValue ? "visible" : "invisible"
                            }`}
                            onClick={() => setUserSearchValue("")}
                        >
                            <X />
                        </Button>
                        <div className="relative">
                            <FloatingInput
                                id="descriptionSearch"
                                className="m-0 w-70"
                                value={descriptionSearchValue}
                                onChange={(e) => {
                                    setDescriptionSearchValue(e.target.value);
                                }}
                            />
                            <FloatingLabel htmlFor="descriptionSearch">
                                Opis
                            </FloatingLabel>
                        </div>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className={`aspect-square ${
                                descriptionSearchValue ? "visible" : "invisible"
                            }`}
                            onClick={() => setDescriptionSearchValue("")}
                        >
                            <X />
                        </Button>
                    </div>
                    <Button className="ml-auto" asChild>
                        <Link href={route("pointsHistory.create")}>
                            <Plus /> Dodaj
                        </Link>
                    </Button>
                </>
            }
        >
            <Head title="Historia punktów" />
            <DataTable
                columns={columns}
                data={pointsHistory.data}
                rowCount={rowCount}
                page={page}
                sortBy={sortBy}
                sortDesc={sortDesc}
                routeName="pointsHistory.index"
            />
        </AuthenticatedLayout>
    );
};

export default PointsHistoryIndex;
