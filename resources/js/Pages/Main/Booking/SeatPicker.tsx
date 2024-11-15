import { Booking, Hall, Seat } from "@/types";
import { SeatType } from "@/types/enums";
import { Accessibility } from "lucide-react";
import React, { Dispatch, SetStateAction, useMemo } from "react";

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
        let rowShift = grid.map((row, i) => 0);
        hall.seats?.forEach((seat) => {
            grid[seat.row - 1][seat.column - 1 - rowShift[seat.row - 1]] = seat;
            if (seat.type === SeatType.WIDE) {
                grid[seat.row - 1].splice(seat.column, 1);
                rowShift[seat.row - 1] = rowShift[seat.row - 1] + 1;
            }
        });
    }, [hall.seats, grid]);

    return (
        <div className="bg-background mt-4 shadow-sm lg:rounded-lg py-6 px-6 lg:px-12">
            <div className="overflow-x-auto scrollbar pb-1">
                <div className="w-fit m-auto">
                    <div className="flex flex-col items-center justify-center overflow-visible gap-2 mx-auto w-max">
                        <div className="bg-gray-400 rounded-sm w-[400px] md:w-[500px] h-3"></div>
                        <p className="text-sm font-bold w-full flex justify-center">
                            EKRAN
                        </p>
                    </div>
                    <div
                        style={{
                            gridTemplateColumns: `repeat(${hallSize?.cols}, 1fr`,
                        }}
                        className={`grid gap-1 w-fit m-auto`}
                    >
                        {grid.flat().map((seat: Seat | null, index) => {
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
                                    onClick={() =>
                                        setSelectedSeats((prev) => {
                                            if (prev.includes(seat.id)) {
                                                return prev.filter(
                                                    (val) => val !== seat.id
                                                );
                                            } else return [...prev, seat.id];
                                        })
                                    }
                                    className={`bg-indigo-700 ${
                                        selectedSeats.includes(seat.id)
                                            ? "bg-red-600"
                                            : ""
                                    } ${
                                        seat.type === SeatType.WIDE
                                            ? "w-7 md:!w-11 col-span-2"
                                            : ""
                                    } w-3 h-3 md:w-5 md:h-5 cursor-pointer flex items-center justify-center text-xs text-primary-foreground `}
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
        </div>
    );
}
