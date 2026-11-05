import { currentUser } from "@/lib/auth";
import User from "@/models/User";
export const runtime = "nodejs";
export async function GET(request) {
  try {
    const admin = await currentUser();
    if (admin?.role !== "admin")
      return Response.json(
        { error: "অ্যাডমিন অনুমতি প্রয়োজন।" },
        { status: 403 },
      );
    const params = new URL(request.url).searchParams,
      page = Math.min(10000, Math.max(1, Number(params.get("page")) || 1)),
      q = (params.get("q") || "").trim().slice(0, 100);
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = {
      deletedAt: null,
      ...(q
        ? {
            $or: [
              { email: { $regex: escaped, $options: "i" } },
              { name: { $regex: escaped, $options: "i" } },
            ],
          }
        : {}),
    };
    const [users, total] = await Promise.all([
      User.find(match)
        .select("_id name email createdAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * 20)
        .limit(20)
        .lean(),
      User.countDocuments(match),
    ]);
    return Response.json(
      { users, total, page },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "ব্যবহারকারীর তালিকা লোড হয়নি।" },
      { status: 503 },
    );
  }
}
