import { EditorContent, useEditor } from "@tiptap/react";
import { useRef, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaChessBoard,
  FaFileImage,
  FaYoutube,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaLink,
  FaUnlink,
  FaCompress,
  FaExpand,
  FaListUl,
  FaListOl,
} from "react-icons/fa";
import { TbH1, TbH2, TbH3 } from "react-icons/tb";
import { mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import CodeBlock from "@tiptap/extension-code-block";
import ChessboardLogic from "./chessboardLogic";
import { ChessGame } from "./chessgameComponent";
import { BsFillFileImageFill } from "react-icons/bs";
import { PiGifFill } from "react-icons/pi";

export const editorExtensions = [
  StarterKit.configure({
    bold: false,
    italic: false,
    heading: false,
    bulletList: false,
    orderedList: false,
    listItem: false,
    underline: false,
    link: false,
    codeBlock: false,
  }),
  Bold,
  Italic,
  Underline,
  Heading.extend({
    levels: [1, 2, 3],
    renderHTML({ node, HTMLAttributes }) {
      const level = this.options.levels.includes(node.attrs.level)
        ? node.attrs.level
        : this.options.levels[0];
      const classes = {
        1: "heading-level-1",
        2: "heading-level-2",
        3: "heading-level-3",
      };
      return [
        `h${level}`,
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          class: `${classes[level]}`,
        }),
        0,
      ];
    },
  }).configure({ levels: [1, 2, 3] }),
  Image.configure({
    HTMLAttributes: {
      class: "image-limit",
      onError: "this.style.display='none';", // Hide the image if it fails to load
    },
    inline: true,
    allowBase64: true,
  }),
  Youtube.configure({ HTMLAttributes: { class: "youtube-limit" }, inline: true }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Link.configure({ HTMLAttributes: { class: "link-class" } }),
  BulletList.configure({ HTMLAttributes: { class: "bullet-list" } }),
  OrderedList.configure({ HTMLAttributes: { class: "ordered-list" } }),
  ListItem,
  CodeBlock,
  ChessGame,
];

const Editor = ({ content, setContent, fullScreen, toggleFullScreen }) => {
  const { lightMode } = useContext(AuthContext);

  const [showChessboard, setShowChessboard] = useState(false);

  const imageInputRef = useRef(null);

  const editor = useEditor({
    extensions: editorExtensions,
    content: content || `<p>What's on your mind?</p>`,
    onUpdate: ({ editor }) => {
      setContent(editor.getJSON());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    imageInputRef.current.click();
  };

  const resizeImage = (file, maxSizeKB = 500, maxWidth = 1200, maxHeight = 1200) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const scale = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Try to compress to under maxSizeKB
        let quality = 0.92;
        function tryCompress() {
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          // Remove the prefix to get the actual base64 length
          const base64Length = dataUrl.length - "data:image/jpeg;base64,".length;
          const sizeKB = (base64Length * 3) / 4 / 1024;
          if (sizeKB > maxSizeKB && quality > 0.5) {
            quality -= 0.05;
            tryCompress();
          } else {
            resolve(dataUrl);
          }
        }
        tryCompress();
      };

      img.onerror = reject;
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        if (file.type === "image/gif") {
          // If the file is a GIF, insert it directly without resizing
          const reader = new FileReader();
          reader.onload = (e) => {
            editor.chain().focus().setImage({ src: e.target.result }).run();
          };
          reader.readAsDataURL(file);
        } else {
          // For other image types, resize and compress
          const dataUrl = await resizeImage(file);
          editor.chain().focus().setImage({ src: dataUrl }).run();
        }
      } catch (error) {
        alert("Nahrání obrázku se nezdařilo: " + error.message);
      }
    }
  };

  const addLink = () => {
    const url = prompt("Enter the URL");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const addYoutubeVideo = () => {
    const url = prompt("Enter the Youtube URL");
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const addExternalGif = () => {
    const url = prompt("Enter the URL of the GIF");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleInsertChessGame = ({ moves, white, black, result, defaultMove }) => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: "chessGame",
        attrs: {
          game: {
            moves,
            white,
            black,
            result,
            defaultMove,
          },
        },
      })
      .run();

    setContent(editor.getJSON());
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && event.shiftKey) {
      return;
    } else if (event.key === "Enter") {
      event.preventDefault();
      editor.chain().focus().insertContent("<br /><p></p>").run();
    } else if (event.key === "Backspace") {
      const { state } = editor;
      const { from, to } = state.selection;
      const text = state.doc.textBetween(from - 1, to, " ");

      if (text === "\n") {
        editor
          .chain()
          .focus()
          .deleteRange({ from: from - 1, to })
          .run();
      }
    }
  };

  return (
    <div
      className={`border shadow-md focus:outline-none rounded-md p-5 my-20 w-[90%] flex flex-col items-center ${
        lightMode
          ? "text-stone-800 border-stone-800/50 shadow-black/50 focus:shadow-black bg-stone-300"
          : "text-yellow-100 border-yellow-100/50 shadow-yellow-100/50 focus:shadow-yellow-100"
      }`}>
      <div className="w-full flex flex-col items-center">
        <div
          className={`w-full flex justify-around py-10 border-b ${
            lightMode ? "border-black/20" : "border-yellow-100/20"
          }`}>
          <button
            title="Tučné"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="hover:cursor-pointer text-[2rem]">
            <FaBold />
          </button>
          <button
            title="Kurzíva"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="hover:cursor-pointer text-[2rem]">
            <FaItalic />
          </button>
          <button
            title="Podtržené"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="hover:cursor-pointer text-[2rem]">
            <FaUnderline />
          </button>
          <button
            title="Styl písma 1"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className="hover:cursor-pointer text-[2rem]">
            <TbH1 />
          </button>
          <button
            title="Styl písma 2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="hover:cursor-pointer text-[2rem]">
            <TbH2 />
          </button>
          <button
            title="Styl písma 3"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className="hover:cursor-pointer text-[2rem]">
            <TbH3 />
          </button>
          <button
            title="Zarovnání vlevo"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className="hover:cursor-pointer text-[2rem]">
            <FaAlignLeft />
          </button>
          <button
            title="Zarovnání na střed"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className="hover:cursor-pointer text-[2rem]">
            <FaAlignCenter />
          </button>
          <button
            title="Zarovnání vpravo"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className="hover:cursor-pointer text-[2rem]">
            <FaAlignRight />
          </button>
        </div>
        <div
          className={`w-full flex justify-around py-10 border-b ${
            lightMode ? "border-black/20" : "border-yellow-100/20"
          }`}>
          <button
            title="Šachová partie"
            onClick={() => setShowChessboard(true)}
            className="hover:cursor-pointer text-[2rem]">
            <FaChessBoard
              className={`border rounded-md ${lightMode ? "border-black" : "border-yellow-100"}`}
            />
          </button>
          <button
            title="Seznam s odrážkami"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="hover:cursor-pointer text-[2rem]">
            <FaListUl />
          </button>
          <button
            title="Seznam s číslováním"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="hover:cursor-pointer text-[2rem]">
            <FaListOl />
          </button>
          <button
            title="Přidat odkaz"
            onClick={addLink}
            className="hover:cursor-pointer text-[2rem]">
            <FaLink />
          </button>
          <button
            title="Odebrat odkaz"
            onClick={removeLink}
            className="hover:cursor-pointer text-[2rem]">
            <FaUnlink />
          </button>
          <button
            title="Přidat obrázek"
            onClick={addImage}
            className="hover:cursor-pointer text-[2rem]">
            <FaFileImage />
          </button>
          <button
            title="Přidat Youtube video"
            onClick={addYoutubeVideo}
            className="hover:cursor-pointer text-[2rem]">
            <FaYoutube />
          </button>
          <button
            title="Přidat externí GIF"
            onClick={addExternalGif}
            className="hover:cursor-pointer text-[2rem]">
            <PiGifFill />
          </button>
          <button
            title={fullScreen ? "Zmenšit" : "Zvětšit"}
            onClick={toggleFullScreen}
            className="hover:cursor-pointer text-[2rem]">
            {fullScreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      <input
        type="file"
        name="image"
        id="image"
        ref={imageInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      <EditorContent editor={editor} className="resizable-editor" onKeyDown={handleKeyDown} />

      {showChessboard && (
        <ChessboardLogic
          onInsert={handleInsertChessGame}
          onClose={() => setShowChessboard(false)}
        />
      )}
    </div>
  );
};

export default Editor;
