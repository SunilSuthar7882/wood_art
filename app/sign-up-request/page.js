
"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Snackbar,
  Typography,
  Alert,
  Tab,
  Tabs,
} from "@mui/material";
import { User, GraduationCap } from "lucide-react";
import { useGetSignUpRequest } from "@/helpers/hooks/mamAdmin/mamAdmin";
import CustomTable from "@/component/CommonComponents/CommonTable";
import SignUpDetailsView from "./SignUpDetailsView";
import TrainerDetailsView from "./TrainerDetailsView";

const SignUpRequest = () => {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    totalRows: 0,
  });
  const [tab, setTab] = useState("trainer");
  const [notification, setNotification] = useState(null);
  const { data, isFetching, refetch } = useGetSignUpRequest(tab);
  const [selectedId, setSelectedId] = useState(null);
  const [isCustomerModalOpen, setIsCusomerModalOpen] = useState(false);
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);

  useEffect(() => {
    if (tab) {
      refetch();
    }
  }, [tab, refetch]);

  const columns = [
    { field: "name", headerName: "Full Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleViewClick(row)}
          >
            View
          </Button>
        );
      },
    },
  ];
  const handleViewClick = (row) => {
    setSelectedId(row.id);
    if (row.role === "customer") {
      setIsCusomerModalOpen(true);
    } else if (row.role === "trainer") {
      setIsTrainerModalOpen(true);
    }
  };

  useEffect(() => {
    if (data?.data?.page_data) {
      const formattedRows = data.data.page_data.map((item) => ({
        id: item.id,
        role: item.role,
        name: item.full_name || "N/A",
        email: item.email || "N/A",
        phone: item.phone_number || "N/A",
      }));

      setRows(formattedRows);

      setPagination((prev) => ({
        ...prev,
        totalRows: data.data.page_information?.total_data || 0,
      }));
    }
  }, [data]);

  const handleRowClick = (params) => {
    const row = params.row;

    if (row?.id && Number.isInteger(row.id)) {
      setSelectedId(row.id);

      if (row.role === "customer") {
        setIsCusomerModalOpen(true);
      } else if (row.role === "trainer") {
        setIsTrainerModalOpen(true);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: "linear-gradient(to right bottom, #10b981, #047857)",
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            backgroundColor: "#f4f5f8",
            width: "100%",
            p: 2,
          }}
        >
          <Box>
            <Typography
              sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
              color="text.primary"
            >
              Signup Requests
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ py: 1, fontSize: "0.875rem", lineHeight: 1.5 }}
            >
              Manage customer and trainer signups separately
            </Typography>
          </Box>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
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
                },
              }}
            >
               <Tab
                icon={<GraduationCap size={18} />}
                iconPosition="start"
                label="Trainer Signup's"
                value="trainer"
              />
              {/* <Tab
                icon={<User size={18} />}
                iconPosition="start"
                label="Customer Signup's"
                value="customer"
              /> */}
             
            </Tabs>
          </Box>

          {/* Signup Section */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 4,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h5">📋</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {tab === "customer" ? "Customer" : "Trainer"} Signup Requests
                </Typography>
              </Box>
            </Box>

            {isFetching ? (
              <Paper
                sx={{
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <CustomTable
                  columns={columns}
                  rows={rows}
                  loading={isFetching}
                  hideFooter={true}
                />
              </Paper>
            ) : rows.length === 0 ? (
              <Box textAlign="center" py={6}>
                <Typography variant="h2">🎉</Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  All Caught Up!
                </Typography>
                <Typography color="text.secondary">
                  No pending signups right now.
                </Typography>
              </Box>
            ) : (
              <Paper
                sx={{
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <CustomTable
                  columns={columns}
                  rows={rows}
                  loading={false}
                  hideFooter={true}
                  onRowClick={handleRowClick}
                />
              </Paper>
            )}
          </Paper>

          {/* Snackbar */}
          <Snackbar
            open={!!notification}
            autoHideDuration={4000}
            onClose={() => setNotification(null)}
          >
            <Alert severity={notification?.type || "info"}>
              {notification?.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
      <SignUpDetailsView
        open={isCustomerModalOpen}
        onClose={() => {
          setIsCusomerModalOpen(false);
        }}
        signupId={selectedId}
      />
      <TrainerDetailsView
        open={isTrainerModalOpen}
        onClose={() => {
          setIsTrainerModalOpen(false);
        }}
        signupId={selectedId}
      />
    </>
  );
};

export default SignUpRequest;

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
// } from "@mui/material";
// import { User, GraduationCap } from "lucide-react";
// import { useGetSignUpRequest } from "@/helpers/hooks/mamAdmin/mamAdmin";
// import CustomTable from "@/component/CommonComponents/CommonTable";
// import SignUpDetailsView from "./SignUpDetailsView";
// import TrainerDetailsView from "./TrainerDetailsView";

// const SignUpRequest = () => {
//   const [rows, setRows] = useState([]);
//   const [pagination, setPagination] = useState({
//     page: 0,
//     rowsPerPage: 10,
//     totalRows: 0,
//   });
//   const [tab, setTab] = useState("Trainer");
//   const [notification, setNotification] = useState(null);
//   const { data, isFetching, refetch } = useGetSignUpRequest("trainer");
//   const [selectedId, setSelectedId] = useState(null);
//   const [isCustomerModalOpen, setIsCusomerModalOpen] = useState(false);
//   const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);

//   // useEffect(() => {
//   //   if (tab) {
//   //     refetch();
//   //   }
//   // }, [tab, refetch]);

//   const columns = [
//     { field: "name", headerName: "Full Name", flex: 1 },
//     { field: "email", headerName: "Email", flex: 1 },
//     { field: "phone", headerName: "Phone Number", flex: 1 },
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
//           <Box>
//             <Typography
//               sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
//               color="text.primary"
//             >
//               Signup Requests
//             </Typography>
//             <Typography
//               color="text.secondary"
//               sx={{ py: 1, fontSize: "0.875rem", lineHeight: 1.5 }}
//             >
//               Manage customer and trainer signups separately
//             </Typography>
//           </Box>
//           {/* Tabs */}
//           {/* <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
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
//                 label="Customer Signup's"
//                 value="customer"
//               />
//               <Tab
//                 icon={<GraduationCap size={18} />}
//                 iconPosition="start"
//                 label="Trainer Signup's"
//                 value="trainer"
//               />
//             </Tabs>
//           </Box> */}

//           {/* Signup Section */}
//           <Paper
//             sx={{
//               p: 2,
//               borderRadius: 4,
//             }}
//           >
//             <Box
//               display="flex"
//               justifyContent="space-between"
//               alignItems="center"
//               mb={4}
//             >
//               <Box display="flex" alignItems="center" gap={2}>
//                 <Typography variant="h5">📋</Typography>
//                 <Typography variant="h6" fontWeight="bold">
//                  Signup Requests
//                   {/* {tab === "customer" ? "Customer" : "Trainer"} Signup Requests */}
//                 </Typography>
//               </Box>
//             </Box>

//             {isFetching ? (
//               <Paper
//                 sx={{
//                   border: "1px solid",
//                   borderColor: "grey.300",
//                   borderRadius: 2,
//                   overflow: "hidden",
//                 }}
//               >
//                 <CustomTable
//                   columns={columns}
//                   rows={rows}
//                   loading={isFetching}
//                   hideFooter={true}
//                 />
//               </Paper>
//             ) : rows.length === 0 ? (
//               <Box textAlign="center" py={6}>
//                 <Typography variant="h2">🎉</Typography>
//                 <Typography variant="h5" fontWeight="bold" color="primary.main">
//                   All Caught Up!
//                 </Typography>
//                 <Typography color="text.secondary">
//                   No pending signups right now.
//                 </Typography>
//               </Box>
//             ) : (
//               <Paper
//                 sx={{
//                   border: "1px solid",
//                   borderColor: "grey.300",
//                   borderRadius: 2,
//                   overflow: "hidden",
//                 }}
//               >
//                 <CustomTable
//                   columns={columns}
//                   rows={rows}
//                   loading={false}
//                   hideFooter={true}
//                   onRowClick={handleRowClick}
//                 />
//               </Paper>
//             )}
//           </Paper>

//           {/* Snackbar */}
//           <Snackbar
//             open={!!notification}
//             autoHideDuration={4000}
//             onClose={() => setNotification(null)}
//           >
//             <Alert severity={notification?.type || "info"}>
//               {notification?.message}
//             </Alert>
//           </Snackbar>
//         </Container>
//       </Box>
//       <SignUpDetailsView
//         open={isCustomerModalOpen}
//         onClose={() => {
//           setIsCusomerModalOpen(false);
//         }}
//         signupId={selectedId}
//       />
//       <TrainerDetailsView
//         open={isTrainerModalOpen}
//         onClose={() => {
//           setIsTrainerModalOpen(false);
//         }}
//         signupId={selectedId}
//       />
//     </>
//   );
// };

// export default SignUpRequest;

