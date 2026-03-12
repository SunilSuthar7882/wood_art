"use client";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import { Pencil } from "lucide-react"; // or wherever your icons are from

/**
 * Reusable table action icon for DataGrid cells.
 *
 * Props:
 * - title: Tooltip title
 * - icon: JSX element (icon component). Defaults to Pencil icon.
 * - onClick: optional click handler
 * - href: optional string to render a Next.js Link
 * - className: optional className for styling
 */


// const TableEditActionIcon = ({
//   title = "Edit",
//   icon = <Pencil className="w-5 h-5" />,
//   onClick,
//   href,
//   className = "",
// }) => {
//   const handleClick = (e) => {
//     e.stopPropagation();
//     onClick?.(e);
//   };

//   const content = (
//     <span
//       onClick={handleClick}
//       className={`flex items-center justify-center cursor-pointer text-gray-500 hover:text-green-600 transition-colors ${className}`}
//     >
//       {icon}
//     </span>
//   );

//   return (
//     <Tooltip title={title} arrow>
//       {href ? (
//         <Link href={href} onClick={handleClick}>
//           {content}
//         </Link>
//       ) : (
//         content
//       )}
//     </Tooltip>
//   );
// };

// export default TableEditActionIcon;


const TableEditActionIcon = ({
  title = "Edit",
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
        className={`flex items-center justify-center cursor-pointer text-gray-500 hover:text-green-600 transition-colors${className}`}
      >
        <Pencil className="w-5 h-5" />
      </button>
      
    </Tooltip>
  );
};

export default TableEditActionIcon;
