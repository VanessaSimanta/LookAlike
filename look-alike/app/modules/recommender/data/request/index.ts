import z from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const SRecommenderRequest = z
    .object({
        image_file: z
            .instanceof(File, { message: 'Gambar wajib diunggah' })
            .refine((file) => file.size <= MAX_FILE_SIZE, {
                message: 'Ukuran gambar maksimal 5 MB',
            })
            .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
                message: 'Format harus JPG, PNG, atau WEBP',
            }),
        min_price: z.number().optional(),
        max_price: z.number().optional(),
        materials: z.array(z.string()).optional(),
        priority: z.string().optional(),
    })
    .refine(
        (data) =>
            data.min_price === undefined ||
            data.max_price === undefined ||
            data.max_price >= data.min_price,
        {
            message: 'Harga maksimum harus ≥ harga minimum',
            path: ['max_price'],
        },
    );

export type TRecommenderRequest = z.infer<typeof SRecommenderRequest>;