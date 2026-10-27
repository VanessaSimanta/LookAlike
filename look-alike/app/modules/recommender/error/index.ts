import { ApplicationError } from '@/app/error/error';

export class GetRecommendationError extends ApplicationError {
  constructor() {
    super(
      'Error',
      'Gagal mendapatkan data hasil rekomendasi, silahkan coba beberapa saat lagi'
    );
  }
}


export class GetProductDetailError extends ApplicationError {
  constructor() {
    super(
      'Error',
      'Gagal mendapatkan data detail produk, silahkan coba beberapa saat lagi'
    );
  }
}

export class GetRandomSampleError extends ApplicationError {
  constructor() {
    super(
      'Error',
      'Gagal mendapatkan data produk acak, silahkan coba beberapa saat lagi'
    );
  }
}

export class GetSampleImageError extends ApplicationError {
  constructor() {
    super(
      'Error',
      'Gagal memuat gambar sample, silahkan coba gambar lainnya'
    );
  }
}