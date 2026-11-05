import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { ConnectDB } from "@/lib/DatabaseConnection";
import User from "@/models/User";
const cookieName = "kirtan_session";
function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32 || secret.startsWith("replace-"))
    throw Error("Configure AUTH_SECRET");
  return new TextEncoder().encode(secret);
}
export async function setSession(id) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(id))
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key());
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 604800,
  });
}
export async function currentUser() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  let id;
  try {
    const { payload } = await jwtVerify(token, key(), {
      algorithms: ["HS256"],
    });
    id = payload.sub;
    if (!/^[a-f\d]{24}$/i.test(id || "")) return null;
  } catch {
    return null;
  }
  await ConnectDB();
  const user = await User.findOne({ _id: id, deletedAt: null })
    .select("_id name email role")
    .lean();
  return user
    ? { ...user, _id: String(user._id), role: user.role || "user" }
    : null;
}
export async function clearSession() {
  (await cookies()).delete(cookieName);
}
export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
export async function readBody(request) {
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 100000) throw Error("PAYLOAD_TOO_LARGE");
  return JSON.parse(raw);
}

export function publicUser(user) {
  return {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role || "user",
  };
}
