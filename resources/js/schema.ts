import { z } from "zod";
export const UpdateUserRequest = z.object({
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
    role: z.enum(["client", "admin"], {
        message: "To pole może mieć wartość: Klient lub Admin",
    }),
});
export const UpdateMovieRequest = z.object({
    title: z.string(),
    director: z.string(),
    genre_id: z.string(),
    poster_image: z.string().nullable().optional(),
    duration_seconds: z.number().int(),
    release_date: z.date(),
    age_rating: z.number().int(),
    description: z.string(),
});
