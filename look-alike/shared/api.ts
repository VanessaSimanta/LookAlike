import axios from 'axios';

export const BACKEND_URL = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: 30000, 
});