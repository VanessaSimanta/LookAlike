import axios, { AxiosResponse } from 'axios';
import { BACKEND_URL } from '@/shared/api';
import { TRecommenderRequest } from '../data/request';
import { TProductDetailResponse, TRandomSampleResponse, TRecommenderResponse } from '../data/response';
import { GetProductDetailError, GetRandomSampleError, GetRecommendationError, GetSampleImageError } from '../error';

export const RecommenderService = {
    getRecommender: async(body: TRecommenderRequest) => {
        try {
            const formData = new FormData();
            formData.append('image_file', body.image_file);
            if (body.min_price !== undefined) formData.append('min_price', String(body.min_price));
            if (body.max_price !== undefined) formData.append('max_price', String(body.max_price));
            body.materials?.forEach((material) => formData.append('materials', material));
            if (body.priority !== undefined) formData.append('priority', body.priority);

            const response: AxiosResponse<TRecommenderResponse> =
                await BACKEND_URL.post('/similar-products', formData);

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("error in getRecommender: ", error);
                throw new GetRecommendationError();
            }
            throw error;
        }
    },
    getProductDetail: async(product_id: number) => {
        try {
            const response: AxiosResponse<TProductDetailResponse> =
                await BACKEND_URL.get('/product-detail', { params: { product_id } });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("error in getProductDetail: ", error);
                throw new GetProductDetailError();
            }
            throw error;
        }
    },
    getRandomSample: async(limit: number) => {
        try {
            const response: AxiosResponse<TRandomSampleResponse> =
                await BACKEND_URL.get('/random-sample', { params: { limit } });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("error in getRandomSample: ", error);
                throw new GetRandomSampleError();
            }
            throw error;
        }
    },
    getSampleImage: async(url: string) => {
        try {
            const response: AxiosResponse<Blob> =
                await BACKEND_URL.get('/sample-image', { params: { url }, responseType: 'blob' });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("error in getSampleImage: ", error);
                throw new GetSampleImageError();
            }
            throw error;
        }
    },
};