"use client";
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  ListItemIcon,
  Typography,
  Skeleton,
} from "@mui/material";
import { Routes } from "@/config/routes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { getSystemRoleLabel, SystemRole } from "@/component/roles";
import styles from "../styles/component/header.module.scss";
import style from "../styles/component/sidebar.module.scss";
import sidebarLogo from "../public/images/logo-with-name.png";

import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailIcon from "@mui/icons-material/Email";

import { useLogout } from "@/helpers/hooks/rest-user/user";
import { useGetProfile } from "@/helpers/hooks/profilesection/getprofile";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { Gift, LockKeyhole } from "lucide-react";

const FullNameDisplay = ({ full_name, open }) => {
  const textRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setIsOverflow(
          textRef.current.scrollWidth > textRef.current.clientWidth
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [full_name]);

  const content = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        gap: 0.5,
        maxWidth: 110,
      }}
    >
      <Box
        ref={textRef}
        sx={{
          fontSize: 12,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          flex: "1 1 auto",
          minWidth: 0,
        }}
      >
        {full_name}
      </Box>

      {open ? (
        <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
      ) : (
        <KeyboardArrowDownIcon sx={{ fontSize: 16 }} aria-hidden={false} />
      )}
    </Box>
  );

  return isOverflow ? (
    <Tooltip title={full_name} placement="top">
      <Box sx={{ display: "inline-flex", alignItems: "center" }}>{content}</Box>
    </Tooltip>
  ) : (
    content
  );
};

function Header({ isMediumScreen, toggleSidebar }) {
  const { data, isFetching, refetch } = useGetProfile();
  const { mutate } = useLogout();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setMounted] = useState(false);
  const open = Boolean(anchorEl);
  const role = getLocalStorageItem("role");
  const adminName = searchParams.get("admin_name") || "";
  const trainerName = searchParams.get("trainer_name") || "";
  const full_name = data?.data?.full_name || "";
  const email = data?.data?.email || "";
  const isLoading = !full_name || !role;
  const [isClicked, setIsClicked] = useState(false);
  // Handle menu click
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(open ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data) {
      setProfilePic(data.data.profile_image);
    }
  }, [data]);

  if (!isMounted) return null;
  const rewardshow = role === "customer" || role === "trainer";
  return (
    <Grid
      item
      xl={12}
      lg={12}
      display="flex"
      justifyContent="space-between"
      flexDirection="row"
      className={styles.header}
      minHeight={65}
    >
      {/* Mobile menu button */}
      {isMediumScreen && (
        <IconButton onClick={toggleSidebar} style={{ color: "black" }}>
          <MenuIcon sx={{ color: "black" }} aria-hidden={false} />
        </IconButton>
      )}

      {/* Logo section */}
      {/* <Grid
        item
        xl={2}
        lg={3}
        sx={{
          display: {
            xl: "flex",
            lg: "flex",
            md: "none",
            sm: "none",
            xs: "none",
          },
          justifyContent: "space-between",
        }}
      >
        <Link href={Routes.dashboard}>
          <Image
            src={sidebarLogo}
            height={80}
            width={229}
            alt="brand-logo"
            className={style.sidebarLogo}
            style={{ height: "auto", width: "auto" }}
            priority
          />
        </Link>
      </Grid> */}

      {/* Admin/Trainer name section */}
      <Grid
        item
        xl={4}
        lg={4}
        md={6}
        sm={8}
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#555",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            fontWeight: 500,
            whiteSpace: "nowrap",
            // ml: { xs: 1, sm: 10 },
            overflow: "hidden",
          }}
        >
          {adminName && (
            <span
              style={{
                border: "1px solid #ccc",
                borderRadius: 14,
                padding: "5px 8px",
                display: "inline-block",
                maxWidth: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                backgroundColor: "#F9F9FB",
              }}
              title={adminName}
            >
              {adminName}
            </span>
          )}
          {adminName && trainerName && <span>/</span>}
          {trainerName && (
            <span
              style={{
                border: "1px solid #ccc",
                borderRadius: 14,
                padding: "5px 8px",
                display: "inline-block",
                maxWidth: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                backgroundColor: "#F9F9FB",
              }}
              title={trainerName}
            >
              {trainerName}
            </span>
          )}
        </Box>
      </Grid>

      {/* User profile section */}
      <Grid
        item
        xl={10}
        lg={9}
        md={12}
        sm={12}
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        <Box
          onClick={(e) => {
            e.stopPropagation(e);
            handleClick(e);
            setIsClicked(true);
          }}
          role="button"
          aria-haspopup="true"
          aria-controls={open ? "account-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "6px",
          }}
        >
          <Tooltip title="Account settings" placement="bottom">
            <IconButton size="small" sx={{ padding: "0px" }} disableRipple>
              {isLoading ? (
                <Skeleton
                  variant="circular"
                  width={32}
                  height={32}
                  animation="wave"
                />
              ) : (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: `3px solid ${isClicked ? "#388E3C" : "#4CAF50"}`, // green outer border
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      overflow: "hidden",
                      backgroundColor: "#fff", // white inner ring
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Avatar
                      src={
                        profilePic && profilePic.trim() !== ""
                          ? profilePic
                          : undefined
                      }
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: !profilePic ? "#4CAF50" : "transparent",
                        color: !profilePic ? "#fff" : "inherit",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {(!profilePic || profilePic.trim() === "") &&
                        full_name
                          ?.split(" ")
                          .map((word) => word[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()}
                    </Avatar>
                  </Box>
                </Box>

                // <Avatar
                //   src={
                //     profilePic && profilePic.trim() !== ""
                //       ? profilePic
                //       : undefined
                //   }
                //   sx={{
                //     width: 32,
                //     height: 32,
                //     bgcolor: !profilePic ? "#4CAF50" : "transparent",
                //     color: !profilePic ? "#fff" : "inherit",
                //     fontSize: 14,
                //     fontWeight: 600,
                //     boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                //   }}
                // >
                //   {(!profilePic || profilePic.trim() === "") &&
                //     full_name
                //       ?.split(" ")
                //       .map((word) => word[0])
                //       .join("")
                //       .substring(0, 2)
                //       .toUpperCase()}
                // </Avatar>
              )}
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              ml: 1,
              maxWidth: 110,
            }}
          >
            {isLoading ? (
              <>
                <Skeleton
                  width={100}
                  height={16}
                  animation="wave"
                  sx={{ borderRadius: 1 }}
                />
                <Skeleton
                  width={80}
                  height={15}
                  animation="wave"
                  sx={{ borderRadius: 1, mt: 0.5 }}
                />
              </>
            ) : (
              <>
                {full_name && (
                  <FullNameDisplay
                    full_name={full_name}
                    open={open}
                    showArrow={true}
                  />
                )}
                {role && (
                  <Box
                    sx={{
                      fontSize: 11,
                      color: "gray",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                    }}
                    title={getSystemRoleLabel(role)}
                  >
                    {getSystemRoleLabel(role)}
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Grid>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        aria-hidden={false}
        // disableRestoreFocus={true}
        // disableAutoFocus={true}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              minWidth: 180,
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: 0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          sx={{
            opacity: 1,
            display: "flex",
            alignItems: "center",
            p: 1,
            gap: 1.75,
            minHeight: 48,
            m: 0,
            bgcolor: "#d1d5db",
            "&:hover": {
              bgcolor: "#e0e0e0",
            },
          }}
        >
          {/* Outer Green Ring */}
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "2px solid #4CAF50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "#fff", // white inner ring
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                src={
                  profilePic && profilePic.trim() !== ""
                    ? profilePic
                    : undefined
                }
                sx={{
                  width: 14,
                  height: 14,
                  bgcolor: !profilePic ? "#4CAF50" : "transparent",
                  color: !profilePic ? "#fff" : "inherit",
                  fontSize: 9,
                  fontWeight: 600,
                  ml: 0,
                  mr: 0,
                  margin: "0 !important",
                }}
              >
                {(!profilePic || profilePic.trim() === "") &&
                  full_name
                    ?.split(" ")
                    .map((word) => word[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
              </Avatar>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                fontWeight: 600,
                fontSize: 14,
                color: "#333",
                lineHeight: 1.2,
              }}
            >
              {full_name}
              <Box
                component="span"
                sx={{
                  display: "block",
                  fontSize: 13,
                  color: "#666",
                  maxWidth: "200px", // Adjust as needed
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {email}
              </Box>
            </Box>
          </Box>
        </MenuItem>

        {/* <MenuItem disabled sx={{ opacity: 1 }}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <span
            style={{
              fontSize: 13,
              whiteSpace: "nowrap",
            }}
          >
            {email}
          </span>
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            router.push(Routes.profile);
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        {rewardshow && (
          <MenuItem
            onClick={() => {
              router.push(Routes.rewards);
            }}
          >
            <ListItemIcon>
              <Gift fontSize="small" />
            </ListItemIcon>
            Rewards
          </MenuItem>
        )}
 <MenuItem
          onClick={() => {
            router.push(Routes.changepassword);
          }}
        >
          <ListItemIcon>
            <LockKeyhole fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <MenuItem onClick={() => mutate()}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Grid>
  );
}
export default Header;
