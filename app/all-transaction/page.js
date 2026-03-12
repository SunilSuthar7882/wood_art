"use client";
import CustomTable from "@/component/CommonComponents/CommonTable";
import { useGetUserDropdownList } from "@/helpers/hooks/customer/getuserdropdownlist";
import { useGetAllPayments } from "@/helpers/hooks/customer/useGetAllPayments";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
const Page = () => {
  const [startAfter, setStartAfter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [startAfterStack, setStartAfterStack] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const LIMIT = 10;
  const {
    data: usegetallpayments,
    isFetching: isFetchingallpayments,
    refetch: refetchallpayments,
    isError: isErrorallpayments,
  } = useGetAllPayments({
    limit: LIMIT,
    start_after: startAfter,
    ...(selectedUserId && { user_id: selectedUserId }),
    ...(startDate && { start_date: startDate }),
  });

  const {
    data: getuserdropdownList,
    isFetching: isFetchinguserdropdownListData,
    refetch: refetchuserdropdownListData,
  } = useGetUserDropdownList();

  const handleUserChange = (event) => {
    setSelectedUserId(event.target.value);
    setTransactions([]);
    setStartAfter("");
    setStartAfterStack([]);
  };

  useEffect(() => {
    const data = usegetallpayments?.data;
    if (data?.transactions) {
      setTransactions(data.transactions);
      setHasMore(data.has_more);
    }
  }, [usegetallpayments]);

  const columns = [
    {
      field: "id",
      headerName: "Transaction ID",
      width: 250,
    },
    {
      field: "customer_name",
      headerName: "Customer Name",
      width: 200,
    },
    {
      field: "customer_email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "amount",
      headerName: "Amount ($)",
      width: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "currency",
      headerName: "Currency",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.row.currency.toUpperCase(),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const status = params.row.status;
        const isSuccess = status === "succeeded";
        return (
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            width={"100%"}
            height={"100%"}
          >
            <Typography
              sx={{
                bgcolor: isSuccess ? "#26923e" : "#e0e0e0",
                p: 0.2,
                borderRadius: "3px",
                color: isSuccess ? "white" : "black",
                px: 1,
              }}
            >
              {status}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "created",
      headerName: "Created Date",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        new Date(params.row.created * 1000).toLocaleDateString("en-GB"),
    },
  ];

  const rows = transactions?.map((txn) => ({
    id: txn?.id,
    customer_name: txn?.customer?.name,
    customer_email: txn?.customer?.email,
    amount: (txn?.amount / 100).toFixed(2),
    currency: txn?.currency,
    status: txn?.status,
    created: txn?.created,
  }));

  const handleNext = () => {
    const nextStartAfter = usegetallpayments?.data?.starting_after;
    if (nextStartAfter) {
      setStartAfterStack((prev) => [...prev, startAfter]);
      setStartAfter(nextStartAfter);
    }
  };

  const handlePrevious = () => {
    const prevStack = [...startAfterStack];
    const prevStartAfter = prevStack.pop() || "";
    setStartAfter(prevStartAfter);
    setStartAfterStack(prevStack);
  };
  return (
    <div className=" flex flex-col h-full w-full p-4">
      <div className="flex items-center justify-between mb-4 h-10">
        <h1 className="text-2xl font-bold mb-0">All Transaction</h1>
        <div>
          <Select
            sx={{
              height: "46px",
              width: "250px",
              backgroundColor: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
              },
            }}
            value={selectedUserId}
            onChange={handleUserChange}
            displayEmpty
          >
            <MenuItem value="">All</MenuItem>
            {getuserdropdownList?.data?.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.full_name}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 shadow-lg transition-all duration-300 h-full flex-1 flex flex-col gap-1 p-4">
        <Paper
          sx={{
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
            flex: 1,
            overflow: "hidden",
          }}
        >
          <CustomTable
            rows={rows}
            columns={columns}
            loading={isFetchingallpayments}
            hideFooter
          />
        </Paper>
        <div className="flex justify-end align-middle gap-2 mt-4">
          <Button
            variant="outlined"
            onClick={handlePrevious}
            disabled={startAfterStack.length === 0}
            sx={{
              minWidth: "40px",
              height: "40px",
              borderRadius: "50%",
              padding: 0,
            }}
          >
            <ArrowBack />
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!hasMore || isFetchingallpayments}
            sx={{
              minWidth: "40px",
              height: "40px",
              borderRadius: "50%",
              padding: 0,
            }}
          >
            <ArrowForward />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
