/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import { Link as LinkExtension } from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiH1,
  RiH2,
  RiH3,
  RiParagraph,
  RiListOrdered,
  RiListUnordered,
  RiLink,
  RiUnderline,
  RiTextWrap,
  RiFormatClear,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiImageAddFill,
} from "react-icons/ri";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

const setLink = (editor: any) => {
  const url = prompt("Digite o URL do link:");
  if (url) {
    editor?.chain().focus().setLink({ href: url }).run();
  }
};

const addImage = (editor: any) => {
  const url = prompt("Digite a URL da imagem:");
  if (url) {
    editor?.chain().focus().setImage({ src: url }).run();
  }
};

interface RichTextProps {
  content: string;
  onChange: (content: string) => void;
}

const RichText: React.FC<RichTextProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Image, LinkExtension, Underline],
    editorProps: {
      attributes: {
        class:
          "flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-700 text-gray-400 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md",
      },
    },
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const activeClass = "bg-blue-500 text-white rounded-sm p-2";
  const inactiveClass = "p-2";

  const actions = [
    {
      icon: RiBold,
      tooltip: "Negrito (Bold)",
      action: () => editor?.chain().focus().toggleBold().run(),
      active: () => editor?.isActive("bold"),
    },
    {
      icon: RiItalic,
      tooltip: "Itálico (Italic)",
      action: () => editor?.chain().focus().toggleItalic().run(),
      active: () => editor?.isActive("italic"),
    },
    {
      icon: RiUnderline,
      tooltip: "Sublinhado (Underline)",
      action: () => editor?.chain().focus().toggleUnderline().run(),
      active: () => editor?.isActive("underline"),
    },
    {
      icon: RiStrikethrough,
      tooltip: "Tachado (Strikethrough)",
      action: () => editor?.chain().focus().toggleStrike().run(),
      active: () => editor?.isActive("strike"),
    },
    {
      icon: RiListUnordered,
      tooltip: "Lista não ordenada (Bullet List)",
      action: () => editor?.chain().focus().toggleBulletList().run(),
      active: () => editor?.isActive("bulletList"),
    },
    {
      icon: RiListOrdered,
      tooltip: "Lista ordenada (Ordered List)",
      action: () => editor?.chain().focus().toggleOrderedList().run(),
      active: () => editor?.isActive("orderedList"),
    },
    {
      icon: RiH1,
      tooltip: "Título nível 1 (Heading 1)",
      action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      active: () => editor?.isActive("heading", { level: 1 }),
    },
    {
      icon: RiH2,
      tooltip: "Título nível 2 (Heading 2)",
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      active: () => editor?.isActive("heading", { level: 2 }),
    },
    {
      icon: RiH3,
      tooltip: "Título nível 3 (Heading 3)",
      action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      active: () => editor?.isActive("heading", { level: 3 }),
    },
    {
      icon: RiParagraph,
      tooltip: "Parágrafo (Paragraph)",
      action: () => editor?.chain().focus().setParagraph().run(),
      active: () => editor?.isActive("paragraph"),
    },
    {
      icon: RiLink,
      tooltip: "Adicionar link (Link)",
      action: () => setLink(editor),
      active: () => editor?.isActive("link"),
    },
    {
      icon: RiImageAddFill,
      tooltip: "Adicionar imagem (Image)",
      action: () => addImage(editor),
      active: () => false,
    },
    {
      icon: RiTextWrap,
      tooltip: "Quebra de linha (Hard Break)",
      action: () => editor?.chain().focus().setHardBreak().run(),
      active: () => editor?.isActive("hardBreak"),
    },
    {
      icon: RiFormatClear,
      tooltip: "Limpar formatação (Clear Formatting)",
      action: () => editor?.chain().focus().unsetAllMarks().clearNodes().run(),
      active: () => false,
    },
    {
      icon: RiArrowGoBackLine,
      tooltip: "Desfazer (Undo)",
      action: () => editor?.chain().focus().undo().run(),
      active: () => false,
    },
    {
      icon: RiArrowGoForwardLine,
      tooltip: "Refazer (Redo)",
      action: () => editor?.chain().focus().redo().run(),
      active: () => false,
    },
  ];

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="flex w-full flex-wrap items-start gap-2 rounded-tl-md rounded-tr-md border border-gray-700 px-4 py-3">
          {actions.map(({ icon: Icon, tooltip, action, active }, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={action}
                  className={active() ? activeClass : inactiveClass}
                >
                  <Icon />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip} </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <EditorContent editor={editor} />
        <style jsx global>
          {`
            .ProseMirror a:hover {
              color: #1d4ed8;
              text-decoration: underline;
            }
            .ProseMirror h1 {
              font-size: 1.5rem;
              font-weight: bold;
              margin-bottom: 0.5rem;
            }
            .ProseMirror h2 {
              font-size: 1.2rem;
              font-weight: bold;
              margin-bottom: 0.5rem;
            }
            .ProseMirror h3 {
              font-size: 1rem;
              font-weight: bold;
              margin-bottom: 0.5rem;
            }
            .ProseMirror ul {
              list-style-type: disc;
              padding-left: 2rem;
              margin-bottom: 1rem;
            }
            .ProseMirror ul li {
              margin-bottom: 0.25rem;
            }
            .ProseMirror ol {
              list-style-type: decimal;
              padding-left: 2rem;
              margin-bottom: 1rem;
            }
            .ProseMirror ol li {
              margin-bottom: 0.25rem;
            }
          `}
        </style>
      </div>
    </TooltipProvider>
  );
};

export default RichText;
