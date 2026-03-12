"use-client"
import { Box, Card, CardContent, Grid, Skeleton } from "@mui/material";
import { UserCheck, DollarSign, Target } from "lucide-react";
import React from "react";

const SalesMetricsSection = ({
  customerPaymentData,
  trainerPaymentData,
  PayingCustomersOpenModal,
  PayingTrainersOpenModal,
}) => {
  const StatCard = ({
    icon: Icon,
    title,
    label1,
    value1,
    label2,
    value2,
    footer,
    onClick,
    className,
    textcolor = "text-gray-700",
    valuecolor = "text-black",
    subtitlecolor = "text-gray-400",
    loading = false,
  }) => {
    return (
      <Card
        elevation={2}
        sx={{
          height: 132,
          minHeight: 132,
          maxHeight: 132,
          bgcolor: "transparent",
          borderRadius: 4,
          boxShadow: "none",
          cursor: onClick ? "pointer" : "default",
          "&:hover": {},
          "&:active": {},
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        onClick={onClick}
      >
        <CardContent>
          {loading ? (
            <Box>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={80} height={40} />
              <Skeleton variant="text" width={100} height={16} />
            </Box>
          ) : (
            <Box
              display="flex"
              justifyContent="space-between"
              gap={1}
              alignItems="flex-start"
            >
              {Icon && (
                <div className={className}>
                  <Icon color="#ffffff" size={16} />
                </div>
              )}
              {/* Left content */}
              <Box flex={1}>
                <p className={`text-sm ${textcolor} font-medium mb-1`}>
                  {title}
                </p>

                <div className=" flex justify-between flex-wrap">
                  <Box minWidth={0}>
                    <p
                      className={`text-xs ${subtitlecolor} font-medium uppercase tracking-wide`}
                    >
                      {label1}
                    </p>
                    <p
                      className={`text-xl font-bold ${valuecolor} truncate`}
                      title={value1}
                    >
                      {value1}
                    </p>
                  </Box>

                  {label2 && (
                    <Box minWidth={0} textAlign="left">
                      <p
                        className={`text-xs ${subtitlecolor} font-medium uppercase tracking-wide`}
                      >
                        {label2}
                      </p>
                      <p
                        className={`text-xl font-bold ${valuecolor} truncate`}
                        title={value2}
                      >
                        {value2}
                      </p>
                    </Box>
                  )}
                </div>

                {footer && (
                  <p className="text-gray-400 text-xs mt-2">{footer}</p>
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={4}>
        <div className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-200">
          <StatCard
            onClick={PayingCustomersOpenModal}
            icon={UserCheck}
            title="Customer Analytics"
            label1="Total Paying Customers"
            // value1={
            //   customerPaymentData
            //     ? customerPaymentData.total_paying_customers?.toLocaleString() ??
            //       "0"
            //     : "0"
            // }
            value1={customerPaymentData?.total_paying_customers?.toLocaleString() ?? "0"}
            label2="Total Customer Sales"
            // value2={
            //   customerPaymentData
            //     ? `$${
            //         customerPaymentData.total_customers_paid?.toLocaleString() ??
            //         "0"
            //       }`
            //     : "$0"
            // }
            value2={`$${customerPaymentData?.total_customers_paid?.toLocaleString() ?? "0"}`}
            color="green"
            className="bg-blue-500 p-1 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"
            textcolor={"text-blue-700"}
            valuecolor={"text-blue-900"}
            subtitlecolor={"text-blue-600"}
          />
        </div>
      </Grid>

      <Grid item xs={12} sm={12} md={4}>
        <div className="group bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-200">
          <StatCard
            onClick={PayingTrainersOpenModal}
            icon={Target}
            title="Trainer Analytics"
            label1="Total Paying Trainers"
            value1={
              trainerPaymentData?.total_paying_customers != null ? (
                trainerPaymentData.total_paying_customers.toLocaleString()
              ) : (
                <Skeleton variant="text" width={60} height={30} />
              )
            }
            label2="Total Trainer Sales"
            value2={
              trainerPaymentData?.total_customers_paid != null ? (
                `$${trainerPaymentData.total_customers_paid.toLocaleString()}`
              ) : (
                <Skeleton variant="text" width={80} height={30} />
              )
            }
            color="purple"
            className="bg-purple-500  p-1 rounded-full flex items-center justify-center"
            textcolor={"text-purple-700"}
            valuecolor={"text-purple-900"}
            subtitlecolor={"text-purple-600"}
          />
        </div>
      </Grid>

      <Grid item xs={12} sm={12} md={4}>
        <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-emerald-200">
          <StatCard
            icon={DollarSign}
            title="Total Analytics"
            label1="Total Sales"
            value1={`$${(
              (customerPaymentData?.total_customers_paid ?? 0) +
              (trainerPaymentData?.total_customers_paid ?? 0)
            ).toLocaleString()}`}
            color="blue"
            className="bg-emerald-500 p-1 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"
            textcolor={"text-emerald-700"}
            valuecolor={"text-emerald-900"}
            subtitlecolor={"text-emerald-600"}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default SalesMetricsSection;
