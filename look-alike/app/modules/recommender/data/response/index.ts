import z from 'zod';
import { createApiResponseSchema } from '@/shared/apiResponse';

export const SRecommender = z.object({
    product_id: z.number(),
    name: z.string(),
    brand_name: z.string().nullable(),
    category_name: z.string().nullable(),
    base_price: z.number(),
    promo_price: z.number().nullable(),
    image_url: z.string().nullable(),
    material: z.string().nullable(),
    similarity_score: z.number(),
    saw_score: z.number().nullable(),
});

export type TRecommender = z.infer<typeof SRecommender>;

export const SRecommenderResponse =
    createApiResponseSchema(z.array(SRecommender));

export type TRecommenderResponse = z.infer<
    typeof SRecommenderResponse
>;
