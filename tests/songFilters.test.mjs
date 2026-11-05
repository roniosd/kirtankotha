import test from "node:test";
import assert from "node:assert/strict";
import { filterSongs, songHref } from "../lib/songFilters.js";
const songs = [
  {
    _id: "1",
    title: "হরে কৃষ্ণ",
    lyrics: "নাম সংকীর্তন",
    category: "নামকীর্তন",
    type: "কীর্তন",
  },
  {
    _id: "2",
    title: "ভজ হুঁ রে মন",
    lyrics: "অভয়চরণ",
    category: "ভজন",
    type: "গান",
  },
  {
    _id: "3",
    title: "গৌরাঙ্গ",
    lyrics: "হরি নাম",
    category: "ভজন",
    type: "কীর্তন",
  },
];
test("search matches Bengali lyrics and trims spaces", () =>
  assert.deepEqual(
    filterSongs(songs, new URLSearchParams({ q: " অভয়চরণ " })).map(
      (s) => s._id,
    ),
    ["2"],
  ));
test("category and type combine before song navigation", () =>
  assert.deepEqual(
    filterSongs(
      songs,
      new URLSearchParams({ category: "ভজন", type: "কীর্তন" }),
    ).map((s) => s._id),
    ["3"],
  ));
test("favorite search stays within the owning favorite list", () =>
  assert.deepEqual(
    filterSongs(songs, new URLSearchParams({ view: "favorites", q: "হরি" }), [
      "2",
      "3",
    ]).map((s) => s._id),
    ["3"],
  ));
test("reading links preserve the exact search and filter context", () => {
  const from = new URLSearchParams({
    q: "হরি",
    category: "ভজন",
    view: "favorites",
  }).toString();
  const url = new URL(songHref("3", from), "https://example.com");
  assert.equal(url.pathname, "/songs/3");
  assert.equal(url.searchParams.get("from"), from);
});
