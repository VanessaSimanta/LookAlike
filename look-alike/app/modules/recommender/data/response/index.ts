import z from 'zod';
import { createApiResponseSchema } from '@/shared/apiResponse';

// result schema
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

// detail schema
export const SProductDetail = z.object({
    brand_name: z.string(),
    product_name: z.string(),
    base_price: z.number(),
    promo_price: z.number().nullable(),
    rating: z.number().nullable(),
    category_name: z.string(),
    material: z.string(),
    sizes: z.array(z.string()),
    colors: z.array(z.string()),
    image_url: z.string(),
})

export type TProductDetail = z.infer<typeof SProductDetail>;

export const SProductDetailResponse =
    createApiResponseSchema(SProductDetail);

export type TProductDetailResponse = z.infer<
    typeof SProductDetailResponse
>;

export const SRandomSample = z.object({
    image_url: z.string(),
})

export type TRandomSample = z.infer<typeof SRandomSample>;

export const SRandomSampleResponse =
    createApiResponseSchema(z.array(SRandomSample));

export type TRandomSampleResponse = z.infer<
    typeof SRandomSampleResponse
>;