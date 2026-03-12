"use client";

import { Routes } from "@/config/routes";
import { authorizationAtom } from "@/helpers/hooks/authorization-atom/authorization-atom";
import {
  useResendOtpMutation,
  useVerifyEmailMutation,
} from "@/helpers/hooks/register/register";
import { successNotification } from "@/helpers/notification";
import { ErrorMessage } from "@hookform/error-message";
import { Box, Grid, Input, Typography } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import logo from "../../public/images/logo.webp";
import { CustomButton } from "../ThemeRegistry";

const VerifyEmail = () => {
  const router = useRouter();
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const verifyEmail = useVerifyEmailMutation();
  const resendOtp = useResendOtpMutation();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = (data) => {
    verifyEmail.mutate(data, {
      onSuccess: (data) => {
        setAuthorized(true);
        router.push(Routes.dashboard);
        router.refresh();
        successNotification(data?.message);
      },
    });
  };

  const resendOTP = () => {
    resendOtp.mutate(
      {},
      {
        onSuccess: (data) => {
          successNotification(data?.message);
        },
      }
    );
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          height={"100%"}
          spacing={4}
        >
          <Grid
            item
            xs={12}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <Image src={logo} width={300} height={54} alt="brand-logo" />
          </Grid>
          <Grid
            item
            xs={10}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid
              container
              spacing={8}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <Grid
                item
                spacing={4}
                gap={4}
                xs={12}
                md={12}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <label>Enter the verification code sent to your email</label>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Input
                      name="otp"
                      id="otpId"
                      type="text"
                      {...register("otp", {
                        required: "otp is required",
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="otp"
                      render={({ message }) => (
                        <p style={{ color: "red" }}>{message}</p>
                      )}
                    />
                  </Box>
                </Box>
                <Typography
                  sx={{
                    width: "100%",
                    mt: "0px",
                    fontSize: "16px",
                    fontWeight: "600",
                    textAlign: "right",
                    color: "#cbcfe1",
                  }}
                >
                  Code not received?{" "}
                  <span
                    style={{ color: " #00927c", cursor: "pointer" }}
                    onClick={resendOTP}
                  >
                    Please send the security code again
                  </span>
                </Typography>
                <Box
                  sx={{ display: "flex", justifyContent: "end", width: "100%" }}
                >
                  <CustomButton
                    type="submit"
                    variant="contained"
                    width="150px"
                    margin="5px"
                    boxShadow="none"
                  >
                    verify
                  </CustomButton>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default VerifyEmail;
