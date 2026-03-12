import React from "react";
import { Button } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

const DayNavigation = ({ activeDay, totalDays, onPrevDay, onNextDay }) => {
  return (
    <div className="flex justify-center items-center w-full mt-4">
      <div className="relative w-full max-w-[245px]">
        <div className="flex justify-between items-center">
          <Button
            size="small"
            onClick={onPrevDay}
            disabled={activeDay === 1}
            sx={{
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              minWidth: "32px",
              bgcolor: "#F5F3F6",
              "&:hover": {
                backgroundColor: "#109A4E33",
              },
            }}
          >
            <KeyboardArrowLeft />
          </Button>

          <div className="text-xl font-bold">
            Day {activeDay} of {totalDays}
          </div>

          <Button
            size="small"
            onClick={onNextDay}
            disabled={activeDay === totalDays}
            sx={{
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              minWidth: "32px",
              bgcolor: "#F5F3F6",
              "&:hover": {
                backgroundColor: "#109A4E33",
              },
            }}
          >
            <KeyboardArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DayNavigation;
