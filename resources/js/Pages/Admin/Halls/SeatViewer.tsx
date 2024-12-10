import { Booking, Hall, Seat } from "@/types";
import { SeatType } from "@/types/enums";
import { Accessibility } from "lucide-react";
import React, { Dispatch, SetStateAction, useMemo } from "react";

type Props = {
    seats: Seat[];
};

export default function SeatViewer({ seats }: Props) {
    const hallSize = seats.reduce(
        (prev, cur, i) => {
            return {
                rows: cur.row > prev.rows ? cur.row : prev.rows,
                cols: cur.column > prev.cols ? cur.column : prev.cols,
            };
        },
        { rows: seats[0].row, cols: seats[0].column }
    );
    const grid = Array.from({ length: hallSize?.rows! }, () =>
        Array(hallSize?.cols).fill(null)
    );

    useMemo(() => {
        seats.forEach((seat) => {
            grid[seat.row - 1][seat.column - 1] = seat;
        });
    }, [seats, grid]);

    return (
        <div className="bg-background mt-2 shadow-sm lg:rounded-lg py-6 px-6 lg:px-12 border">
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
                        className={`grid gap-1 w-fit m-auto mt-10`}
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
                                    className={`bg-indigo-700 relative ${
                                        seat.type === SeatType.WIDE_TO_RIGHT
                                            ? "wideToRight after:bg-indigo-700"
                                            : ""
                                    } ${
                                        seat.type === SeatType.WIDE_TO_LEFT
                                            ? "wideToLeft after:bg-indigo-700"
                                            : ""
                                    } w-3 h-3 md:w-5 md:h-5 pointer-events-none flex items-center justify-center text-xs text-primary-foreground `}
                                >
                                    {seat.type !== SeatType.DISABLED &&
                                        seat.number}
                                    {seat.type === SeatType.DISABLED && (
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
