import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const ChatWriter = ({
  value = "",
  onChange,
  placeholder = "Write a message...",
}) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [
            ["bold", "italic", "blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
          ],
        },
      });

      quillRef.current.root.innerHTML = value;

      quillRef.current.on("text-change", () => {
        const html = quillRef.current.root.innerHTML;
        onChange?.(html);
      });
    }
  }, [onChange, placeholder, value]);

  return (
    <div
      style={{
        border: "1px solid #E0E0E0",
        borderRadius: "10px",
        padding: "8px",
        minHeight: "100px",
        fontSize: "1rem",
      }}
    >
      <div ref={editorRef} />
    </div>
  );
};

export default ChatWriter;
