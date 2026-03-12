import React from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import logo from "../public/images/logo.webp";

const CommonLoader = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1300,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image src={logo} alt="Loading..." width={130} height={130} />
      <Box fontSize={"20px"} fontWeight={"550px"} color={"#394151"}>
        Macros And Meals
      </Box>
    </Box>
  );
};

export default CommonLoader;
