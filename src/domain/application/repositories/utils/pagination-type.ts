import { z } from 'zod'

const paginationZodSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
})

export type PaginationType = z.infer<typeof paginationZodSchema>
