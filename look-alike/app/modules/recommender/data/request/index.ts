import z from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const SImageFile = z
    .instanceof(File, { message: 'Image is required' })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: `Image size must not exceed ${MAX_FILE_SIZE / 1024 / 1024} MB`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: 'Unsupported file type. Please use PNG, JPG or WEBP.',
    });

export const SPriceRange = z
    .object({
        minPrice: z.number().nullable(),
        maxPrice: z.number().nullable(),
    })
    .refine((data) => data.minPrice === null || data.maxPrice !== null, {
        message: 'Highest price is required',
        path: ['maxPrice'],
    })
    .transform((data) => ({
        minPrice: data.maxPrice !== null ? (data.minPrice ?? 0) : null,
        maxPrice: data.maxPrice,
    }))
    .refine(
        (data) => data.minPrice === null || data.maxPrice === null || data.minPrice <= data.maxPrice,
        {
            message: 'Lowest price cannot be greater than highest price',
            path: ['minPrice'],
        },
    );

export const SRecommenderRequest = z
    .object({
        image_file: SImageFile,
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
            message: 'Highest price must be greater than or equal to lowest price',
            path: ['max_price'],
        },
    );

export type TRecommenderRequest = z.infer<typeof SRecommenderRequest>;