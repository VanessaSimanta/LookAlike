import axios, { AxiosResponse } from 'axios';
import { BACKEND_URL } from '@/shared/api';
import { TRecommenderRequest } from '../data/request';
import { TRecommenderResponse } from '../data/response';
import { GetRecommendationError } from '../error';

export const RecommenderService = {
    getRecommender: async (body: TRecommenderRequest) => {
        try {
            const formData = new FormData();
            formData.append('image_file', body.image_file);
            if (body.min_price !== undefined) formData.append('min_price', String(body.min_price));
            if (body.max_price !== undefined) formData.append('max_price', String(body.max_price));
            if (body.materials !== undefined) formData.append('materials', body.materials);
            if (body.priority !== undefined) formData.append('priority', body.priority);

            const response: AxiosResponse<TRecommenderResponse> =
                await BACKEND_URL.post('/similar-products', formData);

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new GetRecommendationError();
            }
            throw error;
        }
    },
};