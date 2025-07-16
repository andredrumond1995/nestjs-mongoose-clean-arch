import { z } from 'zod';

export const todosCreateZodSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  due_date: z.coerce.date().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  user_id: z.string().optional(),
});

export const todosUpdateZodSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  due_date: z.coerce.date().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  user_id: z.string().optional(),
}); 