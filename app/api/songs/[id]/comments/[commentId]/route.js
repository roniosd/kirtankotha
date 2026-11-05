import { currentUser, sameOrigin } from "@/lib/auth";
import { canDeleteComment } from "@/lib/commentSchema";
import Comment from "@/models/Comment";
import Song from "@/models/Song";
export const runtime = "nodejs";
export async function DELETE(request, { params }) {
  if (!sameOrigin(request)) return Response.json({ error: "অনুমতি নেই।" }, { status: 403 });
  const { id, commentId } = await params;
  if (![id, commentId].every(value => /^[a-f\d]{24}$/i.test(value))) return Response.json({ error: "মন্তব্য পাওয়া যায়নি।" }, { status: 404 });
  try {
    const user = await currentUser();
    if (!user) return Response.json({ error: "লগইন করুন।" }, { status: 401 });
    if (!await Song.exists({ _id: id, deletedAt: null })) return Response.json({ error: "গান পাওয়া যায়নি।" }, { status: 404 });
    const comment = await Comment.findOne({ _id: commentId, songId: id }).lean();
    if (!comment) return Response.json({ error: "মন্তব্য পাওয়া যায়নি।" }, { status: 404 });
    if (!canDeleteComment(user, comment)) return Response.json({ error: "মন্তব্য মুছতে অনুমতি নেই।" }, { status: 403 });
    await Comment.deleteOne({ _id: commentId, songId: id });
    return Response.json({ success: true });
  } catch { return Response.json({ error: "মন্তব্য মোছা হয়নি।" }, { status: 503 }); }
}
