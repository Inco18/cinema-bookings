import { BookingStatus, RoleType } from "./enums";

export interface Booking {
    id: number;
    showing_id: number;
    user_id?: number;
    num_people: number;
    price: any;
    first_name: string;
    last_name: string;
    email: string;
    status: BookingStatus;
    created_at?: string;
    updated_at?: string;
    showing?: Showing;
    user?: User;
    seats?: Seat[];
}

export interface Genre {
    id: number;
    name: string;
}

export type Hall = {
    id: number;
    number: string;
    type: "normal" | "3D" | "IMAX" | "VIP";
    created_at?: string;
    updated_at?: string;
    seats?: Seat[];
    showings?: Showing[];
};

export interface Movie {
    id: number;
    title: string;
    director: string;
    duration_seconds: number;
    description: string;
    poster_image: string;
    release_date: string;
    age_rating: string;
    genre_id: number;
    genre?: Genre;
    showings?: Showing[];
    created_at?: string;
    updated_at?: string;
}

export type Seat = {
    id: number;
    hall_id: number;
    type: "normal" | "wide" | "disabled" | "vip";
    row: number;
    column: number;
    number: number;
    created_at?: string;
    updated_at?: string;
    hall?: Hall;
    bookings?: Booking[];
};

export type Showing = {
    id: number;
    movie_id: number;
    hall_id: number;
    start_time: string;
    end_time: string;
    speech_lang: string;
    dubbing_lang?: string;
    subtitles_lang?: string;
    type: string;
    created_at?: string;
    updated_at?: string;
    hall?: Hall;
    movie?: Movie;
    bookings?: Booking[];
};

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    roles?: Role[];
    email: string;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Role {
    id: number;
    name: RoleType;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface Paginated<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string;
        next: string;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        myCustomClass: string;
    }
}
