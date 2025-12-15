import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().min(2).max(50).describe('Full name'),
  bio: z.string().min(20).max(200).describe('Short biography, 20-200 chars'),
  skills: z.array(z.string().min(2).max(30)).min(3).max(6).describe('3-6 skills'),
  experience: z.number().min(0).max(50).describe('Years of experience'),
  available: z.boolean().describe('Currently available for work'),
})

export type Profile = z.infer<typeof profileSchema>
