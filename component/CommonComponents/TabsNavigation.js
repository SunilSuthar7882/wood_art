// "use client";
// import { useRouter, usePathname } from "next/navigation";

// export default function TabsNavigation() {
//   const router = useRouter();
//   const pathname = usePathname();

//   const activeTab = pathname.includes("manage-food")
//     ? "manage"
//     : pathname.includes("recipe")
//     ? "recipe"
//     : "template";

//   const handleTabClick = (tab) => {
//     const newPath =
//       tab === "template"
//         ? "/template-plan"
//         : tab === "manage"
//         ? "/manage-foods"
//         : "/recipe";
//     router.replace(newPath);
//   };

//   return (
//     <div className="flex flex-row gap-4 mb-4 border-b border-gray-200">
//       <button
//         onClick={() => handleTabClick("template")}
//         className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
//           activeTab === "template"
//             ? "border-green-500 text-green-600"
//             : "border-transparent text-gray-500 hover:text-green-600"
//         }`}
//       >
//         Template Plan
//       </button>
//       <button
//         onClick={() => handleTabClick("manage")}
//         className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
//           activeTab === "manage"
//             ? "border-green-500 text-green-600"
//             : "border-transparent text-gray-500 hover:text-green-600"
//         }`}
//       >
//         Manage Food
//       </button>
//       <button
//         onClick={() => handleTabClick("recipe")}
//         className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
//           activeTab === "recipe"
//             ? "border-green-500 text-green-600"
//             : "border-transparent text-gray-500 hover:text-green-600"
//         }`}
//       >
//         Recipes
//       </button>
//     </div>
//   );
// }

"use client";
import { useRouter, usePathname } from "next/navigation";
import CommonLoader from "../CommonLoader";
import Cookies from "js-cookie";

export default function TabsNavigation({ onTabChange, isTabChanged }) {
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = pathname.includes("manage-food")
    ? "manage"
    : pathname.includes("recipe")
    ? "recipe"
    : "template";

  const handleTabClick = (tab) => {
    if (tab !== activeTab) {
      if (typeof isTabChanged === "function") {
        isTabChanged(tab);
      }

      let newPath = "";

      if (tab === "template") {
        newPath = "/template-plan";
      } else if (tab === "manage") {
        newPath = "/manage-foods";
      } else {
        // default: recipe tab
        const editRecipeId = Cookies.get("edit-recipe-id");
        newPath = editRecipeId
          ? `/recipe/edit-recipe/${editRecipeId}`
          : "/recipe";
      }

      router.replace(newPath);
    }
  };

  if (isTabChanged) return <CommonLoader />;
  return (
    <div className="flex flex-row gap-4 pl-4 pr-4 pt-2 ">
      <div className="border-b border-gray-200 w-full">
        <button
          onClick={() => handleTabClick("template")}
          className={`py-2 px-3 text-sm font-medium border-b-2 transition ${
            activeTab === "template"
              ? "border-green-500 text-green-600"
              : "border-transparent text-gray-500 hover:text-green-600"
          }`}
        >
          Template Plan
        </button>
        <button
          onClick={() => handleTabClick("manage")}
          className={`py-2 px-3 text-sm font-medium border-b-2 transition ${
            activeTab === "manage"
              ? "border-green-500 text-green-600"
              : "border-transparent text-gray-500 hover:text-green-600"
          }`}
        >
          Manage Food
        </button>
        <button
          onClick={() => handleTabClick("recipe")}
          className={`py-2 px-3 text-sm font-medium border-b-2 transition ${
            activeTab === "recipe"
              ? "border-green-500 text-green-600"
              : "border-transparent text-gray-500 hover:text-green-600"
          }`}
        >
          Recipes
        </button>
      </div>
    </div>
  );
}
