export interface User {
    id: number;
    first_name: string;
    last_name: string;
    role: "admin" | "client";
    email: string;
    email_verified_at?: string;
}

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
}

export interface Genre {
    id: number;
    name: string;
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
