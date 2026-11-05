import { currentUser, sameOrigin } from "@/lib/auth";
import { canDeleteUser } from "@/lib/permissions";
import User from "@/models/User";
export const runtime = "nodejs";
export async function DELETE(request, { params }) {
  if (!sameOrigin(request))
    return Response.json({ error: "অনুমতি নেই।" }, { status: 403 });
  try {
    const admin = await currentUser();
    if (admin?.role !== "admin")
      return Response.json(
        { error: "অ্যাডমিন অনুমতি প্রয়োজন।" },
        { status: 403 },
      );
    const { id } = await params;
    if (!/^[a-f\d]{24}$/i.test(id))
      return Response.json(
        { error: "ব্যবহারকারী পাওয়া যায়নি।" },
        { status: 404 },
      );
    const target = await User.findOne({ _id: id, deletedAt: null })
      .select("_id")
      .lean();
    if (!target)
      return Response.json(
        { error: "ব্যবহারকারী পাওয়া যায়নি।" },
        { status: 404 },
      );
    if (!canDeleteUser(admin, target))
      return Response.json(
        { error: "নিজের অ্যাডমিন অ্যাকাউন্ট মুছতে পারবেন না।" },
        { status: 403 },
      );
    await User.updateOne(
      { _id: id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
    );
    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "ব্যবহারকারী মুছতে পারিনি।" },
      { status: 503 },
    );
  }
}
