import test from "node:test";
import assert from "node:assert/strict";
import { songSchema } from "../lib/songSchema.js";
const payload = {
  rightsConfirmed: true,
  title: "নামের কীর্তন",
  category: "নামকীর্তন",
  type: "কীর্তন",
  lyrics: "হরে কৃষ্ণ হরে কৃষ্ণ",
};
test("clients cannot transfer song ownership or assign admin fields", () => {
  const result = songSchema.parse({
    ...payload,
    userId: "another-user",
    isAdmin: true,
    author: "spoofed",
    deletedAt: null,
  });
  assert.equal("userId" in result, false);
  assert.equal("isAdmin" in result, false);
  assert.equal("author" in result, false);
  assert.equal("deletedAt" in result, false);
});
test("searchable lyrics are derived from the validated formatted document", () => {
  const result = songSchema.parse({
    ...payload,
    lyricsContent: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "হরে রাম হরে রাম" }],
        },
      ],
    },
  });
  assert.equal(result.lyrics, "হরে রাম হরে রাম");
});
