import type { Product } from '../../components/resultsSection';
import type { RecommendationFilters } from '../../components/uploadImageSection';
import { TRecommenderRequest } from '../request';
import { TRecommender } from '../response';
import { PriorityEnum } from '../../../enums/priorityEnum';

export const toRecommenderRequest = (image: File, filters: RecommendationFilters): TRecommenderRequest => ({
  image_file: image,
  min_price: filters.minPrice ?? undefined,
  max_price: filters.maxPrice ?? undefined,
  materials: filters.materials.length ? filters.materials : undefined,
  priority: filters.pricePriority
    ? PriorityEnum.PRICE
    : filters.materialPriority
      ? PriorityEnum.MATERIALS
      : undefined,
});

export const toProduct = (item: TRecommender): Product => ({
  product_id: item.product_id,
  brand: item.brand_name ?? '-',
  name: item.name,
  category: item.category_name ?? '-',
  price: item.promo_price ?? item.base_price,
  similarity: Math.round(item.similarity_score),
  image: item.image_url ?? undefined,
  material: item.material ?? undefined,
});
