"use client";
import { Tooltip } from "@mui/material";
import { Trash2 } from "lucide-react";

/**
 * Reusable delete button with built-in trash icon and tooltip.
 *
 * Props:
 * - title: Tooltip title (default: "Delete")
 * - onClick: click handler
 * - className: optional className for styling
 */
const TableDeleteActionButton = ({
  title = "Delete",
  onClick,
  className = "",
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <Tooltip title={title} arrow>
      <button
        onClick={handleClick}
        className={`flex items-center justify-center cursor-pointer text-gray-500 hover:text-red-600 transition-colors${className}`}
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </Tooltip>
  );
};

export default TableDeleteActionButton;
