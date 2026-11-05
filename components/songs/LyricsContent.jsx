import { richLyricsSchema } from "@/lib/richLyrics";
export default function LyricsContent({ lyrics, content }) {
  const parsed = richLyricsSchema.safeParse(content);
  if (!parsed.success)
    return lyrics.split(/\n\s*\n/).map((verse, i) => (
      <p key={i} className="whitespace-pre-wrap">
        {verse}
      </p>
    ));
  return parsed.data.content.map((block, i) => {
    const children = (block.content || []).map((node, j) => {
      if (node.type === "hardBreak") return <br key={j} />;
      let text = node.text;
      for (const mark of node.marks || [])
        text = mark.type === "bold" ? <strong>{text}</strong> : <em>{text}</em>;
      return <span key={j}>{text}</span>;
    });
    return block.type === "heading" ? (
      <h2 key={i} className="font-semibold">
        {children}
      </h2>
    ) : (
      <p key={i} className="min-h-[1em] whitespace-pre-wrap">
        {children}
      </p>
    );
  });
}
