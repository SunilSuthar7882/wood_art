// components/ProgressBar.jsx
import React from "react";
import { LinearProgress, linearProgressClasses } from "@mui/material";
import { styled } from "@mui/system";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  width: "100%",
  maxWidth: "260px",
  borderRadius: "20px",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: "20px",
    backgroundColor: "#16a34a",
    ...theme.applyStyles("dark", {
      backgroundColor: "#308fe8",
    }),
  },
}));

const DayProgressBar = ({ currentValue, maxValue }) => {
  const progress = (currentValue / maxValue) * 100;

  return (
    <div className="flex justify-center items-center w-full mt-2">
      <div className="w-full max-w-[260px]">
        <BorderLinearProgress variant="determinate" value={progress} />
      </div>
    </div>
  );
};

export default DayProgressBar;
