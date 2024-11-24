import { z } from "zod";
import { HallType, RoleType } from "./types/enums";
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
});
