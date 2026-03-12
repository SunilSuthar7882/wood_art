import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Chip,
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import {
  useGetMamAdmins,
  useGetSignUpRequestById,
  useUpdateSignupStatus,
} from "@/helpers/hooks/mamAdmin/mamAdmin";

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

          gap: 0.2,
          lineHeight: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "text.secondary",
            fontSize: "0.72rem",
            flexShrink: 0,
            whiteSpace: "nowrap",
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

const TrainerDetailsView = ({ open, onClose, signupId }) => {
  const theme = useTheme();
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [processingAction, setProcessingAction] = useState(null);

  const {
    data: signupData,
    isLoading: isSignupLoading,
    isError: isSignupError,
  } = useGetSignUpRequestById(signupId);

  const {
    data: adminData,
    isFetching: isAdminFetching,
    refetch: refetchAdmins,
  } = useGetMamAdmins(0, 100000, "", "");

  const updateStatusMutation = useUpdateSignupStatus();

  const signupdetails = signupData?.data;
  const adminList = adminData?.data?.page_data || [];

  useEffect(() => {
    if (open) refetchAdmins();
  }, [open]);

  useEffect(() => {
    if (open && signupdetails) {
      setSelectedAdminId(signupdetails.admin_id || "");
    }
  }, [open, signupdetails]);

  const handleStatusUpdate = (status, adminId = null) => {
    setProcessingAction(status === "accepted" ? "accept" : "reject");

    const payload = {
      request_id: Number(signupId),
      status: status,
    };

    if (adminId) {
      payload.admin_id = adminId;
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
          maxHeight: "550px",
          maxWidth: "500px",
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
            <Box sx={{ flex: 1, p: 1, overflow: "auto", maxHeight: "400px" }}>
              <Box sx={{ maxWidth: "600px", width: "100%", mx: "auto" }}>
                {/* Basic Details Section */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="primary.main"
                    sx={{ fontSize: "0.85rem", mb: 1 }}
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
                  <LabelValue label="Role" value={signupdetails.role} />
                </Box>

                {/* Admin Assignment Section */}
                {!isAdminFetching && adminList.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="primary.main"
                      sx={{ fontSize: "0.85rem", mb: 0.5 }}
                    >
                      Admin Assignment
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
                        sx={{ width: "380px", maxWidth: "100%" }}
                      >
                        <InputLabel
                          sx={{
                            fontSize: "0.8rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Assign Admin
                        </InputLabel>

                        <Select
                          value={selectedAdminId}
                          label="Assign Admin"
                          disabled={!!signupdetails.admin_id}
                          onChange={(e) => setSelectedAdminId(e.target.value)}
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
                              sx: { maxHeight: 200 },
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
                  </Box>
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
                title={!selectedAdminId ? "Please select an admin first" : ""}
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
                      processingAction
                    }
                    onClick={() => {
                      setProcessingAction("accept");
                      handleStatusUpdate("accepted", selectedAdminId);
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

export default TrainerDetailsView;
