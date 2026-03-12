
"use client";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Container,
  Stack,
  CircularProgress,
  Alert,
  Skeleton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";

import { People, MenuBook, CalendarToday, Close } from "@mui/icons-material";
import TrainersSignedUpTable from "./TrainersSignedUpTable";
import CustomersSignedUpTable from "./CustomersSignedUpTable";
import DietPlansListTable from "./DietPlansListTable";
import SalesMetricsSection from "./SalesMetricsSection";
import TrainerPerformanceReport from "./TrainerPerfromanceTable";
import CustomerPaymentListTable from "./CustomerPaymentListTable";
import TrainerPaymentListTable from "./TrainerPaymentListTable";

const ReportsTab = () => {
  const [dateRange, setDateRange] = useState("30");
  const [selectedTrainer, setSelectedTrainer] = useState("all");
  const [page, setPage] = useState(0);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [trainerLoading, setTrainerLoading] = useState(false);
  const [customerPaymentData, setCustomerPaymentData] = useState(null);
  const [trainerPaymentData, setTrainerPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Diet Plans Modal States
  const [dietPlansOpen, setDietPlansOpen] = useState(false);
  const [mealPlansError, setMealPlansError] = useState(null);

  // Trainers Modal States
  const [trainersOpen, setTrainersOpen] = useState(false);
  const [trainersError, setTrainersError] = useState(null);

  // Customers Modal States
  const [customersOpen, setCustomersOpen] = useState(false);
  const [customersError, setCustomersError] = useState(null);

  // Paying Customers Modal
  const [PayingCustomersOpen, setPayingCustomersOpen] = useState(false);
  const [PayingTrainersOpen, setPayingTrainersOpen] = useState(false);
  const [getCountData, setgetCountData] = useState(null);
  const end_date = dayjs().endOf("day").format("YYYY-MM-DD");
  const start_date = dayjs()
    .subtract(Number(dateRange), "day")
    .startOf("day")
    .format("YYYY-MM-DD");

  const fetchReportData = async (start_date) => {
    try {
      setLoading(true);
      setError(null);

      const response = await HttpClient.get(
        `${API_ENDPOINTS.GET_REPORT_COUNT}?start_date=${start_date}`
      );
      setgetCountData(response?.data);
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError(err.message || "Failed to fetch report data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerPaymentCount = async (start_date) => {
    try {
      setCustomerLoading(true);
      setError(null);

      const response = await HttpClient.get(
        `${API_ENDPOINTS.GET_CUSTOMER_PAYMENT_COUNT}?start_date=${start_date}`
      );
      const data = response.data;
      setCustomerPaymentData(data);
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError(err.message || "Failed to fetch report data");
    } finally {
      setCustomerLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerPaymentCount(start_date);
  }, [dateRange]);

  const fetchTrainerPaymentCount = async (start_date) => {
    try {
      setTrainerLoading(true);
      setError(null);

      const response = await HttpClient.get(
        `${API_ENDPOINTS.GET_TRAINER_PAYMENT_COUNT}?start_date=${start_date}`
      );
      const data = response.data;
      setTrainerPaymentData(data);
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError(err.message || "Failed to fetch report data");
    } finally {
      setTrainerLoading(false);
    }
  };
  useEffect(() => {
    fetchTrainerPaymentCount(start_date);
  }, [dateRange]);

  // Handle Diet Plans card click
  const handleDietPlansClick = () => {
    setDietPlansOpen(true);
  };

  // Handle Trainers card click
  const handleTrainersClick = () => {
    setTrainersOpen(true);
  };

  // Handle Customers card click
  const handleCustomersClick = () => {
    setCustomersOpen(true);
  };

  // Close Diet Plans modal
  const handleDietPlansClose = () => {
    setDietPlansOpen(false);
    setMealPlansError(null);
  };

  // Close Trainers modal
  const handleTrainersClose = () => {
    setTrainersOpen(false);
    setTrainersError(null);
  };

  // Close Customers modal
  const handleCustomersClose = () => {
    setCustomersOpen(false);
    setCustomersError(null);
  };

  //Paying Customers Modal funtion
  const PayingCustomersOpenModal = () => {
    setPayingCustomersOpen(true);
  };
  const PayingCustomersCloseModal = () => {
    setPayingCustomersOpen(false);
  };
  const PayingTrainersOpenModal = () => {
    setPayingTrainersOpen(true);
  };
  const PayingTrainersCloseModal = () => {
    setPayingTrainersOpen(false);
  };
  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchReportData(start_date);
  }, [dateRange, selectedTrainer]);

  const applyFilters = () => {
    setPage(0);
    fetchReportData(start_date);
  };

 const exportToCSV = (data, filename) => {
  if (typeof window === "undefined") return; // Prevent running on server

  const csvContent = data.map((row) => Object.values(row).join(",")).join("\n");
  const header = Object.keys(data[0]).join(",") + "\n";
  const blob = new Blob([header + csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};


  const exportToXLS = (data, filename) => {
    alert(
      "XLS export functionality would be implemented with a library like xlsx"
    );
  };

  
  // Function to add opacity to hex color
  const addOpacityToHex = (hex, opacity = "20") => {
    // Remove # if present
    const cleanHex = hex.replace("#", "");
    // Add opacity (20 = 12.5% opacity in hex)
    return `#${cleanHex}${opacity}`;
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color = "#3B82F6",
    onClick,
  }) => (
    <Card
      elevation={2}
      sx={{
        height: "88%",
        borderRadius: 4,
        padding: 1,
        transition: "transform 0.2s, box-shadow 0.2s, background-color 0.2s",
        cursor: onClick ? "pointer" : "default",
        "&:hover": {
          transform: "translateY(-2px)",
        },
        "&:active": {
          transform: "scale(0.98)",
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box flex={1}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>

            {loading ? (
              <Skeleton variant="text" width={80} height={40} />
            ) : (
              <Typography
                variant="h4"
                component="div"
                fontWeight="bold"
                color="text.primary"
              >
                {value}
              </Typography>
            )}

            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              p: 1.5,
              borderRadius: "50%",
              backgroundColor: addOpacityToHex(color, "20"),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ color: color, fontSize: 24 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          backgroundColor: "#f4f5f8",
          width: "100%",
          p: 2,
        }}
      >
        {/* Error Alert */}
        {error && !loading && (
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  fetchReportData(start_date);
                }}
              >
                Retry
              </Button>
            }
          >
            API Error: {error}. Showing fallback data.
          </Alert>
        )}

        {/* Header */}

        <Box>
          <Typography
            sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
            color="text.primary"
          >
            Reports
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ fontSize: "0.875rem", lineHeight: 1.5, py: 1 }}
          >
            Track your diet nutrition platform&#39;s performance
          </Typography>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 4 }} elevation={2}>
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              alignItems="center"
            >
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  label="Date Range"
                  onChange={(e) => setDateRange(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <CalendarToday
                        sx={{ color: "text.secondary", fontSize: 20 }}
                      />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="7">Last 7 days</MenuItem>
                  <MenuItem value="30">Last 30 days</MenuItem>
                  <MenuItem value="90">Last 3 months</MenuItem>
                  <MenuItem value="365">Last year</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={applyFilters}
                disabled={loading}
                sx={{
                  px: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                Apply Filters
                {loading && (
                  <CircularProgress
                    size={20}
                    thickness={5}
                    sx={{ color: "white" }}
                    aria-label="loading"
                  />
                )}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 1.5 }}>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <StatCard
              icon={People}
              title="Trainers Signed Up"
              // value={trainersData?.data?.page_information?.total_data || 0}
              value={getCountData?.totalTrainers || 0}
              subtitle="Active trainers"
              color="#3B82F6"
              onClick={handleTrainersClick}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <StatCard
              icon={People}
              title="Customers Signed Up"
              // value={customersData?.data?.page_information?.total_data || 0}
              value={getCountData?.totalCustomers || 0}
              subtitle="Total registrations"
              color="#10B981"
              onClick={handleCustomersClick}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <StatCard
              icon={MenuBook}
              title="Diet Plans"
              // value={mealPlansData?.data?.page_information?.total_data || 0}
              value={getCountData?.totalMealPlans || 0}
              subtitle="Available plans"
              color="#F59E0B"
              onClick={handleDietPlansClick}
            />
          </Grid>
        </Grid>

        {/* Sales Metrics */}
        <Box mb={4}>
          <SalesMetricsSection
            customerPaymentData={customerPaymentData}
            trainerPaymentData={trainerPaymentData}
            PayingCustomersOpenModal={PayingCustomersOpenModal}
            PayingTrainersOpenModal={PayingTrainersOpenModal}
          />
        </Box>

        <TrainerPerformanceReport
          start_date={start_date}
          dateRange={dateRange}
        />

        {/* Diet Plans Modal */}
        <Dialog
          open={dietPlansOpen}
          onClose={handleDietPlansClose}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2, padding: 2, paddingBottom: 0 },
          }}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <MenuBook color="warning" />
              <Typography variant="h5" component="h2" fontWeight="600">
                Diet Plans List
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={handleDietPlansClose}
              sx={{ color: "grey.500" }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              flex: 1,
              flexDirection: "column",
            }}
          >
            {mealPlansError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Error loading meal plans: {mealPlansError}
              </Alert>
            )}
            <DietPlansListTable
              start_date={start_date}
              end_date={end_date}
              dateRange={dateRange}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={trainersOpen}
          onClose={handleTrainersClose}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2, padding: 2, paddingBottom: 0 },
          }}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <People color="info" />
              <Typography variant="h5" component="h2" fontWeight="600">
                Trainers Signed Up
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={handleTrainersClose}
              sx={{ color: "grey.500" }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              flex: 1,
              flexDirection: "column",
            }}
          >
            {trainersError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Error loading trainers: {trainersError}
              </Alert>
            )}
            <TrainersSignedUpTable
              start_date={start_date}
              end_date={end_date}
              dateRange={dateRange}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={customersOpen}
          onClose={handleCustomersClose}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2, padding: 2, paddingBottom: 0 },
          }}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <People color="success" />
              <Typography variant="h5" component="h2" fontWeight="600">
                Customers Signed Up
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={handleCustomersClose}
              sx={{ color: "grey.500" }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              flex: 1,
              flexDirection: "column",
            }}
          >
            {customersError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Error loading customers: {customersError}
              </Alert>
            )}
            <CustomersSignedUpTable
              start_date={start_date}
              end_date={end_date}
              dateRange={dateRange}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          open={PayingCustomersOpen}
          onClose={PayingCustomersCloseModal}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2, padding: 2, paddingBottom: 0 },
          }}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <People color="success" />
              <Typography variant="h5" component="h2" fontWeight="600">
                Get Customer Payment List
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={PayingCustomersCloseModal}
              sx={{ color: "grey.500" }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
          >
            <CustomerPaymentListTable
              open={PayingCustomersOpen}
              customerPaymentData={customerPaymentData}
              start_date={start_date}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          open={PayingTrainersOpen}
          onClose={PayingTrainersCloseModal}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2, padding: 2, paddingBottom: 0 },
          }}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <People color="success" />
              <Typography variant="h5" component="h2" fontWeight="600">
                Get Trainer Payment List
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={PayingTrainersCloseModal}
              sx={{ color: "grey.500" }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
          >
            <TrainerPaymentListTable
              open={PayingTrainersOpen}
              trainerPaymentData={trainerPaymentData}
              start_date={start_date}
            />
          </DialogContent>
        </Dialog>
      </Container>
     
    </>
  );
};

export default ReportsTab;
