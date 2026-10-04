import { ApplicationError } from '@/app/error/error';

export class GetRecommendationError extends ApplicationError {
  constructor() {
    super(
      'Error',
      'Gagal mendapatkan data hasil rekomendasi, silahkan coba beberapa saat lagi'
    );
  }
}