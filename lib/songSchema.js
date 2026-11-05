import { z } from "zod";
import { categories } from "./songs.js";
import { richLyricsSchema, richTextToPlainText } from "./richLyrics.js";
export const songSchema = z
  .object({
    title: z.string().trim().min(2).max(120),
    category: z.enum(categories),
    type: z.enum(["কীর্তন", "গান"]),
    lyrics: z.string().trim().min(10).max(20000),
    lyricsContent: richLyricsSchema.nullable().optional(),
  })
  .transform((data) => ({
    ...data,
    lyrics: data.lyricsContent
      ? richTextToPlainText(data.lyricsContent).trim()
      : data.lyrics,
  }))
  .refine((data) => data.lyrics.length >= 10 && data.lyrics.length <= 20000);
