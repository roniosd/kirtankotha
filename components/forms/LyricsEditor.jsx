"use client";
import GoogleLensLink from "./GoogleLensLink";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Heading2, Undo2, Redo2, Type } from "lucide-react";
import { bn } from "@/lib/songFilters";
export default function LyricsEditor({ onChange, initialContent }) {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
        blockquote: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        listKeymap: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        strike: false,
        underline: false,
        link: false,
      }),
    ],
    content: initialContent || "",
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-label": "গানের কথা লিখুন",
        "aria-multiline": "true",
        "aria-describedby": "lyrics-editor-help",
        spellcheck: "false",
        class:
          "min-h-56 px-4 py-4 text-lg leading-9 text-[#52331f] dark:text-stone-100 outline-none [&_p]:mb-3 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold",
      },
    },
    onUpdate: ({ editor }) =>
      onChange({
        lyrics: editor.getText({ blockSeparator: "\n\n" }),
        lyricsContent: editor.getJSON(),
      }),
  });
  if (!editor)
    return (
      <p className="min-h-56 rounded-2xl border border-[#e5d6c3] dark:border-stone-700 bg-white dark:bg-stone-900 p-4 text-stone-400">
        এডিটর খুলছে…
      </p>
    );
  const tools = [
    {
      label: "মোটা",
      Icon: Bold,
      active: editor.isActive("bold"),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "বাঁকা",
      Icon: Italic,
      active: editor.isActive("italic"),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "উপশিরোনাম",
      Icon: Heading2,
      active: editor.isActive("heading", { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "সাধারণ",
      Icon: Type,
      active: false,
      run: () => editor.chain().focus().setParagraph().unsetAllMarks().run(),
    },
    {
      label: "ফেরান",
      Icon: Undo2,
      disabled: !editor.can().undo(),
      run: () => editor.chain().focus().undo().run(),
    },
    {
      label: "আবার",
      Icon: Redo2,
      disabled: !editor.can().redo(),
      run: () => editor.chain().focus().redo().run(),
    },
  ];
  const length = editor.getText({ blockSeparator: "\n\n" }).trim().length;
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#e5d6c3] dark:border-stone-700 bg-white dark:bg-stone-900 focus-within:border-amber-700 focus-within:ring-3 focus-within:ring-amber-100">
        <div
          role="group"
          aria-label="লেখা সাজানোর বোতাম"
          className="flex flex-wrap gap-1.5 border-b border-[#eee0cb] dark:border-stone-700 bg-[#fff8eb] dark:bg-stone-900 p-2"
        >
          {tools.map(({ label, Icon, active, disabled, run }) => (
            <button
              key={label}
              type="button"
              onClick={run}
              disabled={disabled}
              aria-pressed={active || undefined}
              title={label}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-medium transition disabled:opacity-30 ${active ? "border-[#b97b42] bg-[#f6dfbd] dark:bg-stone-900 text-[#79421f] dark:text-amber-100/80" : "border-transparent bg-white dark:bg-stone-900 text-[#9b724a] dark:text-amber-100/80 hover:border-[#dfc29c]"}`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>
        <EditorContent editor={editor} />
        <p
          className={`border-t border-[#f0e6d8] dark:border-stone-700 px-4 py-2 text-right text-xs ${length > 20000 ? "text-red-700 dark:text-red-300" : "text-stone-400"}`}
          aria-live="polite"
        >
          {bn(length)} / {bn(20000)} অক্ষর
        </p>
      </div>
    </>
  );
}
