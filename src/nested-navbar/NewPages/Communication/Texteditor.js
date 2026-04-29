import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Link as LinkIcon, Undo2, Redo2,
} from 'lucide-react';

const ToolbarButton = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    className={`p-1 rounded text-sm transition-colors ${
      active
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`}
  >
    {children}
  </button>
);

export default function Editor({ initialContent, onChange, value }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: { depth: 50 } }),
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Type a message…' }),
    ],
    content: value || initialContent || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = value ?? '';
    if (incoming === '' && current !== '<p></p>') {
      editor.commands.clearContent(true);
    } else if (incoming && incoming !== current) {
      editor.commands.setContent(incoming, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const handleLink = () => {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('URL', prev);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="rounded-lg border  focus-within:ring-1  focus-within:border-ring">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1 border-b border-border bg-muted/40 rounded-t-lg">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-0.5" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-0.5" />
        <ToolbarButton onClick={handleLink} active={editor.isActive('link')} title="Link">
          <LinkIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-0.5" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo">
          <Undo2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo">
          <Redo2 className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="px-3 py-2 min-h-[80px] max-h-[160px] overflow-y-auto text-sm text-foreground rounded-b-lg [&_.tiptap]:outline-none [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0"
      />
    </div>
  );
}



