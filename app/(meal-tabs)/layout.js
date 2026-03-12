// // app/(meal-tabs)/layout.js
// import TabsNavigation from "@/component/CommonComponents/TabsNavigation";

// export default function MealTabsLayout({ children }) {
//   return (
//     <div className="h-full flex flex-1 flex-col p-4">
//       <TabsNavigation />
//       <div className="flex-1 flex flex-col overflow-auto">{children}</div>
//     </div>
//   );
// }




// app/(meal-tabs)/layout.js
"use client";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import TabsNavigation from "@/component/CommonComponents/TabsNavigation";
import CommonLoader from "@/component/CommonLoader";

export default function MealTabsLayout({ children }) {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const [isTabChanged, setIsTabChanged] = useState(false);

  useEffect(() => {
    if (pathname !== previousPath.current) {
      setIsTabChanged(true);
      previousPath.current = pathname;

      // Optional: reset after some time if needed
      setTimeout(() => setIsTabChanged(false), 2000  );
    }
  }, [pathname]);

  // if (isTabChanged) return <CommonLoader />
  return (
    <div className="h-full flex flex-col ">
      <TabsNavigation isTabChanged={isTabChanged} />
      <div className="flex-1 flex flex-col overflow-auto p-4">
        
        {children}</div>
    </div>
  );
}
