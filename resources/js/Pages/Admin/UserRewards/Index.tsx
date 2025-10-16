import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { Paginated, Reward, UserReward } from "@/types";
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
import { RewardType, UserRewardStatus } from "@/types/enums";
import { UserRewardRequest } from "@/schema";
import { MultiSelect } from "@/Components/ui/multiple-select";

type Props = {
    userRewards: Paginated<UserReward>;
    rowCount: number;
    page: number;
    sortBy: string;
    sortDesc: number;
    userSearch: string;
    rewardSearch: string;
    statusFilter: string[];
};

const columns: ColumnDef<UserReward>[] = [
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
        accessorKey: "image",
        header: "Obraz",
        cell: ({ row }: any) => {
            const userReward = row.original;
            return (
                <>
                    {userReward.reward.type !== RewardType.DISCOUNT && (
                        <div className="w-12 h-12 shrink-0">
                            <img
                                src={
                                    userReward.reward?.image
                                        ? `/storage/${userReward.reward?.image}`
                                        : "/reward-placeholder.jpg"
                                }
                                className="rounded-full"
                            />
                        </div>
                    )}
                    {userReward.reward.type === RewardType.DISCOUNT && (
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-background shrink-0">
                            <span className="text-sm font-bold">
                                {new Intl.NumberFormat("pl-PL", {
                                    maximumFractionDigits: 2,
                                }).format(userReward.reward.value)}
                                {userReward.reward.value_type === "percent"
                                    ? " %"
                                    : " zł"}
                            </span>
                        </div>
                    )}
                </>
            );
        },
        meta: {
            myCustomClass: "py-2",
        },
        size: 80,
    },
    {
        accessorKey: "reward.name",
        header: "Nazwa nagrody",
        size: 150,
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Status
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
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isDeleting, setIsDeleting] = useState(false);
            const [modalOpen, setModalOpen] = useState(false);
            const userReward = row.original;
            const deleteReward = () => {
                setIsDeleting(false);
                router.delete(route("userRewards.destroy", { userReward }), {
                    preserveScroll: true,
                    onError: () =>
                        toast.error(
                            "Nie udało się usunąć wybranej nagrody użytkownika"
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
                            <Button variant="ghost" className="w-8 h-8 p-0">
                                <span className="sr-only">Otwórz menu</span>
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route("userRewards.edit", {
                                        userReward,
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
                                Czy jesteś pewny że chcesz usunąć nagrodę
                                użytkownika: {userReward.reward?.name}
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
            myCustomClass: "py-0 text-right",
        },
    },
];

const UserRewardsIndex = ({
    userRewards,
    rowCount,
    page,
    sortBy,
    sortDesc,
    userSearch,
    rewardSearch,
    statusFilter,
}: Props) => {
    const [userSearchValue, setUserSearchValue] = useState<string>(
        userSearch || ""
    );
    const [rewardSearchValue, setRewardSearchValue] = useState<string>(
        rewardSearch || ""
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route("userRewards.index"),
                {
                    userSearch: userSearchValue,
                    rewardSearch: rewardSearchValue,
                },
                { preserveState: true }
            );
        }, 500);
        return () => clearTimeout(timeout);
    }, [userSearchValue, rewardSearchValue]);

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
                                id="rewardSearch"
                                className="m-0 w-70"
                                value={rewardSearchValue}
                                onChange={(e) => {
                                    setRewardSearchValue(e.target.value);
                                }}
                            />
                            <FloatingLabel htmlFor="rewardSearch">
                                Nazwa nagrody
                            </FloatingLabel>
                        </div>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className={`aspect-square ${
                                rewardSearchValue ? "visible" : "invisible"
                            }`}
                            onClick={() => setRewardSearchValue("")}
                        >
                            <X />
                        </Button>
                        <div>
                            <MultiSelect
                                onValueChange={(value) =>
                                    router.get(
                                        route("userRewards.index", {
                                            userSearch: userSearchValue || null,
                                            rewardSearch:
                                                rewardSearchValue || null,
                                            statusFilter: value || null,
                                        }),
                                        {},
                                        { preserveState: true }
                                    )
                                }
                                value={statusFilter || []}
                                placeholder="Status"
                                variant="inverted"
                                options={Object.values(UserRewardStatus).map(
                                    (status) => {
                                        return {
                                            label: status,
                                            value: status,
                                        };
                                    }
                                )}
                            />
                        </div>
                    </div>
                    <Button className="ml-auto" asChild>
                        <Link href={route("userRewards.create")}>
                            <Plus /> Dodaj
                        </Link>
                    </Button>
                </>
            }
        >
            <Head title="Nagrody użytkowników" />
            <DataTable
                columns={columns}
                data={userRewards.data}
                rowCount={rowCount}
                page={page}
                sortBy={sortBy}
                sortDesc={sortDesc}
                routeName="userRewards.index"
            />
        </AuthenticatedLayout>
    );
};

export default UserRewardsIndex;
