export function canManageSong(user, song) {
  return Boolean(
    user?._id &&
    !user.deletedAt &&
    song &&
    !song.deletedAt &&
    (user.role === "admin" || String(song.userId) === String(user._id)),
  );
}
export function canDeleteUser(user, target) {
  return Boolean(
    user?._id &&
    user.role === "admin" &&
    !user.deletedAt &&
    target?._id &&
    !target.deletedAt &&
    String(user._id) !== String(target._id),
  );
}
