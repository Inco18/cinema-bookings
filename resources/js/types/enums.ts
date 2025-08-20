export enum HallType {
    NORMAL = "normal",
    THREE_D = "3D",
    IMAX = "IMAX",
    VIP = "VIP",
}
export enum PermissionType {
    USER_ACCESS = "user_access",
    USER_MANAGE = "user_manage",
    GENRE_ACCESS = "genre_access",
    GENRE_MANAGE = "genre_manage",
    MOVIE_ACCESS = "movie_access",
    MOVIE_MANAGE = "movie_manage",
    HALL_ACCESS = "hall_access",
    HALL_MANAGE = "hall_manage",
    SEAT_ACCESS = "seat_access",
    SEAT_MANAGE = "seat_manage",
    SHOWING_ACCESS = "showing_access",
    SHOWING_MANAGE = "showing_manage",
    BOOKING_ACCESS = "booking_access",
    BOOKING_MANAGE = "booking_manage",
}
export enum RoleType {
    ADMIN = "admin",
    WORKER = "worker",
    CLIENT = "client",
}
export enum SeatType {
    NORMAL = "standard",
    WIDE_TO_LEFT = "szerokie_do_lewej",
    WIDE_TO_RIGHT = "szerokie_do_prawej",
    DISABLED = "inwalidzi",
    VIP = "vip",
}

export enum ShowingType {
    TWO_D = "2d",
    THREE_D = "3d",
}

export enum BookingStatus {
    RESERVED = "zarezerwowany",
    FILLED = "wypełniony",
    PAID = "opłacony",
}

export enum TicketType {
    NORMAL = "normal",
    REDUCED = "reduced",
}
