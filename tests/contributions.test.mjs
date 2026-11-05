import test from "node:test";
import assert from "node:assert/strict";
import { commentSchema, canDeleteComment } from "../lib/commentSchema.js";
import { songSchema } from "../lib/songSchema.js";
const song = { title: "নামের কীর্তন", category: "নামকীর্তন", type: "কীর্তন", lyrics: "হরে কৃষ্ণ হরে কৃষ্ণ", rightsConfirmed: true };
test("lyricist is optional and collector identity cannot be supplied by a client", () => {
 const result = songSchema.parse({ ...song, userId: "fake", collectedBy: "fake", lyricist: "  গীতিকার  " });
 assert.equal(result.lyricist, "গীতিকার");
 assert.equal(result.contributionType, "collected");
 assert.equal("collectedBy" in result, false);
 assert.equal("userId" in result, false);
 assert.equal(songSchema.parse(song).lyricist, "");
});
test("rights confirmation is explicit and original submissions are supported", () => {
 assert.equal(songSchema.safeParse({ ...song, rightsConfirmed: false }).success, false);
 assert.equal(songSchema.parse({ ...song, contributionType: "original" }).contributionType, "original");
 assert.equal(songSchema.safeParse({ ...song, lyricist: "x".repeat(121) }).success, false);
});
test("comments reject empty and oversized input and strip spoofed identity", () => {
 assert.equal(commentSchema.safeParse({ text: "  " }).success, false);
 assert.equal(commentSchema.safeParse({ text: "x".repeat(1001) }).success, false);
 assert.deepEqual(commentSchema.parse({ text: " তথ্য ", userId: "fake", name: "fake", role: "admin" }), { text: "তথ্য" });
});
test("comment deletion belongs to its writer or a database admin", () => {
 const comment = { userId: "writer" };
 assert.equal(canDeleteComment({ _id: "writer", role: "user" }, comment), true);
 assert.equal(canDeleteComment({ _id: "other", role: "user" }, comment), false);
 assert.equal(canDeleteComment({ _id: "admin", role: "admin" }, comment), true);
 assert.equal(canDeleteComment({ _id: "writer", deletedAt: new Date() }, comment), false);
 assert.equal(canDeleteComment(null, comment), false);
});
