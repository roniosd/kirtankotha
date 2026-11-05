import { z } from "zod";
const mark = z.object({ type: z.enum(["bold", "italic"]) }).strict();
const inline = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("text"),
      text: z.string().min(1).max(20000),
      marks: z.array(mark).max(2).optional(),
    })
    .strict(),
  z.object({ type: z.literal("hardBreak") }).strict(),
]);
const block = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("paragraph"),
      content: z.array(inline).max(2000).optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal("heading"),
      attrs: z.object({ level: z.literal(2) }).strict(),
      content: z.array(inline).max(2000).optional(),
    })
    .strict(),
]);
export const richLyricsSchema = z
  .object({ type: z.literal("doc"), content: z.array(block).min(1).max(500) })
  .strict();
export function richTextToPlainText(doc) {
  return (doc?.content || [])
    .map((block) =>
      (block.content || [])
        .map((node) => (node.type === "hardBreak" ? "\n" : node.text || ""))
        .join(""),
    )
    .join("\n\n");
}

export function plainTextToRichDoc(text = "") {
  return {
    type: "doc",
    content: String(text)
      .split(/\n\s*\n/)
      .map((verse) => ({
        type: "paragraph",
        content: verse
          .split("\n")
          .flatMap((line, index) => [
            ...(index ? [{ type: "hardBreak" }] : []),
            ...(line ? [{ type: "text", text: line }] : []),
          ]),
      })),
  };
}
