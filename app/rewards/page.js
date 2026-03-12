"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Tooltip,
} from "@mui/material";
import CustomTable from "@/component/CommonComponents/CommonTable";
import { useGetUserRewards } from "@/helpers/hooks/rewards/getuserrewards";
import { userGetReferralLink } from "@/helpers/hooks/referrallink/usergetreferrallink";
import { Routes } from "@/config/routes";
import { motion } from "framer-motion";

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [paidStatus, setPaidStatus] = useState("all");
  const [referralLink, setreferralLink] = useState(null);
  const [configuration, setconfiguration] = useState(null);
  const [isTrainer, setIsTrainer] = useState(false);

  const {
    data: userreferralLink,
    isFetching: isFetchinguserreferralLink,
    refetch: refetchuserreferralLink,
  } = userGetReferralLink();
  const [copied, setCopied] = useState(false);
  const [isCustomer, setIsCustomer] = useState(true);
  const { data, isFetching, refetch } = useGetUserRewards(
    page,
    rowsPerPage,
    searchValue,
    paidStatus
  );

  const pageInfo = data?.data?.page_information || {};
  const currentPage = (pageInfo.current_page ?? 1) - 1; // API 1-based → UI 0-based
  const totalRows = pageInfo.total_data ?? 0;

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, searchValue]);

  const columns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      width: 80,
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    { field: "rewardAmount", headerName: "Reward Amount", width: 150 },
    // { field: "status", headerName: "Status", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const value = params.value;
        let style = {
          border: "1px solid gray",
          borderRadius: "10px",
          padding: "2px 8px",
          fontSize: "0.85rem",
          textAlign: "center",
          color: "gray",
        };

        if (value === "paid") {
          style = {
            ...style,
            border: "1px solid green",
            color: "green",
            fontWeight: "500",
          };
        }

        return <span style={style}>{value?.toUpperCase()}</span>;
      },
    },
    { field: "earnedDate", headerName: "Earned Date", width: 200 },
    { field: "referredName", headerName: "Referred Name", width: 200 },
    { field: "referredEmail", headerName: "Referred Email", width: 250 },
    { field: "referredRole", headerName: "Referred Role", width: 150 },
  ];

  useEffect(() => {
    if (userreferralLink) {
      setreferralLink(userreferralLink?.data?.referralLink);
      setconfiguration(userreferralLink?.data?.configuration);
    }
  }, [userreferralLink]);
  // const displayReferralLink = referralLink
  //   ? `${referralLink}${isCustomer ? "/customer" : isTrainer ? "/trainer" : ""}`
  //   : "";
  let displayReferralLink = referralLink || "";
  if (referralLink && isCustomer) {
    const [base, query] = referralLink.split("?");
    // displayReferralLink = `${base}${Routes.customer}?${query}`;
    const cleanedBase = base.replace(
      Routes.register,
      Routes.customersubscriptions
    );
    displayReferralLink = `${cleanedBase}?${query}`;
  } else if (referralLink && isTrainer) {
    const [base, query] = referralLink.split("?");
    const cleanedBase = base.replace(Routes.register, Routes.subscriptions);
    // const cleanedBase = base.replace("/register", Routes.subscriptions);

    displayReferralLink = `${cleanedBase}?${query}`;
    // const [base, query] = referralLink.split("?");
    // displayReferralLink = `${base}${Routes.subscriptions}?${query}`;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayReferralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const rows =
    data?.data?.page_data?.map((row) => ({
      id: row.id,
      rewardAmount: row.reward_amount,
      status: row.status,
      earnedDate: new Date(row.created_at).toLocaleString(), // formatted date
      referredName: row.referred_user?.full_name || "-",
      referredEmail: row.referred_user?.email || "-",
      referredRole: row.referred_user?.role || "-",
    })) || [];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleInputClick = (e) => {
    e.target.select();
  };

  return (
    // <div className="h-full flex flex-col w-full p-2">
    //   <div className="flex items-center justify-between mb-2 h-10">
    //     <h1 className="ml-2 text-2xl font-bold mb-0">Rewards</h1>
    //     <div className="flex items-center font-semibold text-lg">
    //       Sort:
    //       <Select
    //         sx={{
    //           height: "35px",
    //           width: "auto",
    //           backgroundColor: "white",
    //           "& .MuiOutlinedInput-notchedOutline": {
    //             borderRadius: "8px",
    //           },
    //         }}
    //         onChange={(e) => {
    //           setPaidStatus(e.target.value);
    //         }}
    //         value={paidStatus} // "name" will be default
    //       >
    //         <MenuItem value="all">All</MenuItem>
    //         <MenuItem value="paid">Paid</MenuItem>
    //         <MenuItem value="unpaid">Un-paid</MenuItem>
    //       </Select>
    //     </div>
    //   </div>
    //   <div className="flex flex-col mb-3 w-full">
    //     {" "}
    //     {isFetching ? (
    //       <div className="flex flex-col w-full">
    //         <div className="rounded-2xl shadow-none bg-white border border-gray-200 p-2 flex flex-col w-full md:w-auto animate-pulse">
    //           <h2 className="h-6 bg-gray-300 rounded w-32 mb-2"></h2>
    //           <p className="h-6 bg-gray-300 rounded w-3/4 mb-1"></p>
    //           <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
    //           <div className="flex items-center space-x-2">
    //             <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
    //             <div className="h-10 w-20 bg-gray-300 rounded-lg"></div>
    //           </div>
    //         </div>
    //       </div>
    //     ) : (
    //       <Card className="rounded-2xl shadow-md bg-white border border-gray-200 p-4 flex flex-1 flex-col w-full max-h-[200px]">
    //         <h2 className="text-xl font-semibold text-gray-800">
    //           Invite & Earn
    //         </h2>
    //         {/* <p className="text-sm text-gray-600 mt-1">
    //                 Invite your friends and they’ll get{" "}
    //                 <span className="text-green-600 font-bold">$5</span> when they sign
    //                 up.
    //               </p> */}
    //         <p className="text-sm text-gray-600 mt-1">
    //           Invite your friends{" "}
    //           {isCustomer ? "as a customer " : isTrainer ? "as a trainer " : ""}
    //           and you will get{" "}
    //           <span className="text-green-600 font-bold">
    //             $
    //             {isCustomer
    //               ? configuration?.referral_customer_reward ?? 0
    //               : isTrainer
    //               ? configuration?.referral_trainer_reward ?? 0
    //               : 0}
    //           </span>{" "}
    //           when they sign up.
    //         </p>

    //         <div className="mt-3 flex space-x-6">
    //           <label className="flex items-center space-x-2 text-sm text-gray-700">
    //             <input
    //               type="checkbox"
    //               checked={isCustomer}
    //               onChange={() => {
    //                 setIsCustomer(!isCustomer);
    //                 if (!isCustomer) setIsTrainer(false);
    //               }}
    //               className="accent-green-600"
    //             />
    //             <span>Customer</span>
    //           </label>

    //           <label className="flex items-center space-x-2 text-sm text-gray-700">
    //             <input
    //               type="checkbox"
    //               checked={isTrainer}
    //               onChange={() => {
    //                 setIsTrainer(!isTrainer);
    //                 if (!isTrainer) setIsCustomer(false);
    //               }}
    //               className="accent-green-600"
    //             />
    //             <span>Trainer</span>
    //           </label>
    //         </div>
    //         <div className="mt-4 flex items-center space-x-2 max-w-2xl">
    //           <input
    //             className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm"
    //             // value={referralLink}
    //             value={displayReferralLink}
    //             readOnly
    //           />
    //           <button
    //             onClick={handleCopy}
    //             className="bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm"
    //           >
    //             {copied ? "Copied!" : "Copy"}
    //           </button>
    //         </div>
    //       </Card>
    //     )}
    //   </div>
    //   {/* <div className="mb-3">
    //     <input
    //       type="text"
    //       placeholder="Search rewards..."
    //       className="bg-transparent border rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
    //       value={searchValue}
    //       onChange={(e) => setSearchValue(e.target.value)}
    //     />
    //   </div> */}

    //   <Paper
    //     sx={{
    //       border: "1px solid",
    //       borderColor: "grey.300",
    //       borderRadius: 2,
    //       flex: 1,
    //       overflow: "auto",
    //     }}
    //   >
    //     <CustomTable
    //       rows={rows}
    //       columns={columns}
    //       loading={isFetching}
    //       pagination={{
    //         page: currentPage,
    //         rowsPerPage,
    //         totalRows,
    //       }}
    //       onPageChange={(newPage) => setPage(newPage)}
    //       onRowsPerPageChange={(newRows) => setRowsPerPage(newRows)}
    //       hideFooter={false}
    //       containerSx={{ overflow: "auto" }}
    //     />
    //   </Paper>
    // </div>

    <div className="h-full flex flex-col w-full p-2">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 h-12">
        <motion.h1
          className="ml-2 text-2xl font-bold text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Rewards
        </motion.h1>
        <div className="flex items-center font-semibold text-lg">
          <span className="mr-2">Sort:</span>
          <Select
            sx={{
              height: "38px",
              minWidth: "120px",
              backgroundColor: "white",
              borderRadius: "8px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.300",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "emerald.500",
              },
              transition: "all 0.2s ease-in-out",
            }}
            onChange={(e) => setPaidStatus(e.target.value)}
            value={paidStatus}
            aria-label="Sort rewards by status"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="unpaid">Un-paid</MenuItem>
          </Select>
        </div>
      </div>
    
      {/* Referral Card Section */}
      <motion.div
        className="flex flex-col mb-6 w-full"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {isFetching ? (
          <div className="flex flex-col w-full items-center justify-center py-8">
            <CircularProgress sx={{ color: "emerald.500" }} />
            <p className="mt-2 text-gray-600">Loading rewards...</p>
          </div>
        ) : (
          <Card className="rounded-2xl shadow-md bg-white border border-gray-200 p-6 flex flex-1 flex-col w-full max-h-[250px] hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Invite & Earn
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Invite your friends{" "}
              {isCustomer ? "as a customer " : isTrainer ? "as a trainer " : ""}
              and you will get{" "}
              <span className="text-emerald-600 font-bold">
                $
                {isCustomer
                  ? configuration?.referral_customer_reward ?? 0
                  : isTrainer
                  ? configuration?.referral_trainer_reward ?? 0
                  : 0}
              </span>{" "}
              when they sign up.
            </p>

            <div className="mt-3 flex space-x-6">
              <Tooltip title="Invite as a customer to earn rewards">
                <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCustomer}
                    onChange={() => {
                      setIsCustomer(!isCustomer);
                      if (!isCustomer) setIsTrainer(false);
                    }}
                    className="accent-emerald-600 h-5 w-5 transition-transform duration-200 hover:scale-110"
                    aria-label="Invite as customer"
                  />
                  <span>Customer</span>
                </label>
              </Tooltip>

              <Tooltip title="Invite as a trainer to earn rewards">
                <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTrainer}
                    onChange={() => {
                      setIsTrainer(!isTrainer);
                      if (!isTrainer) setIsCustomer(false);
                    }}
                    className="accent-emerald-600 h-5 w-5 transition-transform duration-200 hover:scale-110"
                    aria-label="Invite as trainer"
                  />
                  <span>Trainer</span>
                </label>
              </Tooltip>
            </div>

            <div className="mt-4 flex items-center space-x-3 max-w-2xl">
              <input
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all duration-200 cursor-text"
                value={displayReferralLink}
                readOnly
                onClick={handleInputClick}
                aria-label="Referral link"
              />
              <Tooltip title={copied ? "Link copied!" : "Copy referral link"}>
                <motion.button
                  onClick={handleCopy}
                  className="bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                  whileTap={{ scale: 0.95 }}
                  aria-label={copied ? "Copied" : "Copy referral link"}
                >
                  {copied ? "Copied!" : "Copy"}
                </motion.button>
              </Tooltip>
            </div>
          </Card>
        )}
      </motion.div>

      {/* Table Section */}
      <motion.div
        className="flex flex-1"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper
          sx={{
            display: "flex",
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
            flex: 1,
            overflow: "auto",
            "&:hover": {
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            },
            transition: "box-shadow 0.3s ease-in-out",
          }}
        >
          <CustomTable
            rows={rows}
            columns={columns}
            loading={isFetching}
            pagination={{
              page: currentPage,
              rowsPerPage,
              totalRows,
            }}
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(newRows) => setRowsPerPage(newRows)}
            hideFooter={false}
            containerSx={{ overflow: "auto" }}
          />
        </Paper>
      </motion.div>
    </div>
  );
};

export default Page;
