export function filterSongs(songs, params, favorites = []) {
  const query = (params.get("q") || "").trim().toLocaleLowerCase("bn");
  const category = params.get("category") || "";
  const type = params.get("type") || "";
  return songs.filter(
    (song) =>
      (!query ||
        `${song.title} ${song.lyrics} ${song.category}`
          .toLocaleLowerCase("bn")
          .includes(query)) &&
      (!category || song.category === category) &&
      (!type || song.type === type) &&
      (params.get("view") !== "favorites" ||
        favorites.includes(String(song._id))),
  );
}
export const bn = (value) => Number(value).toLocaleString("bn-BD");
export const songHref = (id, from = "") =>
  `/songs/${encodeURIComponent(id)}${from ? `?from=${encodeURIComponent(from)}` : ""}`;
