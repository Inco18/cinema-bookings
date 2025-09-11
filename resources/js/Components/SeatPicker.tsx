import { cn } from "@/lib/utils";
import { Booking, Hall, Seat } from "@/types";
import { SeatType } from "@/types/enums";
import { Accessibility } from "lucide-react";
import React, { Dispatch, SetStateAction, useMemo } from "react";
import { Separator } from "./ui/separator";

type Props = {
    hall: Hall;
    showingBookings: Booking[];
    selectedSeats: number[];
    setSelectedSeats: Dispatch<SetStateAction<number[]>>;
};

export default function SeatPicker({
    hall,
    showingBookings,
    selectedSeats,
    setSelectedSeats,
}: Props) {
    const hallSize = hall.seats?.reduce(
        (prev, cur, i) => {
            return {
                rows: cur.row > prev.rows ? cur.row : prev.rows,
                cols: cur.column > prev.cols ? cur.column : prev.cols,
            };
        },
        { rows: hall.seats[0].row, cols: hall.seats[0].column }
    );
    const grid = Array.from({ length: hallSize?.rows! }, () =>
        Array(hallSize?.cols).fill(null)
    );

    useMemo(() => {
        hall.seats?.forEach((seat) => {
            grid[seat.row - 1][seat.column - 1] = seat;
        });
    }, [hall.seats, grid]);

    const bookingsSeats = useMemo(
        () =>
            showingBookings
                .map((showing) => {
                    return showing.seats?.map((seat) => seat.id);
                })
                .flat()
                .filter((seat) => !selectedSeats.includes(seat!)),
        [showingBookings]
    );

    const rows = grid.map((row) => row[0].row);

    const flatGrid = grid.flat();

    return (
        <div className="bg-background mt-4 shadow-sm lg:rounded-lg py-6 px-6 lg:px-12 lg:pl-4">
            <div className="overflow-x-auto scrollbar pb-1">
                <div className="w-fit m-auto relative">
                    <div className="flex flex-col items-center justify-center overflow-visible gap-2 mx-auto w-max pl-10">
                        <div className="bg-gray-400 rounded-sm w-[400px] md:w-[500px] h-3"></div>
                        <p className="text-sm font-bold w-full flex justify-center">
                            EKRAN
                        </p>
                    </div>
                    <div className="absolute left-0 -bottom-[2px] md:bottom-[2px] flex flex-col md:gap-2 text-gray-500">
                        {rows.map((row) => (
                            <div
                                className="flex flex-row items-center gap-1 text-xs w-8 justify-between"
                                key={row}
                            >
                                <p className="flex-1 text-right">{row}</p>
                                <div className="bg-gray-500 w-4 h-1 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                    <div
                        style={{
                            gridTemplateColumns: `repeat(${hallSize?.cols}, 1fr`,
                        }}
                        className={`grid gap-1 w-fit m-auto mt-10 relative pl-10`}
                    >
                        {flatGrid.flat().map((seat: Seat | null, index) => {
                            if (!seat)
                                return (
                                    <div
                                        key={index}
                                        className="w-3 h-3 md:w-5 md:h-5"
                                    ></div>
                                );
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        if (
                                            bookingsSeats.includes(seat.id) &&
                                            !selectedSeats.includes(seat.id)
                                        )
                                            return;

                                        setSelectedSeats((prev) => {
                                            if (prev.includes(seat.id)) {
                                                return prev.filter((val) => {
                                                    if (
                                                        seat.type ===
                                                        SeatType.WIDE_TO_LEFT
                                                    ) {
                                                        return (
                                                            val !== seat.id &&
                                                            val !==
                                                                flatGrid[
                                                                    index - 1
                                                                ].id
                                                        );
                                                    } else if (
                                                        seat.type ===
                                                        SeatType.WIDE_TO_RIGHT
                                                    ) {
                                                        return (
                                                            val !== seat.id &&
                                                            val !==
                                                                flatGrid[
                                                                    index + 1
                                                                ].id
                                                        );
                                                    } else {
                                                        return val !== seat.id;
                                                    }
                                                });
                                            } else {
                                                if (
                                                    seat.type ===
                                                    SeatType.WIDE_TO_LEFT
                                                ) {
                                                    return [
                                                        ...prev,
                                                        flatGrid[index - 1].id,
                                                        seat.id,
                                                    ];
                                                } else if (
                                                    seat.type ===
                                                    SeatType.WIDE_TO_RIGHT
                                                ) {
                                                    return [
                                                        ...prev,
                                                        seat.id,
                                                        flatGrid[index + 1].id,
                                                    ];
                                                } else {
                                                    return [...prev, seat.id];
                                                }
                                            }
                                        });
                                    }}
                                    className={cn(
                                        "relative w-3 h-3 md:w-5 md:h-5 cursor-pointer flex items-center justify-center text-xs text-primary-foreground rounded-t-md",
                                        bookingsSeats.includes(seat.id) &&
                                            !selectedSeats.includes(seat.id)
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-indigo-700",
                                        {
                                            "!bg-red-600 after:!bg-red-600":
                                                selectedSeats.includes(seat.id),
                                            "wideToRight after:bg-indigo-700 !rounded-r-none":
                                                seat.type ===
                                                SeatType.WIDE_TO_RIGHT,
                                            "wideToLeft after:bg-indigo-700 !rounded-l-none":
                                                seat.type ===
                                                SeatType.WIDE_TO_LEFT,
                                        }
                                    )}
                                >
                                    {selectedSeats.includes(seat.id) &&
                                        seat.number}
                                    {seat.type === SeatType.DISABLED &&
                                        !selectedSeats.includes(seat.id) && (
                                            <Accessibility size={15} />
                                        )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Separator className="my-5" />
            <div>
                <h2 className="font-semibold text-xl mb-2">Legenda</h2>
                <div className="flex items-center gap-4 text-sm md:text-base">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-700 w-4 h-4 md:w-6 md:h-6 rounded-full"></div>
                        <p>Wolne</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-gray-400 w-4 h-4 md:w-6 md:h-6 rounded-full"></div>
                        <p>Zajęte</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-red-600 w-4 h-4 md:w-6 md:h-6 rounded-full"></div>
                        <p>Wybrane</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
