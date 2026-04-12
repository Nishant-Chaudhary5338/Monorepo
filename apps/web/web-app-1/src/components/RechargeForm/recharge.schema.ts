import { z } from 'zod'

export const rechargeSchema = z.object({
  category: z.enum(['prepaid', 'postpaid'], {
    required_error: 'Select a category',
  }),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  operator: z.string().min(1, 'Select an operator'),
  circle: z.string().min(1, 'Select a circle'),
})

export type RechargeSchema = z.infer<typeof rechargeSchema>
