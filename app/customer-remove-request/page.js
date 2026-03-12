"use client";
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
  useTheme,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import dayjs from "dayjs";
import {
  useGetCustomerRemoveRequest,
  useUpdateDeleteCustomerStatus,
} from "@/helpers/hooks/mamAdmin/mamAdmin";
import CustomTable from "@/component/CommonComponents/CommonTable";

// Map of styles for plan statuses
const planStyles = {
  pending: {
    color: "warning",
    sx: {
      backgroundColor: "#ffbf681a",
      color: "#FF9800",
      textTransform: "capitalize",
      fontWeight: 600,
      borderRadius: 2,
      "&:hover": {
        backgroundColor: "#ff980033",
      },
    },
  },
  accepted: {
    color: "success",
    sx: {
      backgroundColor: "#14917C1A",
      color: "#00927C",
      textTransform: "capitalize",
      fontWeight: 600,
      borderRadius: 2,
    },
  },
  rejected: {
    color: "error",
    sx: {
      backgroundColor: "#F1416C1A",
      color: "#F1416C",
      textTransform: "capitalize",
      fontWeight: 600,
      borderRadius: 2,
    },
  },
};

// Badge renderer
const StatusBadge = ({ status, onClick, clickable }) => {
  const theme = useTheme();

  const planStyles = {
    pending: {
      color: "warning",
      sx: {
        backgroundColor: theme.palette.warning.light + "1A",
        color: theme.palette.warning.main,
        textTransform: "capitalize",
        fontWeight: 600,
        borderRadius: 2,
        "&:hover": {
          backgroundColor: theme.palette.warning.main + "33",
        },
      },
    },
    accepted: {
      color: "success",
      sx: {
        backgroundColor: theme.palette.success.light + "1A",
        color: theme.palette.success.main,
        textTransform: "capitalize",
        fontWeight: 600,
        borderRadius: 2,
      },
    },
    rejected: {
      color: "error",
      sx: {
        backgroundColor: theme.palette.error.light + "1A",
        color: theme.palette.error.main,
        textTransform: "capitalize",
        fontWeight: 600,
        borderRadius: 2,
      },
    },
  };

  const style = planStyles[status] || { color: "default", sx: {} };
  return (
    <Chip
      label={status}
      color={style.color}
      sx={style.sx}
      onClick={clickable ? onClick : undefined}
      clickable={clickable}
    />
  );
};

// Cell component with dropdown for pending status
const StatusCell = ({ status: initialStatus, id, refetch, mutate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(initialStatus);

  const isPending = currentStatus === "pending";
  const open = Boolean(anchorEl);

  useEffect(() => {
    setCurrentStatus(initialStatus);
  }, [initialStatus]);

  const handleClick = (e) => {
    if (isPending) setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (newStatus) => {
    handleClose();
    mutate(
      { request_id: id, status: newStatus },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  return (
    <>
      <StatusBadge
        status={currentStatus}
        onClick={handleClick}
        clickable={isPending}
      />
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleSelect("accepted")}>Accepted</MenuItem>
        <MenuItem onClick={() => handleSelect("rejected")}>Rejected</MenuItem>
      </Menu>
    </>
  );
};

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeStatus, setActiveStatus] = useState("");
  const [loadingButton, setLoadingButton] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewClick = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const { data, isFetching, refetch } = useGetCustomerRemoveRequest(
    page,
    rowsPerPage,
    activeStatus
  );
  const pageInfo = data?.data?.page_information || {};
  const currentPage = (pageInfo.current_page ?? 1) - 1; // API 1-based → UI 0-based
  const totalRows = pageInfo.total_data ?? 0;

  const { mutate: updateDeleteCustomerStatus, isPending } =
    useUpdateDeleteCustomerStatus();

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "trainer", headerName: "Trainer", width: 240 },
    { field: "customer", headerName: "Customer", width: 240 },
    { field: "customerEmail", headerName: "Customer Email", width: 260 },
    { field: "createdAt", headerName: "Requested At", width: 160 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <StatusCell
          status={params.row.status}
          id={params.row.id}
          // refetch={refetch}
          mutate={updateDeleteCustomerStatus}
        />
      ),
    },
    { field: "updatedAt", headerName: "Last Updated", width: 160 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        params.row.status === "pending" ? (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleViewClick(params.row)}
          >
            View
          </Button>
        ) : null,
    },
  ];

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, activeStatus]);

  const rows =
    data?.data?.page_data?.map((row) => ({
      id: row.id,
      trainer: row.request_sender.full_name,
      customer: row.delete_user.full_name,
      customerEmail: row.delete_user.email,
      createdAt: dayjs(row.createdAt).format("DD/MM/YYYY HH:mm"),
      status: row.status,
      updatedAt: dayjs(row.updatedAt).format("DD/MM/YYYY HH:mm"),
    })) || [];

  return (
    <Box p={2} display="flex" flexDirection="column" height="100%" gap={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography fontSize={24} fontWeight={700}>
          Customer Delete Requests From Trainer
        </Typography>
        <Autocomplete
          options={statusOptions}
          getOptionLabel={(opt) => opt.label}
          value={statusOptions.find((o) => o.value === activeStatus) || null}
          onChange={(_, v) => setActiveStatus(v ? v.value : "")}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select status"
              variant="outlined"
              sx={{
                width: 170,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  borderRadius: 2,
                  overflow: "hidden",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: 2,
                  },
                  height: 46,
                },
              }}
            />
          )}
          isOptionEqualToValue={(opt, val) => opt.value === val?.value}
          clearOnBlur
        />
      </Box>
      <Paper
        sx={{
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 2,
          flex: 1,
          overflow: "hidden",
          // minHeight:"400px",
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
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          disableRowSelectionOnClick
        />
      </Paper>
      <Dialog
        open={isModalOpen}
        onClose={handleModalClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            p: 1.5,
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 1,
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          Confirm Customer Delete Requests From Trainer
          <IconButton
            aria-label="close"
            onClick={handleModalClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0.5 }}>
          <DialogContentText
            sx={{
              fontSize: "0.85rem",
              lineHeight: 1.5,
            }}
          >
            Are you sure you want to process this removal request for:
            <br />
            <strong>Customer:</strong> {selectedRow?.customer} <br />
            <strong>Email:</strong> {selectedRow?.customerEmail} <br />
            <strong>Requested By:</strong> {selectedRow?.trainer}
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{ justifyContent: "flex-end", gap: 1, px: 1.5, pb: 1 }}
        >
          <Button
            variant="contained"
            disabled={loadingButton !== null}
            onClick={() => {
              setLoadingButton("accepted");
              updateDeleteCustomerStatus(
                {
                  request_id: selectedRow?.id,
                  status: "accepted",
                },
                {
                  onSettled: () => {
                    setLoadingButton(null);
                    handleModalClose();
                  },
                }
              );
            }}
            sx={{
              backgroundColor: "#22C55E",
              color: "white",
              textTransform: "capitalize",
              fontWeight: 600,
              borderRadius: 2,
              fontSize: "0.8rem",
              minWidth: 80,
              height: 32,
              "&:hover": {
                backgroundColor: "#16A34A",
              },
            }}
          >
            {loadingButton === "accepted" ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Accept"
            )}
          </Button>

          <Button
            variant="contained"
            disabled={loadingButton !== null}
            onClick={() => {
              setLoadingButton("rejected");
              updateDeleteCustomerStatus(
                {
                  request_id: selectedRow?.id,
                  status: "rejected",
                },
                {
                  onSettled: () => {
                    setLoadingButton(null);
                    handleModalClose();
                  },
                }
              );
            }}
            sx={{
              backgroundColor: "#DC2626",
              color: "white",
              textTransform: "capitalize",
              fontWeight: 600,
              borderRadius: 2,
              fontSize: "0.8rem",
              minWidth: 80,
              height: 32,
              "&:hover": {
                backgroundColor: "#B91C1C",
              },
            }}
          >
            {loadingButton === "rejected" ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Reject"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Page;
