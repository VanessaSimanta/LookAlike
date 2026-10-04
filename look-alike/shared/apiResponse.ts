import { z } from 'zod';


export const SErrorResponse = z.object({
  status: z.boolean(),
  code: z.number(),
  message: z.string(),
  detail: z.unknown().nullable(),
});

export const createApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    error: SErrorResponse,
    data: dataSchema,
  });
