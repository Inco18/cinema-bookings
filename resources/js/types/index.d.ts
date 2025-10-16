import {
    BookingStatus,
    HallType,
    RewardType,
    RewardValueType,
    RoleType,
    SeatType,
    ShowingType,
    TicketType,
    UserRewardStatus,
} from "./enums";

export interface Booking {
    id: number;
    showing_id: number;
    user_id?: number;
    price: any;
    discounted_price?: any;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    status: BookingStatus;
    token: string;
    created_at?: string;
    updated_at?: string;
    showing?: Showing;
    user?: User;
    seats?: (Seat & {
        pivot: {
            booking_id: number;
            seat_id: number;
            price: number;
            type: TicketType;
        };
    })[];
    userRewards?: UserReward[];
}

export interface Genre {
    id: number;
    name: string;
}

export type Hall = {
    id: number;
    number: string;
    type: HallType;
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
    type: SeatType;
    row: number;
    column: number;
    number: number;
    created_at?: string;
    updated_at?: string;
    hall?: Hall;
    bookings?: (Booking & {
        pivot: {
            booking_id: number;
            seat_id: number;
            price: number;
            type: TicketType;
        };
    })[];
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
    type: ShowingType;
    created_at?: string;
    updated_at?: string;
    hall?: Hall;
    movie?: Movie;
    bookings?: Booking[];
};

export type PriceCamelCase = {
    id: number;
    ticketType: TicketType;
    basePrice: number;
    minPrice: number;
    maxPrice: number;
    description?: string;
};

export type PointsHistory = {
    id: number;
    user_id: number;
    booking_id?: number;
    user_reward_id?: number;
    points_change: number;
    description: string;
    created_at: string;
    updated_at: string;
    user?: User;
    booking?: Booking;
    userReward?: UserReward;
};

export type Reward = {
    id: number;
    name: string;
    cost_points: number;
    type: RewardType;
    value: number;
    value_type: RewardValueType;
    details: string;
    image?: string;
    created_at: string;
    updated_at: string;
    userRewards?: UserReward[];
};

export type UserReward = {
    id: number;
    user_id: number;
    reward_id: number;
    booking_id?: number;
    status: UserRewardStatus;
    created_at: string;
    updated_at: string;
    user?: User;
    reward?: Reward;
    pointsHistory?: PointsHistory;
    booking?: Booking;
};

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    roles?: Role[];
    email: string;
    points_number: number;
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
