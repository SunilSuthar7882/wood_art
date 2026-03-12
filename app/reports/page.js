// "use client";

// import ReportsTab from "./ReportPage";

// const Dashboard = () => {
//   return (
//     <div className="h-full flex-1 overflow-auto">
//       <ReportsTab />
//     </div>
//   );
// };

// export default Dashboard;

// app/reports/page.js
"use client";

import dynamic from "next/dynamic";

const ReportsTab = dynamic(() => import("./ReportPage"), { ssr: false });

const Dashboard = () => {
  return (
    <div className="h-full flex-1 overflow-auto">
      <ReportsTab />
    </div>
  );
};

export default Dashboard;

