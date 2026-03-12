import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Grid,
  useTheme,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Slide,
  Paper,
  Avatar,
  Tooltip,
  LinearProgress,
  Skeleton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import {
  useGetSignUpRequestById,
  useUpdateSignupStatus,
} from "@/helpers/hooks/mamAdmin/mamAdmin";
import { useGetdropdownadmintrainerlist } from "@/helpers/hooks/mamAdmin/dropdownadmintrainerlist";
import { useDropdownActiveAdminList } from "@/helpers/hooks/mamAdmin/dropdownactiveadminlist";
import dayjs from "dayjs";

const LabelValue = ({
  label,
  value,
  isBoolean = false,
  booleanValue = null,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        mb: 1,
        backgroundColor: "rgba(255,255,255,0.8)",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0.95)",
          borderColor: theme.palette.success.light,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          lineHeight: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.72rem",
            fontWeight: 500,
            color: "text.secondary",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            lineHeight: 1,
          }}
        >
          {label}:
        </Typography>

        {isBoolean ? (
          <Box display="flex" alignItems="center" gap={0.5}>
            {booleanValue ? (
              <CheckCircleIcon sx={{ color: "success.main", fontSize: 14 }} />
            ) : (
              <CancelIcon sx={{ color: "error.main", fontSize: 14 }} />
            )}
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "0.72rem",
                color: booleanValue ? "success.main" : "error.main",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              {booleanValue ? "Yes" : "No"}
            </Typography>
          </Box>
        ) : (
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 500,
              color: "text.primary",
              wordBreak: "break-word",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            {value || "-"}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

const SignUpDetailsView = ({ open, onClose, signupId }) => {
  const theme = useTheme();
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [selectedTrainerId, setSelectedTrainerId] = useState("");
  const [processingAction, setProcessingAction] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isTrainerSelected, setIsTrainerSelected] = useState(false);

  const {
    data: signupData,
    isLoading: isSignupLoading,
    isError: isSignupError,
  } = useGetSignUpRequestById(signupId);

  const {
    data: adminData,
    isFetching: isAdminFetching,
    refetch: refetchAdmins,
  } = useDropdownActiveAdminList();
  const {
    data: gettrainersList,
    isFetching: gettrainerfetching,
    refetch: gettrainerrefetch,
  } = useGetdropdownadmintrainerlist(selectedAdminId);

  useEffect(() => {
    if (checked && selectedAdminId) {
      gettrainerrefetch();
    }
  }, [checked, selectedAdminId]);

  const handleselectTrainerChange = (event) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);

    if (isChecked) {
      const selectedAdmin = adminList.find(
        (admin) => admin.id === selectedAdminId
      );
      setIsTrainerSelected(selectedAdmin?.role === "trainer");
    } else {
      setSelectedTrainerId("");
    }
  };

  const updateStatusMutation = useUpdateSignupStatus();

  const signupdetails = signupData?.data;

  const adminList = adminData?.data || [];

  useEffect(() => {
    if (open) refetchAdmins();
  }, [open]);

  useEffect(() => {
    if (open && signupdetails) {
      setSelectedAdminId(signupdetails.admin_id || "");
    }
  }, [open, signupdetails]);
  useEffect(() => {
    if (!open) {
      setChecked(false);
      setSelectedTrainerId("");
      setIsTrainerSelected(false);
    }
  }, [open]);

  const handleStatusUpdate = (status, adminId = null, selectedTrainerId) => {
    setProcessingAction(status === "accepted" ? "accept" : "reject");

    const payload = {
      request_id: Number(signupId),
      status: status,
    };

    if (adminId) {
      payload.admin_id = adminId;
    }
    if (selectedTrainerId) {
      payload.trainer_id = selectedTrainerId;
    }
    updateStatusMutation.mutate(payload, {
      onSuccess: () => {
        setTimeout(() => {
          setProcessingAction(null);
          onClose();
        }, 1000);
      },
      onError: (error) => {
        console.error(`Failed to ${status} signup:`, error);
        setProcessingAction(null);
      },
    });
  };
  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: "warning", label: "Pending" },
    };

    const config = statusConfig[status] || { color: "default", label: status };

    return (
      <Chip
        label={config.label}
        color={config.color}
        variant="filled"
        size="small"
        sx={{
          fontWeight: "bold",
          fontSize: "0.75rem",
          flexShrink: 0,
        }}
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      TransitionComponent={Slide}
      TransitionProps={{ direction: "up" }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
          height: "100%",
          maxHeight: "670px",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
          color: "white",
          fontWeight: 700,
          fontSize: "1rem",
          position: "relative",
          textAlign: "center",
          py: 1.2,
        }}
      >
        <PersonIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
        {!signupdetails ? (
          <Skeleton
            variant="text"
            width={160}
            height={24}
            sx={{ bgcolor: "rgba(255,255,255,0.3)", display: "inline-block" }}
          />
        ) : (
          `${
            signupdetails.role.charAt(0).toUpperCase() +
            signupdetails.role.slice(1)
          } Signup Details`
        )}
        <Tooltip title="Close">
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 12,
              top: 8,
              color: "white",
              backgroundColor: "rgba(255,255,255,0.1)",
              transition: "all 0.3s ease",
              width: 28,
              height: 28,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                transform: "rotate(90deg)",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      {processingAction && (
        <LinearProgress
          color="success"
          sx={{
            height: 3,
            "& .MuiLinearProgress-bar": {
              transition: "transform 1s ease-in-out",
            },
          }}
        />
      )}

      <DialogContent
        dividers
        sx={{
          background: "linear-gradient(135deg, #f9fefb 0%, #f0f9f0 100%)",
          p: 0,
          height: "calc(85vh - 140px)",
          overflow: "hidden",
        }}
      >
        {isSignupLoading ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <CircularProgress color="success" size={40} thickness={4} />
            <Typography
              sx={{
                mt: 2,
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              Loading signup details...
            </Typography>
          </Box>
        ) : isSignupError ? (
          <Paper
            sx={{
              p: 4,
              m: 3,
              textAlign: "center",
              backgroundColor: "error.light",
              color: "error.contrastText",
              borderRadius: 2,
            }}
          >
            <CancelIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6">
              Failed to fetch signup details.
            </Typography>
          </Paper>
        ) : !signupdetails ? (
          <Paper
            sx={{
              p: 4,
              m: 3,
              textAlign: "center",
              backgroundColor: "warning.light",
              color: "warning.contrastText",
              borderRadius: 2,
              maxHeight: "100%",
            }}
          >
            <Typography variant="h6">No details found.</Typography>
          </Paper>
        ) : (
          <Box
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            {/* Header with Status */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={1.5}
              sx={{
                backgroundColor: "rgba(255,255,255,0.9)",
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                color="primary.main"
                fontSize="1rem"
                sx={{
                  flex: 1,
                  marginRight: 2,
                  wordBreak: "break-word",
                }}
              >
                {signupdetails.full_name}
              </Typography>
              {getStatusChip(signupdetails.status)}
            </Box>

            {/* Main Content - Scrollable */}
            <Box sx={{ flex: 1, p: 1, overflow: "auto", maxHeight: "600px" }}>
              <Grid container spacing={1}>
                {/* Personal Information */}
                <Grid item xs={6} md={4}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="primary.main"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    Basic Details
                  </Typography>
                  <LabelValue
                    label="Full Name"
                    value={signupdetails.full_name}
                  />
                  <LabelValue
                    label="Email"
                    value={signupdetails.email}
                    width="20px"
                  />
                  <LabelValue
                    label="Phone Number"
                    value={signupdetails.phone_number}
                  />
                  <LabelValue label="Gender" value={signupdetails.gender} />
                  <LabelValue
                    label="Birth Date"
                    // value={signupdetails.birth_date}
                    value={
                      signupdetails.birth_date
                        ? dayjs(signupdetails.birth_date).format("MM-DD-YYYY")
                        : ""
                    }
                  />
                </Grid>

                {/* Physical & Fitness */}
                <Grid item xs={6} md={4}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="primary.main"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    Physical & Fitness
                  </Typography>
                  <LabelValue
                    label="Height"
                    value={`${signupdetails.height} ${signupdetails.height_unit}`}
                  />
                  <LabelValue
                    label="Weight"
                    value={`${signupdetails.weight} ${signupdetails.weight_unit}`}
                  />
                  <LabelValue
                    label="Activity Level"
                    value={signupdetails.average_activity_level}
                  />
                  <LabelValue
                    label="Meals per Day"
                    value={signupdetails.meals_eaten_per_day}
                  />
                  {/* <LabelValue
                    label="Fitness Goals"
                    value={signupdetails.fitness_goals}
                  /> */}
                  <LabelValue
                    label="Fitness Goals"
                    value={
                      Array.isArray(signupdetails.fitness_goals)
                        ? signupdetails.fitness_goals.join(", ")
                        : ""
                    }
                  />
                </Grid>

                {/* System Settings */}
                <Grid item xs={6} md={4}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="primary.main"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    Account Settings
                  </Typography>
                  <LabelValue
                    label="Measurement Standard"
                    value={signupdetails.measurement_standard}
                  />
                  <LabelValue label="Role" value={signupdetails.role} />
                  <LabelValue
                    label="Access Granted"
                    value=""
                    isBoolean={true}
                    booleanValue={signupdetails.is_access_granted}
                  />
                  <LabelValue
                    label="Self-Service Plan"
                    value=""
                    isBoolean={true}
                    booleanValue={signupdetails.self_service_plan}
                  />
                  <LabelValue
                    label="Track Progress"
                    value=""
                    isBoolean={true}
                    booleanValue={signupdetails.track_my_progress}
                  />
                </Grid>

                {/* Admin Assignment - Reduced width */}

                {/* Meal Preferences - Adjusted width */}
              {signupdetails.signup_req_plan_preferences?.length > 0 && (
  <Grid item xs={12} md={12} mb={1}>
    <Typography
      variant="body1"
      fontWeight="bold"
      color="primary.main"
      sx={{ mb: 0.5, fontSize: "0.85rem", width: "100%" }}
    >
      Meal Preferences
    </Typography>
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        minHeight: "48px",
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box display="flex" gap={0.8} flexWrap="wrap">
        {signupdetails.signup_req_plan_preferences.map((pref, idx) => (
          <Chip
            key={pref.id ?? idx}
            label={pref.meal_plan_category?.name}
            variant="filled"
            size="small"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
              color: "white",
              fontSize: "0.7rem",
            }}
          />
        ))}
      </Box>
    </Paper>
  </Grid>
)}

              </Grid>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                {!isAdminFetching && adminList.length > 0 && (
                  <Grid item xs={6} md={5}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="primary.main"
                        sx={{ mb: 0.5, fontSize: "0.85rem" }}
                      >
                        Admin Assignment
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checked}
                            onChange={handleselectTrainerChange}
                            inputProps={{ "aria-label": "controlled" }}
                            size="small"
                            sx={{
                              p: 0,
                            }}
                          />
                        }
                        label="Assign this customer to a trainer"
                        sx={{
                          "& .MuiTypography-root": {
                            fontSize: "0.7rem",
                            fontWeight: 500,
                          },
                          // ml: 1,
                        }}
                      />
                    </Box>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.grey[300]}`,
                      }}
                    >
                      <FormControl
                        size="small"
                        sx={{
                          width: "380px",
                          maxWidth: "100%",
                        }}
                      >
                        <InputLabel
                          sx={{
                            fontSize: "0.8rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Assigned To Admin
                        </InputLabel>
                        <Select
                          value={selectedAdminId}
                          label="Assigned To Admin"
                          disabled={!!signupdetails.admin_id}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            setSelectedAdminId(selectedId);
                            setSelectedTrainerId("");
                            if (checked) {
                              const selectedAdmin = adminList.find(
                                (admin) => admin.id === selectedId
                              );
                              setIsTrainerSelected(
                                selectedAdmin?.role === "trainer"
                              );
                            }
                          }}
                          sx={{
                            fontSize: "0.75rem",
                            "& .MuiOutlinedInput-root": {
                              transition: "all 0.3s ease",
                            },
                            "& .MuiSelect-select": {
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              paddingRight: "32px !important",
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: 200,
                              },
                            },
                          }}
                        >
                          {adminList.map((admin) => (
                            <MenuItem
                              key={admin.id}
                              value={admin.id}
                              sx={{
                                fontSize: "0.75rem",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  backgroundColor:
                                    theme.palette.success.light + "20",
                                },
                                py: 1,
                                minHeight: "auto",
                              }}
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                width="100%"
                              >
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    backgroundColor: theme.palette.success.main,
                                    fontSize: "0.7rem",
                                    flexShrink: 0,
                                  }}
                                >
                                  {admin.full_name?.charAt(0)}
                                </Avatar>

                                <Box sx={{ overflow: "hidden", flex: 1 }}>
                                  <Typography
                                    variant="body2"
                                    fontSize="0.75rem"
                                    sx={{
                                      fontWeight: 500,
                                      lineHeight: 1.2,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {admin.full_name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontSize: "0.68rem",
                                      color: "text.secondary",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {admin.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Paper>
                  </Grid>
                )}

                {checked && (
                  <Grid item xs={6} md={5}>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="primary.main"
                      sx={{ mb: 0.5, fontSize: "0.85rem" }}
                    >
                      Assign Trainer
                    </Typography>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.grey[300]}`,
                      }}
                    >
                      <FormControl
                        size="small"
                        sx={{
                          width: "380px",
                          maxWidth: "100%",
                        }}
                      >
                        <InputLabel
                          sx={{
                            fontSize: "0.8rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Assigned To Trainer
                        </InputLabel>
                        <Select
                          disabled={!selectedAdminId}
                          value={selectedTrainerId}
                          onChange={(e) => {
                            setSelectedTrainerId(e.target.value);
                          }}
                          label="Assigned To Trainer"
                          sx={{
                            fontSize: "0.75rem",
                            "& .MuiOutlinedInput-root": {
                              transition: "all 0.3s ease",
                            },
                            "& .MuiSelect-select": {
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              paddingRight: "32px !important",
                            },
                          }}
                        >
                          {gettrainersList?.data?.length === 0 ? (
                            <MenuItem disabled value="">
                              No trainers available
                            </MenuItem>
                          ) : (
                            gettrainersList?.data?.map((trainer) => (
                              <MenuItem key={trainer.id} value={trainer.id}>
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                  width="100%"
                                >
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: "0.75rem",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {trainer.full_name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: "0.68rem",
                                        color: "text.secondary",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {trainer.email}
                                    </Typography>
                                  </Box>
                                </Box>
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    </Paper>
                  </Grid>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                p: 2,
                backgroundColor:
                  "linear-gradient(135deg, #f9fefb 0%, #f0f9f0 100%)",
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Tooltip
                placement="left"
                title={
                  !selectedAdminId
                    ? "Please select an admin first"
                    : "Accept this signup request"
                }
                arrow
              >
                <span>
                  <Button
                    variant="contained"
                    color="success"
                    size="medium"
                    disabled={
                      !selectedAdminId ||
                      !!signupdetails.admin_id ||
                      processingAction ||
                      (checked && !isTrainerSelected && !selectedTrainerId)
                    }
                    onClick={() => {
                      setProcessingAction("accept");
                      handleStatusUpdate(
                        "accepted",
                        selectedAdminId,
                        selectedTrainerId
                      );
                    }}
                    sx={{
                      width: 160,
                      fontWeight: "600",
                      fontSize: "0.8rem",
                      background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                      },
                      "&:disabled": {
                        background: theme.palette.grey[400],
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      width="100%"
                      height="24px"
                    >
                      {processingAction === "accept" ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        "Accept & Assign"
                      )}
                    </Box>
                  </Button>
                </span>
              </Tooltip>

              <Button
                variant="outlined"
                color="error"
                size="small"
                disabled={processingAction}
                onClick={() => {
                  setProcessingAction("reject");
                  handleStatusUpdate("rejected");
                }}
                sx={{
                  minWidth: 100,
                  fontWeight: "600",
                  fontSize: "0.8rem",
                  borderWidth: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderWidth: 2,
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="60px"
                  height="20px"
                >
                  {processingAction === "reject" ? (
                    <CircularProgress size={16} />
                  ) : (
                    "Reject"
                  )}
                </Box>
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDetailsView;
