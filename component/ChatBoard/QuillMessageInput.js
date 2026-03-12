"use client";

import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import { Box } from "@mui/material";

const QuillMessageInput = ({ input, onChange }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (editorRef.current && !quillRef.current) {
      import("quill").then(({ default: Quill }) => {
        quillRef.current = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Type your message...",
          modules: {
            toolbar: false,
            clipboard: {
              matchVisual: false,
            },
          },
        });

        if (input && !quillRef.current.root.innerHTML) {
          quillRef.current.root.innerHTML = input;
        }

        quillRef.current.on("text-change", () => {
          onChange(quillRef.current.root.innerHTML);
        });
        
      });
    }
  }, [input, onChange]);

   useEffect(() => {
    if (quillRef.current && input === "") {
      quillRef.current.setContents([]);
    }
  }, [input]);

  return (
    <Box
      sx={{
        border: "1px solid #E0E0E0",
        borderRadius: "10px",
        "&:focus-within": {
          borderColor: "#109A4E",
          boxShadow: "0 0 0 2px rgba(16, 154, 78, 0.2)",
        },
        transition: "all 0.2s ease",
        ".ql-editor": {
          minHeight: "100px",
          padding: "8px",
          fontFamily: "inherit",
          fontSize: "1rem",
        },
        ".ql-container": {
          border: "none",
        },
      }}
    >
      <div ref={editorRef} />
    </Box>
  );
};

export default QuillMessageInput;
