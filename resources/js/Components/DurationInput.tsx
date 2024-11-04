import React, { forwardRef, useEffect, useState } from "react";
import { Input } from "./ui/input";

type Props = {
    durationSeconds: number;
    onChange: (seconds: number) => void;
    className?: string;
    id?: string;
};

const DurationInput = forwardRef(
    ({ durationSeconds, onChange, className, id }: Props, ref) => {
        const [{ hours, minutes, seconds }, setValues] = useState({
            hours: Math.floor(durationSeconds / 3600),
            minutes: Math.floor((durationSeconds % 3600) / 60),
            seconds: Math.floor((durationSeconds % 3600) % 60),
        });

        useEffect(() => {
            onChange(hours * 3600 + minutes * 60 + seconds);
        }, [hours, minutes, seconds]);

        return (
            <div className="flex items-center w-full gap-5">
                <div className="flex flex-1 gap-1 items-center justify-center">
                    <Input
                        type="number"
                        //@ts-ignore
                        ref={ref}
                        id={id}
                        max={99}
                        value={hours}
                        className={className}
                        onChange={(e) => {
                            setValues((prev) => {
                                return {
                                    ...prev,
                                    hours: Number(e.target.value),
                                };
                            });
                        }}
                    />{" "}
                    h
                </div>
                <div className="flex flex-1 gap-1 items-center justify-center">
                    <Input
                        type="number"
                        min={0}
                        max={59}
                        value={minutes}
                        className={className}
                        onChange={(e) => {
                            setValues((prev) => {
                                return {
                                    ...prev,
                                    minutes: Number(e.target.value),
                                };
                            });
                        }}
                    />{" "}
                    m
                </div>
                <div className="flex flex-1 gap-1 items-center justify-center">
                    <Input
                        type="number"
                        min={0}
                        max={59}
                        value={seconds}
                        className={className}
                        onChange={(e) => {
                            setValues((prev) => {
                                return {
                                    ...prev,
                                    seconds: Number(e.target.value),
                                };
                            });
                        }}
                    />{" "}
                    s
                </div>
            </div>
        );
    }
);

export default DurationInput;
