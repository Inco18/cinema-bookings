import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";

type Props = {
    durationSeconds: number;
    onChange: (seconds: number) => void;
};

const DurationInput = ({ durationSeconds, onChange }: Props) => {
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
                    min={0}
                    max={99}
                    value={hours}
                    onChange={(e) => {
                        setValues((prev) => {
                            return { ...prev, hours: Number(e.target.value) };
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
                    onChange={(e) => {
                        setValues((prev) => {
                            return { ...prev, minutes: Number(e.target.value) };
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
                    onChange={(e) => {
                        setValues((prev) => {
                            return { ...prev, seconds: Number(e.target.value) };
                        });
                    }}
                />{" "}
                s
            </div>
        </div>
    );
};

export default DurationInput;
