import { z } from "zod";
import {
    BookingStatus,
    HallType,
    RoleType,
    SeatType,
    ShowingType,
} from "./types/enums";
export const UserRequest = z.object({
    first_name: z
        .string()
        .min(1, { message: "To pole jest wymagane" })
        .regex(new RegExp(/^[\p{L}\s-]*$/u), {
            message: "To pole może składać się tylko z liter",
        })
        .max(255, { message: "Przekroczono maksymalną długość pola" }),
    last_name: z
        .string()
        .min(1, { message: "To pole jest wymagane" })
        .regex(new RegExp(/^[\p{L}\s-]*$/u), {
            message: "To pole może składać się tylko z liter",
        })
        .max(255, { message: "Przekroczono maksymalną długość pola" }),
    email: z
        .string()
        .min(1, { message: "To pole jest wymagane" })
        .email({ message: "Podaj poprawny adres email" })
        .max(255, { message: "Przekroczono maksymalną długość pola" }),
    roles: z
        .string()
        .array()
        .nonempty({ message: "Użytkownik musi posiadać przynajmniej 1 rolę" })
        .refine(
            (val) =>
                val.every((role) =>
                    Object.values(RoleType).includes(role as RoleType)
                ),
            { message: "Pole posiada niepoprawną wartość" }
        ),
});

const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
export const MovieRequest = z.object({
    title: z.string().min(1, { message: "To pole jest wymagane" }),
    director: z
        .string()
        .min(1, { message: "To pole jest wymagane" })
        .regex(new RegExp(/^[\p{L}\s-]*$/u), {
            message: "To pole może składać się tylko z liter",
        }),
    poster_image: z
        .any()
        .refine(
            (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file.type),
            "Wyślij poprawny obraz"
        )
        .optional()
        .nullable(),
    duration_seconds: z
        .number()
        .int({ message: "To pole może zawierać tylko liczby całkowite" })
        .min(0, { message: "To pole nie może być mniejsze niż 0" }),
    release_date: z.coerce.date({ message: "Podaj poprawną datę" }),
    age_rating: z
        .number()
        .int({ message: "To pole może zawierać tylko liczby całkowite" })
        .min(0, { message: "Podaj liczbę z zakresu 0-99" })
        .max(99, { message: "Podaj liczbę z zakresu 0-99" }),
    description: z.string().min(1, { message: "To pole jest wymagane" }),
});

export const GenreRequest = z.object({
    name: z.string().min(1, { message: "To pole jest wymagane" }),
});

export const HallRequest = z.object({
    number: z.coerce
        .number()
        .int({ message: "To pole może zawierać tylko liczby całkowite" })
        .min(1, { message: "To pole nie może być mniejsze niż 1" }),
    type: z.nativeEnum(HallType, { message: "Niedopuszczalna zawartość pola" }),
    planFile: z
        .any()
        .refine((file) => file.type === "text/plain", "Wyślij poprawny plik")
        .optional()
        .nullable(),
});

export const SeatRequest = z.object({
    row: z.coerce
        .number()
        .int({ message: "To pole może zawierać tylko liczby całkowite" })
        .min(1, { message: "To pole nie może być mniejsze niż 1" }),
    column: z.coerce
        .number()
        .int({ message: "To pole może zawierać tylko liczby całkowite" })
        .min(1, { message: "To pole nie może być mniejsze niż 1" }),
    number: z.coerce
        .number()
        .int({ message: "To pole może zawierać tylko liczby całkowite" })
        .min(1, { message: "To pole nie może być mniejsze niż 1" }),
    type: z.nativeEnum(SeatType, { message: "Niedopuszczalna zawartość pola" }),
});

export const ShowingRequest = z
    .object({
        start_time: z.coerce
            .date({ message: "Podaj poprawną datę" })
            .min(new Date(), { message: "Data nie może być w przeszłości" }),
        end_time: z.coerce.date({ message: "Podaj poprawną datę" }),
        speech_lang: z
            .string()
            .min(1, { message: "To pole jest wymagane" })
            .max(3, { message: "Kod języka nie może mieć więcej niż 3 znaki" }),
        dubbing_lang: z
            .string()
            .max(3, { message: "Kod języka nie może mieć więcej niż 3 znaki" }),
        subtitles_lang: z
            .string()
            .max(3, { message: "Kod języka nie może mieć więcej niż 3 znaki" }),
        type: z.nativeEnum(ShowingType, {
            message: "Niedopuszczalna zawartość pola",
        }),
    })
    .refine((data) => data.start_time < data.end_time, {
        message:
            "Data zakończenia nie może być wcześniejsza niż data rozpoczęcia",
        path: ["end_time"],
    });

export const BookingRequest = z.object({
    num_people: z.coerce
        .number()
        .int({ message: "To pole może zawierać tylko liczby całkowite" })
        .min(1, { message: "To pole nie może być mniejsze niż 1" }),
    price: z.coerce
        .number()
        .min(0, { message: "To pole nie może być mniejsze niż 0" }),
    status: z.nativeEnum(BookingStatus, {
        message: "Niedopuszczalna zawartość pola",
    }),
    first_name: z
        .string()
        .min(1, { message: "To pole jest wymagane" })
        .regex(new RegExp(/^[\p{L}\s-]*$/u), {
            message: "To pole może składać się tylko z liter",
        })
        .max(255, { message: "Przekroczono maksymalną długość pola" }),
    last_name: z
        .string()
        .min(1, { message: "To pole jest wymagane" })
        .regex(new RegExp(/^[\p{L}\s-]*$/u), {
            message: "To pole może składać się tylko z liter",
        })
        .max(255, { message: "Przekroczono maksymalną długość pola" }),
    email: z
        .string()
        .min(1, { message: "To pole jest wymagane" })
        .email({ message: "Podaj poprawny adres email" })
        .max(255, { message: "Przekroczono maksymalną długość pola" }),
});

export const MainBookingRequest = z.object({
    first_name: z
        .string()
        .min(1, { message: "To pole jest wymagane" })
        .regex(new RegExp(/^[\p{L}\s-]*$/u), {
            message: "To pole może składać się tylko z liter",
        })
        .max(255, { message: "Przekroczono maksymalną długość pola" }),
    last_name: z
        .string()
        .min(1, { message: "To pole jest wymagane" })
        .regex(new RegExp(/^[\p{L}\s-]*$/u), {
            message: "To pole może składać się tylko z liter",
        })
        .max(255, { message: "Przekroczono maksymalną długość pola" }),
    email: z
        .string()
        .min(1, { message: "To pole jest wymagane" })
        .email({ message: "Podaj poprawny adres email" })
        .max(255, { message: "Przekroczono maksymalną długość pola" }),
});

export const RewardRequest = z.object({
    name: z.string().min(1, { message: "To pole jest wymagane" }),
    cost_points: z
        .number()
        .int({ message: "To pole może zawierać tylko liczby całkowite" })
        .min(0, { message: "To pole nie może być mniejsze niż 0" }),
    type: z.string().min(1, { message: "To pole jest wymagane" }),
    value_type: z.string().min(1, { message: "To pole jest wymagane" }),
    image: z
        .any()
        .refine(
            (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file.type),
            "Wyślij poprawny obraz"
        )
        .optional()
        .nullable(),
    value: z
        .number()
        .min(0, { message: "To pole nie może być mniejsze niż 0" }),
});

export const UserRewardRequest = z.object({
    reward_id: z.coerce
        .number()
        .int({ message: "To pole może zawierać tylko liczby całkowite" })
        .min(1, { message: "To pole jest wymagane" }),
    user_id: z.coerce
        .number()
        .int({ message: "To pole może zawierać tylko liczby całkowite" })
        .min(1, { message: "To pole jest wymagane" }),
    status: z.string().min(1, { message: "To pole jest wymagane" }),
});

export const PointsHistoryRequest = z.object({
    user_id: z.coerce
        .number()
        .int({ message: "To pole może zawierać tylko liczby całkowite" })
        .min(1, { message: "To pole jest wymagane" }),
    booking_id: z.coerce
        .number()
        .int({ message: "To pole może zawierać tylko liczby całkowite" })
        .optional()
        .nullable(),
    user_reward_id: z.coerce
        .number()
        .int({ message: "To pole może zawierać tylko liczby całkowite" })
        .optional()
        .nullable(),
    points_change: z.coerce
        .number()
        .int({ message: "To pole może zawierać tylko liczby całkowite" }),
    description: z
        .string()
        .min(1, { message: "To pole jest wymagane" })
        .max(255, { message: "Przekroczono maksymalną długość pola" }),
});
