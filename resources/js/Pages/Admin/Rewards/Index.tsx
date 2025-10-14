import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { Paginated, Reward } from "@/types";
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
import { Head, Link, router, usePage } from "@inertiajs/react";
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
    rewards: Paginated<Reward>;
    rowCount: number;
    page: number;
    sortBy: string;
    sortDesc: number;
    search: string;
};

const columns: ColumnDef<Reward>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting()}>
                Nazwa
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
        ),
        size: 200,
    },
    {
        accessorKey: "cost_points",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Koszt (pkt)
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
        size: 100,
    },
    {
        accessorKey: "type",
        header: "Typ",
        size: 100,
    },
    {
        accessorKey: "value",
        header: "Wartość",
        size: 100,
    },
    {
        accessorKey: "value_type",
        header: "Typ wartości",
        size: 100,
    },
    {
        accessorKey: "details",
        header: "Szczegóły",
        size: 200,
    },
    {
        accessorKey: "image",
        header: "Obraz",
        cell: ({ row }: any) =>
            row.original.image ? (
                <img
                    src={
                        row.original.image.startsWith("http")
                            ? row.original.image
                            : `/storage/${row.original.image}`
                    }
                    alt="Obraz"
                    className="max-h-12"
                />
            ) : null,
        size: 80,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isDeleting, setIsDeleting] = useState(false);
            const [modalOpen, setModalOpen] = useState(false);
            const reward = row.original;
            const deleteReward = () => {
                setIsDeleting(false);
                router.delete(route("rewards.destroy", { reward }), {
                    preserveScroll: true,
                    onError: () =>
                        toast.error("Nie udało się usunąć wybranej nagrody"),
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
                            <Button variant="ghost" className="w-8 h-8 p-0">
                                <span className="sr-only">Otwórz menu</span>
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route("rewards.edit", {
                                        reward,
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
                                Czy jesteś pewny że chcesz usunąć nagrodę:{" "}
                                {reward.name}
                            </DialogTitle>
                            <DialogDescription>
                                Tej czynności nie można cofnąć. Czy na pewno
                                chcesz trwale usunąć tę nagrodę?
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
                                onClick={deleteReward}
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

const RewardsIndex = ({
    rewards,
    rowCount,
    page,
    sortBy,
    sortDesc,
    search,
}: Props) => {
    const [searchValue, setSearchValue] = useState<string>(search || "");

    useEffect(() => {
        if ((!search && !searchValue) || search === searchValue) return;
        const timeout = setTimeout(() => {
            router.get(
                route("rewards.index"),
                { search: searchValue },
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
                        Nagrody
                    </h2>
                    <div className="flex items-center gap-1 ml-8 min-w-80">
                        <div className="relative">
                            <FloatingInput
                                id="search"
                                className="m-0 w-70"
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                }}
                            />
                            <FloatingLabel htmlFor="search">
                                Nazwa
                            </FloatingLabel>
                        </div>
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
                    <Button className="ml-auto" asChild>
                        <Link href={route("rewards.create")}>
                            <Plus /> Dodaj
                        </Link>
                    </Button>
                </>
            }
        >
            <Head title="Nagrody" />
            <DataTable
                columns={columns}
                data={rewards.data}
                rowCount={rowCount}
                page={page}
                sortBy={sortBy}
                sortDesc={sortDesc}
                routeName="rewards.index"
            />
        </AuthenticatedLayout>
    );
};

export default RewardsIndex;
