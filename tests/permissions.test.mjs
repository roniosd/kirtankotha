import test from "node:test";
import assert from "node:assert/strict";
import { canManageSong, canDeleteUser } from "../lib/permissions.js";
import { authSchema } from "../lib/authSchema.js";
import { filterSongs } from "../lib/songFilters.js";
test("database admin role grants access regardless of email or account order", () => {
  for (const email of ["someone@example.com", "different@example.com"])
    assert.equal(
      canManageSong(
        { _id: "any-account", email, role: "admin" },
        { userId: "other" },
      ),
      true,
    );
  assert.equal(
    canManageSong(
      { _id: "first-account", email: "ronidev39@gmail.com" },
      { userId: "other" },
    ),
    false,
  );
});
test("normal users can only change their own active songs", () => {
  const song = { userId: "me" };
  assert.equal(canManageSong({ _id: "me", role: "user" }, song), true);
  assert.equal(canManageSong({ _id: "other", role: "user" }, song), false);
  assert.equal(canManageSong({ _id: "other", isAdmin: true }, song), false);
  assert.equal(canManageSong(null, song), false);
  assert.equal(
    canManageSong({ _id: "me", deletedAt: new Date() }, song),
    false,
  );
  assert.equal(
    canManageSong(
      { _id: "admin", role: "admin" },
      { ...song, deletedAt: new Date() },
    ),
    false,
  );
});
test("signup cannot request admin privileges or retain role fields", () => {
  const result = authSchema.parse({
    action: "signup",
    email: "anyone@example.com",
    password: "password123",
    role: "admin",
    isAdmin: true,
  });
  assert.equal("role" in result, false);
  assert.equal("isAdmin" in result, false);
});
test("only admins can remove other users and cannot delete themselves", () => {
  const admin = { _id: "admin", role: "admin" };
  assert.equal(canDeleteUser(admin, { _id: "other" }), true);
  assert.equal(canDeleteUser(admin, admin), false);
  assert.equal(
    canDeleteUser({ _id: "user", role: "user" }, { _id: "other" }),
    false,
  );
  assert.equal(
    canDeleteUser({ ...admin, deletedAt: new Date() }, { _id: "other" }),
    false,
  );
});
test("my song filter preserves ownership", () => {
  const songs = [
    {
      _id: "1",
      userId: "me",
      title: "কীর্তন",
      lyrics: "গান",
      category: "ভজন",
      type: "গান",
    },
    {
      _id: "2",
      userId: "other",
      title: "কীর্তন",
      lyrics: "গান",
      category: "ভজন",
      type: "গান",
    },
  ];
  assert.deepEqual(
    filterSongs(songs, new URLSearchParams({ view: "mine" }), [], "me").map(
      (s) => s._id,
    ),
    ["1"],
  );
});
