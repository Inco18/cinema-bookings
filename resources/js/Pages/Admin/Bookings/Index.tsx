import AuthenticatedLayout from "@/Layouts/AdminLayout";
import { Seat, Paginated, Booking } from "@/types";
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
import { BookingStatus } from "@/types/enums";
import { Badge } from "@/Components/ui/badge";
import BookingsFilters from "./Filters";

type Props = {
    bookings: Paginated<Booking>;
    rowCount: number;
    page: number;
    sortBy: string;
    sortDesc: number;
    showingIdSearch: string;
    movieSearch: string;
    personSearch: string;
    hallSearch: string;
    statusFilter: BookingStatus[];
};

const columns: ColumnDef<Booking>[] = [
    {
        accessorKey: "showing.movie.title",
        header: "Film",
        size: 1500,
    },
    {
        id: "person",
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Osoba rezerwująca
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

        size: 700,
    },
    {
        accessorKey: "num_people",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    L. osób
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
        size: 100,
    },
    {
        accessorKey: "showing.hall.number",
        header: "Sala",
        size: 100,
    },
    {
        accessorKey: "seats",
        header: "Siedzenia (r/n)",
        cell: ({ row }) => {
            return (row.getValue("seats") as Seat[])
                .map((seat) => `${seat.row}/${seat.number}`)
                .join(", ");
        },
        size: 1000,
    },
    {
        accessorKey: "showing.start_time",
        header: "Data seansu",
        size: 700,
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Cena
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
        cell: ({ row }) => {
            return <div className="text-right">{row.getValue("price")} zł</div>;
        },
        size: 100,
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting()}>
                    Status
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
        cell: ({ row }) => {
            const booking = row.original;
            if (booking.status === BookingStatus.RESERVED)
                return (
                    <Badge className="bg-red-600 pointer-events-none">
                        {booking.status}
                    </Badge>
                );
            else if (booking.status === BookingStatus.FILLED)
                return (
                    <Badge className="bg-orange-600 pointer-events-none">
                        {booking.status}
                    </Badge>
                );
            else if (booking.status === BookingStatus.PAID)
                return (
                    <Badge className="bg-green-600 pointer-events-none">
                        {booking.status}
                    </Badge>
                );
            else
                return (
                    <Badge className="pointer-events-none">
                        {booking.status}
                    </Badge>
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
            const booking = row.original;
            const deleteBooking = () => {
                setIsDeleting(false);
                router.delete(route("bookings.destroy", { booking }), {
                    preserveScroll: true,
                    onSuccess: () =>
                        toast.success("Wybrana rezerwacja została usunięta"),
                    onError: () =>
                        toast.error("Nie udało się usunąć wybranej rezerwacji"),
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
                                    href={route("bookings.edit", {
                                        booking,
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
                                Czy jesteś pewny że chcesz usunąć rezerwację
                                osoby: {booking.first_name} {booking.last_name},
                                na film: {booking.showing?.movie?.title}?
                            </DialogTitle>
                            <DialogDescription>
                                Tej czynności nie można cofnąć. Czy na pewno
                                chcesz trwale usunąć tą rezerwację?
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
                                onClick={deleteBooking}
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

const SeatsIndex = ({
    bookings,
    rowCount,
    page,
    sortBy,
    sortDesc,
    showingIdSearch,
    movieSearch,
    personSearch,
    hallSearch,
    statusFilter,
}: Props) => {
    const { flash }: any = usePage().props;

    useEffect(() => {
        if (flash.message) {
            if (flash.type === "success") toast.success(flash.message);
        }
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Rezerwacje
                    </h2>
                    <BookingsFilters
                        statusFilter={statusFilter}
                        showingIdSearch={showingIdSearch}
                        movieSearch={movieSearch}
                        personSearch={personSearch}
                        hallSearch={hallSearch}
                    />
                    <Button className="ml-auto" asChild>
                        <Link href={route("bookings.create")}>
                            <Plus /> Dodaj
                        </Link>
                    </Button>
                </>
            }
        >
            <Head title="Rezerwacje" />
            <DataTable
                columns={columns}
                data={bookings.data}
                rowCount={rowCount}
                page={page}
                sortBy={sortBy}
                sortDesc={sortDesc}
                routeName="bookings.index"
            />
        </AuthenticatedLayout>
    );
};

export default SeatsIndex;
