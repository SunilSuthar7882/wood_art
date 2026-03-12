"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { User, GraduationCap, Car, UserPlus, Receipt } from "lucide-react"; // Example icons
import ReferralConfigurations from "./ReferralConfigurations";
import ReferralListDetails from "./ReferralListDetails";
import ReferralTransactions from "./ReferralTransactions";

const Page = () => {
  const [tab, setTab] = useState("ReferralConfigurations");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        height: "100%",
        width: "100%",
      }}
    >
      {/* Tab Header */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={(e, newTab) => setTab(newTab)}
          textColor="inherit"
          indicatorColor="primary"
          TabIndicatorProps={{
            style: { height: 2, backgroundColor: "#10b981" },
          }}
          sx={{
            minHeight: "32px",
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              minHeight: "32px",
              paddingTop: 0,
              paddingBottom: 0,
              p: 1.5,
              borderRadius: 2,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(16,185,129,0.08)",
              },
            },
          }}
        >
          <Tab
            icon={<GraduationCap size={18} />}
            iconPosition="start"
            label="Referral Configurations"
            value="ReferralConfigurations"
          />
          <Tab
            icon={<UserPlus size={18} />}
            iconPosition="start"
            label="Referral"
            value="Referral"
          />
          <Tab
            icon={<Receipt size={18} />}
            iconPosition="start"
            label="Referral Transactions"
            value="ReferralTransactions"
          />
          {/* <Tab
            icon={<User size={18} />}
            iconPosition="start"
            label="Customer Referrals"
            value="customer"
          />

          <Tab
            icon={<Car size={18} />}
            iconPosition="start"
            label="Driver Referrals"
            value="driver"
          /> */}
        </Tabs>
      </Box>
      <Box flex={1} overflow={"auto"}>
        {tab === "ReferralConfigurations" && <ReferralConfigurations />}
        {tab === "Referral" && <ReferralListDetails />}
        {tab === "ReferralTransactions" && <ReferralTransactions />}
        {/* {tab === "customer" && (
          <Typography variant="body1">
            📢 Invite your friends as customers and earn rewards when they join!
          </Typography>
        )}

        {tab === "driver" && (
          <Typography variant="body1">
            🚗 Invite drivers and earn extra cash for every successful signup.
          </Typography>
        )} */}
      </Box>
    </Box>
  );
};
export default Page;
// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Container,
//   Paper,
//   Snackbar,
//   Typography,
//   Alert,
//   Tab,
//   Tabs,
//   TextField,
//   IconButton,
//   DialogContent,
//   DialogTitle,
//   Dialog,
// } from "@mui/material";
// import { User, GraduationCap } from "lucide-react";
// import { useGetSignUpRequest } from "@/helpers/hooks/mamAdmin/mamAdmin";
// import CustomTable from "@/component/CommonComponents/CommonTable";
// import { Close, People } from "@mui/icons-material";
// import TrainerReferralDetails from "./TrainerReferralDetails";
// import CustomerReferralDetails from "./CustomerReferralDetails";
// import dayjs from "dayjs";

// const Referrals = () => {
//   const [dateRange, setDateRange] = useState("30");
//   const [rows, setRows] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 0,
//     rowsPerPage: 10,
//     totalRows: 0,
//   });
//   const [tab, setTab] = useState("customer");
//   const [notification, setNotification] = useState(null);
//   const { data, isFetching, refetch } = useGetSignUpRequest(tab);
//   const [customerRewards, setCustomerRewards] = useState({
//     referrer: "",
//     referee: "",
//   });
//   const [trainerRewards, setTrainerRewards] = useState({
//     referrer: "",
//     referee: "",
//   });
//   const [selectedId, setSelectedId] = useState(null);
//   const [isCustomerModalOpen, setIsCusomerModalOpen] = useState(false);
//   const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
//   const [customersError, setCustomersError] = useState(null);
//   const [trainersError, setTrainersError] = useState(null);
//   const end_date = dayjs().endOf("day").format("YYYY-MM-DD");
//   const start_date = dayjs()
//     .subtract(Number(dateRange), "day")
//     .startOf("day")
//     .format("YYYY-MM-DD");

//   useEffect(() => {
//     if (tab) {
//       refetch();
//     }
//   }, [tab, refetch]);

//   const columns = [
//     { field: "name", headerName: "Full Name", flex: 1 },
//     { field: "email", headerName: "Email", flex: 1 },
//     { field: "phone", headerName: "Phone Number", flex: 1 },
//     { field: "totalreferrals", headerName: "Total Referrals", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 0.5,
//       sortable: false,
//       filterable: false,
//       renderCell: (params) => {
//         const row = params.row;
//         return (
//           <Button
//             variant="outlined"
//             color="primary"
//             size="small"
//             onClick={() => handleViewClick(row)}
//           >
//             View
//           </Button>
//         );
//       },
//     },
//   ];
//   const handleViewClick = (row) => {
//     setSelectedId(row.id);
//     if (row.role === "customer") {
//       setIsCusomerModalOpen(true);
//     } else if (row.role === "trainer") {
//       setIsTrainerModalOpen(true);
//     }
//   };

//   useEffect(() => {
//     if (data?.data?.page_data) {
//       const formattedRows = data.data.page_data.map((item) => ({
//         id: item.id,
//         role: item.role,
//         name: item.full_name || "N/A",
//         email: item.email || "N/A",
//         phone: item.phone_number || "N/A",
//       }));

//       setRows(formattedRows);

//       setPagination((prev) => ({
//         ...prev,
//         totalRows: data.data.page_information?.total_data || 0,
//       }));
//     }
//   }, [data]);

//   const handleRowClick = (params) => {
//     const row = params.row;

//     if (row?.id && Number.isInteger(row.id)) {
//       setSelectedId(row.id);

//       if (row.role === "customer") {
//         setIsCusomerModalOpen(true);
//       } else if (row.role === "trainer") {
//         setIsTrainerModalOpen(true);
//       }
//     }
//   };
//   const handleCustomersClose = () => {
//     setIsCusomerModalOpen(false);
//     setSelectedId(null);
//   };
//   const handleTrainersClose = () => {
//     setIsTrainerModalOpen(false);
//     setSelectedId(null);
//   };

//   const handleRewardChange = (e, role, type) => {
//     const value = e.target.value;
//     if (role === "customer") {
//       setCustomerRewards((prev) => ({ ...prev, [type]: value }));
//     } else {
//       setTrainerRewards((prev) => ({ ...prev, [type]: value }));
//     }
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           bgcolor: "linear-gradient(to right bottom, #10b981, #047857)",
//         }}
//       >
//         <Container
//           maxWidth={false}
//           disableGutters
//           sx={{
//             backgroundColor: "#f4f5f8",
//             width: "100%",
//             p: 2,
//           }}
//         >
//           <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
//             <Tabs
//               value={tab}
//               onChange={(e, newTab) => setTab(newTab)}
//               textColor="inherit"
//               indicatorColor="primary"
//               TabIndicatorProps={{
//                 style: { height: 2, backgroundColor: "#10b981" },
//               }}
//               sx={{
//                 minHeight: "32px",
//                 "& .MuiTab-root": {
//                   textTransform: "none",
//                   fontSize: "0.95rem",
//                   fontWeight: 500,
//                   minHeight: "32px",
//                   paddingTop: 0,
//                   paddingBottom: 0,
//                   p: 1.5,
//                   borderRadius: 2,
//                   transition: "all 0.2s ease-in-out",
//                 },
//               }}
//             >
//               <Tab
//                 icon={<User size={18} />}
//                 iconPosition="start"
//                 label="Customer Referrals"
//                 value="customer"
//               />
//               <Tab
//                 icon={<GraduationCap size={18} />}
//                 iconPosition="start"
//                 label="Trainer Referrals"
//                 value="trainer"
//               />
//             </Tabs>
//           </Box>
//         </Container>
//       </Box>
//     </>
//   );
// };

// export default Referrals;
