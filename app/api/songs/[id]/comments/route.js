import { ConnectDB } from "@/lib/DatabaseConnection";
import { currentUser, readBody, sameOrigin } from "@/lib/auth";
import { commentSchema } from "@/lib/commentSchema";
import Song from "@/models/Song";
import Comment from "@/models/Comment";
export const runtime = "nodejs";
const valid = id => /^[a-f\d]{24}$/i.test(id);
const json = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
export async function GET(request, { params }) {
  const { id } = await params;
  if (!valid(id)) return json({ error: "গান পাওয়া যায়নি।" }, 404);
  try {
    await ConnectDB();
    if (!await Song.exists({ _id: id, deletedAt: null })) return json({ error: "গান পাওয়া যায়নি।" }, 404);
    const page = Math.min(10000, Math.max(1, Math.floor(Number(new URL(request.url).searchParams.get("page")) || 1)));
    const rows = await Comment.find({ songId: id }).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 20).limit(21).select("userId name text createdAt").lean();
    return json({ comments: rows.slice(0, 20), hasMore: rows.length > 20 });
  } catch { return json({ error: "মন্তব্য লোড হয়নি। আবার চেষ্টা করুন।" }, 503); }
}
export async function POST(request, { params }) {
  if (!sameOrigin(request)) return json({ error: "অনুমতি নেই।" }, 403);
  const { id } = await params;
  if (!valid(id)) return json({ error: "গান পাওয়া যায়নি।" }, 404);
  try {
    const user = await currentUser();
    if (!user) return json({ error: "মন্তব্য করতে লগইন করুন।" }, 401);
    const parsed = commentSchema.safeParse(await readBody(request));
    if (!parsed.success) return json({ error: "মন্তব্য ২–১০০০ অক্ষরের মধ্যে লিখুন।" }, 400);
    if (!await Song.exists({ _id: id, deletedAt: null })) return json({ error: "গান পাওয়া যায়নি।" }, 404);
    if (await Comment.exists({ userId: user._id, createdAt: { $gte: new Date(Date.now() - 15000) } })) return json({ error: "আরেকটি মন্তব্যের আগে ১৫ সেকেন্ড অপেক্ষা করুন।" }, 429);
    const row = await Comment.create({ songId: id, userId: user._id, name: user.name || "একজন পাঠক", text: parsed.data.text });
    return json({ comment: { _id: row._id, userId: row.userId, name: row.name, text: row.text, createdAt: row.createdAt } }, 201);
  } catch (error) { return json({ error: "মন্তব্য জমা হয়নি। আবার চেষ্টা করুন।" }, error instanceof SyntaxError || error.message === "PAYLOAD_TOO_LARGE" ? 400 : 503); }
}
