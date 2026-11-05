import { z } from "zod";
export const commentSchema = z.object({ text: z.string().trim().min(2).max(1000) });
export function canDeleteComment(user, comment) {
  return Boolean(user?._id && !user.deletedAt && comment && (user.role === "admin" || String(comment.userId) === String(user._id)));
}
