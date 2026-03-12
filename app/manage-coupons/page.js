"use client";
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Copy,
  User,
  GraduationCap,
  Tag,
  ClipboardCheck,
} from "lucide-react";
import {
  useAddStripeCoupon,
  useAddStripePromo,
  useDeleteStripeCoupon,
  useGetStripeCoupons,
} from "@/helpers/hooks/mamAdmin/mamAdmin";
import CommonTable from "@/component/CommonComponents/CommonTable";
import DeleteConfirmationModal from "@/component/DeleteConfirmationModal";
import { Typography, Tabs, Tab, Badge } from "@mui/material";
import TableDeleteActionButton from "@/component/CommonComponents/TableDeleteActionButton";

const Page = () => {
  const [mainTab, setMainTab] = useState("customer");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [openPromoModal, setOpenPromoModal] = useState(false);
  const [fieldToggles, setFieldToggles] = useState({
    maxRedemptions: false,
    redeemBy: false,
    customer: false,
    firstTimeTransaction: false,
    minimumAmount: false,
  });

  const resetFieldToggles = () => {
    setFieldToggles({
      maxRedemptions: false,
      redeemBy: false,
      customer: false,
      minimumAmount: false,
    });
  };

  const [couponCounts, setCouponCounts] = useState({
    customer: 0,
    trainer: 0,
  });

  const { data, isFetching } = useGetStripeCoupons(mainTab);
  const currentCoupons = Array.isArray(data?.data) ? data.data : [];
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      setCouponCounts((prev) => ({
        ...prev,
        [mainTab]: data.data.length,
      }));
    }
  }, [data, mainTab]);

  const [errors, setErrors] = useState({
    name: false,
    type: false,
    value: false,
    durationInMonths: false,
    code: false,
    minimum_amount: false,
  });

  const [newCoupon, setNewCoupon] = useState({
    name: "",
    type: "percent_off",
    value: "",
    duration: "forever",
    durationInMonths: "",
    maxRedemptions: "",
    redeemBy: "",
    customer: "",
    restrictions: {
      first_time_transaction: false,
      minimum_amount: "",
      minimum_amount_currency: "usd",
    },
  });

  const resetNewCoupon = () => {
    setNewCoupon({
      name: "",
      type: "percent_off",
      value: "",
      duration: "forever",
      durationInMonths: "",
      maxRedemptions: "",
      redeemBy: "",
      customer: "",
      restrictions: {
        first_time_transaction: false,
        minimum_amount: "",
        minimum_amount_currency: "usd",
      },
    });
  };

  const getCurrentCoupons = () => {
    return Array.isArray(currentCoupons) ? currentCoupons : [];
  };

  const { mutate: deleteCoupon } = useDeleteStripeCoupon();

  const handleConfirmDelete = () => {
    if (selectedCouponId) {
      deleteCoupon(selectedCouponId);
      setOpenDeleteModal(false);
      setSelectedCouponId(null);
    }
  };

  const { mutate: addCoupon, isPending: isCouponPending } =
    useAddStripeCoupon();

  const handleCreateCoupon = () => {
    const hasNameError = !newCoupon.name.trim();
    const hasTypeError = !newCoupon.type;
    const hasValueError = !newCoupon.value || parseFloat(newCoupon.value) <= 0;

    const hasDurationError =
      newCoupon.duration === "repeating" &&
      (!newCoupon.durationInMonths || Number(newCoupon.durationInMonths) < 1);

    if (hasNameError || hasTypeError || hasValueError || hasDurationError) {
      setErrors({
        name: hasNameError,
        type: hasTypeError,
        value: hasValueError,
        durationInMonths: hasDurationError,
      });
      return;
    }

    const payload = {
      name: newCoupon.name.trim(),
      type: newCoupon.type,
      currency: "usd",
      duration: newCoupon.duration,
      metadata: { coupon_for: mainTab },
    };
    if (payload.duration === "repeating") {
      payload.duration_in_months = Number(newCoupon.durationInMonths);
    }
    if (payload.type === "amount_off") {
      payload.amount_off = Math.round(parseFloat(newCoupon.value) * 100);
    } else if (payload.type === "percent_off") {
      payload.percent_off = parseFloat(newCoupon.value);
    }

    addCoupon(payload, {
      onSuccess: () => {
        setShowCreateModal(false);
        resetNewCoupon();
      },
    });
  };

  const { mutate: addPromo, isPending: isPromoPending } = useAddStripePromo();

  const handleCreatePromo = () => {
    const hasCodeError = !newCoupon.code || !newCoupon.code.trim();

    if (hasCodeError) {
      setErrors({
        code: hasCodeError,
      });
      return;
    }
    const payload = {
      code: newCoupon.code,
      coupon_id: newCoupon.id,
      metadata: { coupon_for: mainTab },
    };

    if (newCoupon.maxRedemptions) {
      payload.max_redemptions = Number(newCoupon.maxRedemptions);
    }

    if (newCoupon.redeemBy) {
      payload.expires_at = Math.floor(
        new Date(newCoupon.redeemBy).getTime() / 1000
      );
    }

    if (newCoupon.customer) {
      payload.customer = newCoupon.customer;
    }

    const restrictions = {};
    if (newCoupon.restrictions.first_time_transaction) {
      restrictions.first_time_transaction = true;
    }

    if (newCoupon.restrictions.minimum_amount) {
      restrictions.minimum_amount = Number(
        newCoupon.restrictions.minimum_amount
      );
      restrictions.minimum_amount_currency = "usd";
    }

    if (Object.keys(restrictions).length > 0) {
      payload.restrictions = restrictions;
    }

    addPromo(payload, {
      onSuccess: () => {
        setOpenPromoModal(false);
        resetNewCoupon();
        resetFieldToggles();
      },
    });
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 130,
      renderCell: (params) => <Box fontWeight="600">{params.row.name}</Box>,
    },
    {
      field: "promoCodes",
      headerName: "Promo Codes",
      flex: 1,
      renderCell: (params) => {
        const codes = params.row.promoCodes;
        return (
          <Box display="flex" flexWrap="wrap" alignItems="center" gap={0.25}>
            {codes.length > 0 ? (
              codes.map((code, idx) => (
                <Box key={idx} display="flex" alignItems="center">
                  <Box
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      border: 1,
                      borderColor: "primary.light",
                      bgcolor: "primary.50",
                      color: "primary.main",
                      borderRadius: 1,
                      px: 0.5,
                      fontSize: 12,
                    }}
                  >
                    {code}
                  </Box>
                  <Tooltip title="Copy code">
                    <IconButton
                      sx={{ p: 0 }}
                      size="small"
                      onClick={() => navigator.clipboard.writeText(code)}
                    >
                      <Copy size={14} />
                    </IconButton>
                  </Tooltip>
                  {idx < codes.length - 1 && (
                    <Box component="span" mx={0.5} color="gray">
                      |
                    </Box>
                  )}
                </Box>
              ))
            ) : (
              <Box color="text.secondary" fontSize={12}>
                No Promo Codes
              </Box>
            )}
          </Box>
        );
      },
    },

    {
      field: "discount",
      headerName: "Discount",
      width: 120,
      renderCell: (params) => <Box fontWeight="600">{params.row.discount}</Box>,
    },
    {
      field: "duration",
      headerName: "Duration",
      // flex: 1,
      width: 100,

      renderCell: (params) => <Box>{params.row.duration}</Box>,
    },
    {
      field: "times_redeemed",
      headerName: "Times Claimed",
      // flex: 1,
      width: 130,

      renderCell: (params) => <Box>{params.row.times_redeemed}</Box>,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      // flex: 1,
      renderCell: (params) => {
        const isActive = params.row.status === "active";
        return (
          <Chip
            label={isActive ? "Active" : "Inactive"}
            size="small"
            color={isActive ? "success" : "default"}
          />
        );
      },
    },
    {
      field: "delete",
      headerName: "Add & Delete",
      sortable: false,
      flex: 1,
      // width: 100,
      renderCell: (params) => {
        const row = params.row;
        return (
          <div className="flex h-full justify-start items-center  gap-2">
            {/* Add Button */}
            <Tooltip title="Add Promo Code">
              <IconButton
                size="small"
                onClick={() => {
                  setNewCoupon((prev) => ({
                    ...prev,
                    id: row.id,
                  }));
                  setOpenPromoModal(true); // Assuming this is the correct modal
                }}
                color="primary"
              >
                <Plus size={16} />
              </IconButton>
            </Tooltip>

            <TableDeleteActionButton
              size="small"
              onClick={() => {
                setSelectedCouponId(row.id);
                setOpenDeleteModal(true);
              }}
              className="text-gray-500 hover:text-red-600 transition-colors"
            />
          </div>
        );
      },
    },
  ];

  const rows = Array.isArray(currentCoupons)
    ? currentCoupons.map((coupon) => {
        const amountOff = Number(coupon.amount_off);

        const discount =
          typeof coupon.percent_off === "number" && !isNaN(coupon.percent_off)
            ? `${coupon.percent_off}% off`
            : !isNaN(amountOff)
            ? `${new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(amountOff / 100)} off`
            : "N/A";

        const promoCodes = Array.isArray(coupon.promo_codes)
          ? coupon.promo_codes.map((p) => p.code)
          : [];

        return {
          id: coupon.id,
          name: coupon.name?.trim() || "Unnamed",
          discount,
          amount_off: amountOff,
          currency: "usd",
          status: coupon.valid ? "active" : "inactive",
          duration: coupon.duration || "N/A",
          times_redeemed: coupon.times_redeemed,
          usageLimit: coupon.max_redemptions ?? "∞",
          couponFor: coupon.metadata?.coupon_for || "N/A",
          promoCodes,
        };
      })
    : [];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#f4f5f8",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#f4f5f8",

          p: 2,
        }}
      >
        <Box sx={{ pb: 2 }}>
          <Box>
            <Typography
              sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
              color="text.primary"
            >
              Coupon Management
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mt: 0.5, fontSize: "0.875rem", lineHeight: 1.5 }}
            >
              Manage and track coupons for customers and trainers
            </Typography>
          </Box>

          <Box sx={{ mt: 3, borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={mainTab}
              onChange={(e, newValue) => setMainTab(newValue)}
              textColor="inherit"
              indicatorColor="primary"
              sx={{ minHeight: "unset" }}
            >
              <Tab
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <User size={18} />
                    Customer Coupons
                    {isFetching ? (
                      <Skeleton
                        variant="rounded"
                        width={24}
                        height={19}
                        sx={{ borderRadius: "9999px", ml: 1 }}
                      />
                    ) : couponCounts.customer > 0 ? (
                      <Box
                        sx={{
                          ml: 1,
                          px: 1,
                          py: 0.25,
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          bgcolor: "green.100",
                          color: "grey.800",
                          border: "1px solid #16a34a",
                          minWidth: 24,
                          textAlign: "center",
                        }}
                      >
                        {couponCounts.customer}
                      </Box>
                    ) : null}
                  </Box>
                }
                value="customer"
                sx={{
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  borderBottom:
                    mainTab === "customer" ? "2px solid #22c55e" : "none",
                  color: mainTab === "customer" ? "text.secondary" : "inherit",
                  py: 1,
                  px: 1,
                  minHeight: "unset",
                }}
              />
              <Tab
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <GraduationCap size={18} />
                    Trainer Coupons
                    {isFetching ? (
                      <Skeleton
                        variant="rounded"
                        width={24}
                        height={19}
                        sx={{ borderRadius: "9999px" }}
                      />
                    ) : couponCounts.trainer > 0 ? (
                      <Box
                        sx={{
                          ml: 1,
                          px: 1,
                          py: 0.25,
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          bgcolor: "green.100",
                          color: "grey.800",
                          minWidth: 24,
                          textAlign: "center",
                          border: "1px solid #16a34a",
                        }}
                      >
                        {couponCounts.trainer}
                      </Box>
                    ) : null}
                  </Box>
                }
                value="trainer"
                sx={{
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  borderBottom:
                    mainTab === "trainer" ? "2px solid #22c55e" : "none",
                  color: mainTab === "trainer" ? "text.secondary" : "inherit",
                  py: 1,
                  px: 1,
                  minHeight: "unset",
                }}
              />
            </Tabs>
          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          gap={4}
          mb={4}
          // px={1}
        >
          <Box display="flex" gap={4} height={100}>
            <Paper
              elevation={3}
              sx={{
                width: 170,
                bgcolor: "white",
                p: 2,
                borderRadius: 4,
                border: "1px solid #f3f4f6",
                boxShadow: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                {/* Left: Text */}
                <Box>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="text.secondary"
                  >
                    Total Coupons
                  </Typography>

                  {isFetching ? (
                    <Skeleton variant="text" width={40} height={40} />
                  ) : (
                    <Typography variant="h4" fontWeight="bold" mt={0.5}>
                      {getCurrentCoupons().length}
                    </Typography>
                  )}
                </Box>

                {/* Right: Icon Box (slightly shifted up) */}
                <Box
                  mt={0.3}
                  pb={1.5}
                  pl={1.5}
                  borderRadius={3}
                  bgcolor="green.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Tag size={20} color="#22c55e" />
                </Box>
              </Box>
            </Paper>

            <Paper
              elevation={3}
              sx={{
                width: 170,
                bgcolor: "white",
                p: 2,
                borderRadius: 4,
                border: "1px solid #f3f4f6",
                boxShadow: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="text.secondary"
                  >
                    Total Usage
                  </Typography>

                  {isFetching ? (
                    <Skeleton variant="text" width={40} height={40} />
                  ) : (
                    <Typography variant="h4" fontWeight="bold" mt={0.5}>
                      {getCurrentCoupons().reduce(
                        (sum, c) => sum + (Number(c.times_redeemed) || 0),
                        0
                      )}
                    </Typography>
                  )}
                </Box>

                <Box
                  mt={0.3}
                  pb={1.5}
                  pl={1.5}
                  borderRadius={3}
                  bgcolor="green.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <ClipboardCheck size={20} color="#22c55e" />
                </Box>
              </Box>
            </Paper>
          </Box>

          <Button
            onClick={() => setShowCreateModal(true)}
            variant="contained"
            startIcon={<Plus size={20} />}
            sx={{
              alignSelf: "flex-start",
              backgroundColor: "#01933c",
              textTransform: "none",

              borderRadius: "8px",
              boxShadow: 3,
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Create {mainTab === "customer" ? "Customer" : "Trainer"} Coupon
          </Button>
        </Box>

        <Paper
          elevation={3}
          sx={{
            bgcolor: "white",
            borderRadius: 4,
            border: "1px solid #f3f4f6",
            boxShadow: 3,
            height: 500,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: "white",
              border: "1px solid #eee",
              flexGrow: 1,
              overflow: "auto",
            }}
          >
            <CommonTable
              loading={isFetching}
              rows={rows}
              columns={columns}
              getRowId={(row) => row.id}
              autoHeight={false}
              hideFooter
              style={{ height: "100%" }}
            />
          </Box>
        </Paper>
      </Box>

      {showCreateModal && (
        <Modal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          aria-labelledby="create-coupon-title"
          aria-describedby="create-coupon-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 4,
              width: "100%",
              maxWidth: 700,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Box
              sx={{
                mb: 3,
                borderBottom: "1px solid #E5E7EB",
                pb: 2,
                position: "relative",
              }}
            >
              <Typography
                id="create-coupon-title"
                variant="h5"
                fontWeight="bold"
                color="text.primary"
              >
                Create New {mainTab === "customer" ? "Customer" : "Trainer"}{" "}
                Coupon
              </Typography>
              <Typography
                id="create-coupon-description"
                variant="body2"
                color="text.secondary"
                mt={0.5}
              >
                Set up a new coupon for{" "}
                {mainTab === "customer" ? "customers" : "trainers"}
              </Typography>

              <IconButton
                aria-label="close"
                onClick={() => {
                  resetNewCoupon();
                  setShowCreateModal(false);
                }}
                sx={{ position: "absolute", top: 0, right: 0 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Coupon Name"
                fullWidth
                value={newCoupon.name}
                onChange={(e) => {
                  setNewCoupon({ ...newCoupon, name: e.target.value });
                  setErrors((prev) => ({ ...prev, name: false }));
                }}
                placeholder={
                  mainTab === "customer"
                    ? "Summer Sale 20%"
                    : "Trainer Bonus 25%"
                }
                error={errors.name}
                helperText={errors.name ? "Coupon name is required" : ""}
              />

              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                }}
              >
                <FormControl fullWidth error={errors.type}>
                  <InputLabel>Discount Type</InputLabel>
                  <Select
                    value={newCoupon.type}
                    onChange={(e) => {
                      setNewCoupon({ ...newCoupon, type: e.target.value });
                      setErrors((prev) => ({ ...prev, type: false }));
                    }}
                    label="Discount Type"
                  >
                    <MenuItem value="percent_off">Percentage (%)</MenuItem>
                    <MenuItem value="amount_off">Fixed Amount ($)</MenuItem>
                  </Select>
                  {errors.type && (
                    <FormHelperText>
                      Please select a discount type
                    </FormHelperText>
                  )}
                </FormControl>

                <TextField
                  label="Discount Value"
                  type="number"
                  inputProps={{ min: 0 }}
                  fullWidth
                  value={newCoupon.value}
                  onChange={(e) => {
                    setNewCoupon({ ...newCoupon, value: e.target.value });
                    setErrors((prev) => ({ ...prev, value: false }));
                  }}
                  placeholder={newCoupon.type === "percent_off" ? "20" : "10"}
                  error={errors.value}
                  helperText={
                    errors.value
                      ? "Enter a valid discount value greater than 0"
                      : ""
                  }
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={newCoupon.duration}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, duration: e.target.value })
                  }
                  label="Duration"
                >
                  <MenuItem value="forever">Forever</MenuItem>
                  <MenuItem value="once">Once</MenuItem>
                  <MenuItem value="repeating">Repeating</MenuItem>
                </Select>
              </FormControl>

              {newCoupon.duration === "repeating" && (
                <TextField
                  label="Duration (Months)"
                  type="number"
                  inputProps={{ min: 1 }}
                  fullWidth
                  value={newCoupon.durationInMonths || ""}
                  onChange={(e) => {
                    setNewCoupon({
                      ...newCoupon,
                      durationInMonths: e.target.value,
                    });
                    setErrors((prev) => ({ ...prev, durationInMonths: false }));
                  }}
                  error={errors.durationInMonths}
                  helperText={
                    errors.durationInMonths
                      ? "Duration in months is required"
                      : ""
                  }
                  placeholder="3"
                />
              )}

              <TextField
                label="Max Redemptions (optional)"
                type="number"
                inputProps={{ min: 1 }}
                fullWidth
                value={newCoupon.maxRedemptions || ""}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, maxRedemptions: e.target.value })
                }
                placeholder="1000"
              />

              <TextField
                label="Redeem By (optional)"
                type="date"
                fullWidth
                value={newCoupon.redeemBy || ""}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, redeemBy: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
              }}
            >
              <Button
                onClick={() => {
                  resetNewCoupon();
                  setShowCreateModal(false);
                }}
                variant="outlined"
                disabled={isCouponPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCoupon}
                variant="contained"
                disabled={isCouponPending}
                sx={{
                  bgcolor: "green.600",
                  ":hover": { bgcolor: "green.500" },
                  minWidth: 200,
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="center">
                  {isCouponPending && (
                    <CircularProgress
                      size={18}
                      sx={{ color: "white", mr: 1 }}
                    />
                  )}
                  {`Create ${
                    mainTab === "customer" ? "Customer" : "Trainer"
                  } Coupon`}
                </Box>
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

      <Dialog
        open={openPromoModal}
        onClose={() => setOpenPromoModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            width: "380px",
            maxHeight: "75vh",
            borderRadius: 2,
            px: 1.25,
            py: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 1,
            // mb:1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: "1.25rem" }}
          >
            Add Promo Code to Coupon
          </Typography>
          <IconButton
            onClick={() => {
              setOpenPromoModal(false);
              resetFieldToggles();
              resetNewCoupon();
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers={true} sx={{ py: 1 }}>
          <Box display="flex" flexDirection="column" gap={0.75}>
            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                label="Promo Code"
                required
                fullWidth
                placeholder="ABCDFTS"
                value={newCoupon.code || ""}
                onChange={(e) => {
                  setNewCoupon({ ...newCoupon, code: e.target.value });
                  setErrors((prev) => ({ ...prev, code: false }));
                }}
                error={errors.code}
                helperText={errors.code ? "Promo code is required *" : ""}
                size="small"
              />
              <Tooltip
                title="This code is case-insensitive and must be unique across all active promotion codees for any customer."
                arrow
                placement="right"
              >
                <InfoOutlinedIcon
                  sx={{
                    fontSize: 14,
                    color: "text.secondary",
                    cursor: "pointer",
                    mt: 0.5,
                  }}
                />
              </Tooltip>
            </Box>

            <FormControlLabel
              sx={{ fontSize: "0.7rem", alignItems: "center" }}
              control={
                <Checkbox
                  size="small"
                  checked={
                    newCoupon.restrictions?.first_time_transaction || false
                  }
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      restrictions: {
                        ...newCoupon.restrictions,
                        first_time_transaction: e.target.checked,
                      },
                    })
                  }
                />
              }
              label={
                <Box display="flex" alignItems="center" gap={0.5}>
                  <span>Eligible for first time orders only</span>
                  <Tooltip
                    title="This code will only be eligible for customers who have never made a purchase"
                    arrow
                    placement="right"
                  >
                    <InfoOutlinedIcon
                      sx={{
                        fontSize: 14,
                        color: "text.secondary",
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                </Box>
              }
            />

            <FormControlLabel
              sx={{ fontSize: "0.7rem" }}
              control={
                <Checkbox
                  size="small"
                  checked={fieldToggles.maxRedemptions}
                  onChange={(e) =>
                    setFieldToggles({
                      ...fieldToggles,
                      maxRedemptions: e.target.checked,
                    })
                  }
                />
              }
              label="Limit redemptions"
            />
            {fieldToggles.maxRedemptions && (
              <TextField
                label="Max Redemptions"
                type="number"
                inputProps={{ min: 1 }}
                fullWidth
                placeholder="5"
                value={newCoupon.max_redemptions || ""}
                onChange={(e) =>
                  setNewCoupon({
                    ...newCoupon,
                    max_redemptions: Number(e.target.value),
                  })
                }
                size="small"
              />
            )}

            <FormControlLabel
              sx={{ fontSize: "0.7rem" }}
              control={
                <Checkbox
                  size="small"
                  checked={fieldToggles.redeemBy}
                  onChange={(e) =>
                    setFieldToggles({
                      ...fieldToggles,
                      redeemBy: e.target.checked,
                    })
                  }
                />
              }
              label="Set expiry date"
            />
            {fieldToggles.redeemBy && (
              <TextField
                label="Expiry Date"
                type="datetime-local"
                fullWidth
                value={
                  newCoupon.redeemBy
                    ? new Date(newCoupon.redeemBy).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, redeemBy: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            )}

            <FormControlLabel
              sx={{ fontSize: "0.7rem" }}
              control={
                <Checkbox
                  size="small"
                  checked={fieldToggles.customer}
                  onChange={(e) =>
                    setFieldToggles({
                      ...fieldToggles,
                      customer: e.target.checked,
                    })
                  }
                />
              }
              label="Restrict to specific customer"
            />
            {fieldToggles.customer && (
              <TextField
                label="Customer Stripe ID"
                fullWidth
                placeholder="cus_123"
                value={newCoupon.customer || ""}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, customer: e.target.value })
                }
                size="small"
              />
            )}

            <FormControlLabel
              sx={{ fontSize: "0.7rem" }}
              control={
                <Checkbox
                  size="small"
                  checked={fieldToggles.minimumAmount}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFieldToggles({
                      ...fieldToggles,
                      minimumAmount: checked,
                    });

                    if (!checked) {
                      setNewCoupon((prev) => ({
                        ...prev,
                        restrictions: {
                          ...prev.restrictions,
                          minimum_amount: undefined,
                          minimum_amount_currency: "usd",
                        },
                      }));
                    }
                  }}
                />
              }
              label="Require Minimum order value"
            />
            {fieldToggles.minimumAmount && (
              <>
                <TextField
                  label="Min Order Value"
                  type="number"
                  inputProps={{ min: 0 }}
                  fullWidth
                  placeholder="100"
                  value={newCoupon.restrictions?.minimum_amount || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewCoupon({
                      ...newCoupon,
                      restrictions: {
                        ...newCoupon.restrictions,
                        minimum_amount: value ? Number(value) : undefined,
                      },
                    });
                  }}
                  size="small"
                />

                <TextField
                  label="Currency"
                  fullWidth
                  placeholder="usd"
                  value={newCoupon.restrictions?.minimum_amount_currency || ""}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      restrictions: {
                        ...newCoupon.restrictions,
                        minimum_amount_currency: e.target.value.toLowerCase(),
                      },
                    })
                  }
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            disabled={isPromoPending}
            onClick={() => {
              setOpenPromoModal(false);
              resetFieldToggles();
              resetNewCoupon();
            }}
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleCreatePromo}
            size="small"
            disabled={isPromoPending}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              {isPromoPending && (
                <CircularProgress size={16} sx={{ color: "white", mr: 1 }} />
              )}
              {isPromoPending ? "Adding" : "Add"}
            </Box>
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={() => {
          handleConfirmDelete(selectedCouponId);
          setOpenDeleteModal(false);
        }}
        title="Delete Coupon"
        description="Are you sure you want to delete this coupon? This action cannot be undone."
      />
    </Box>
  );
};

export default Page;
