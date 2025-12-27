import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import type { Editor as TiptapEditor } from "@tiptap/core"

import "./EditorUpload.css";
import Image from "@tiptap/extension-image";
import { Figure } from "./nodes/Figure";
import { Figcaption } from "./nodes/Figcaption";
import { useRef } from "react";

type EditorProps = {
  initialContent?: string
  onChange?: (html: string) => void
}

Link.configure({
  openOnClick: false,
  autolink: true,
  linkOnPaste: true,
  HTMLAttributes: {
    rel: "noopener noreferrer",
    target: "_blank",
  },
});

function Toolbar({ editor }: { editor: TiptapEditor | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!editor) return null

  return (
    <div className="editor-toolbar">
      {/* Text styles */}
      <div className="group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "active" : ""}
        >
          <p><b>B</b></p>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "active" : ""}
        >
          <p><i>I</i></p>
        </button>
      </div>

      {/* Structure */}
      <div className="group">
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "active" : ""}
        >
          Normal
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault(); // 👈 keeps the text selection intact
            editor.chain().focus().unsetAllMarks().toggleHeading({ level: 3 }).run();
  }}
          className={editor.isActive("heading", { level: 3 }) ? "active" : ""}
        >
          Heading
        </button>
      </div>

      {/* Lists & blocks */}
      <div className="group">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "active" : ""}
        >
          •
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "active" : ""}
        >
          1.
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "active" : ""}
        >
          ❝
        </button>
      </div>

      {/* History */}
      <div className="group">
        <button onClick={() => editor.chain().focus().undo().run()}>
          ↶
        </button>
        <button onClick={() => editor.chain().focus().redo().run()}>
          ↷
        </button>
      </div>

      <div className="group">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            const url = window.prompt("Enter URL");
            if (!url) return;

            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();}}>
          &#x1f517;
        </button>

        <button
          onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().unsetLink().run();}}>
          <s>&#x1f517;</s>
        </button>
      </div>
      <div className="group">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            fileInputRef.current?.click()
          }}>
          &#x1f5bc;
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return

            const reader = new FileReader()

            reader.onload = () => {
              const src = reader.result as string
              editor
                .chain()
                .focus()
                .insertContent({
                  type: "figure",
                  content: [
                    {
                      type: "image",
                      attrs: { src },
                    },
                    {
                      type: "figcaption",
                      content: [{ type: "text", text: "Caption (optional)" }],
                    },
                  ],
                })
                .run()
            }
            reader.readAsDataURL(file)
          }}
        />
      </div>
    </div>
  )
}

export default function EditorUpload({ initialContent = "", onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {},
        bold: {},
        italic: {},
        strike: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        heading: {
          levels: [3],
        },
        bulletList: {},
        orderedList: {},
        blockquote: {},
      }),
      Image.configure({
      inline: false,
      allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Figure,
      Figcaption,
    ],
    editorProps: {
      attributes: {
        spellcheck: "false",
        autocorrect: "off",
        autocapitalize: "off",
        autocomplete: "off",
      },
    },
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  return (
    <div className="editor">
      <div className="editor-wrapper">
        <Toolbar editor={editor} />
        <EditorContent editor={editor} className="editor-content" autoCorrect="off" lang="en-GB" />
      </div>
    </div>
  )
}
