"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useCopiedDay } from "@/helpers/hooks/mamAdmin/useCopiedDay"; 
import { useSnackbar } from "@/app/contexts/SnackbarContext";

export default function CopyDaysModal({
  open,
  onClose,
  activeDay,
  totalDays,
  onConfirm,
  planDays,
}) {
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const { showSnackbar } = useSnackbar();

  const copyDays = useCopiedDay();

  const handleToggleDay = (day) => {
    setSelectedDays((prev) => {
      let updated;
      if (prev.includes(day)) {
        updated = prev.filter((d) => d !== day);
      } else {
        updated = [...prev, day];
      }

      const allDays = Array.from({ length: totalDays }, (_, i) => i + 1).filter(
        (d) => d !== activeDay
      );
      setSelectAll(updated.length === allDays.length);
      return updated;
    });
  };

  const handleSelectAll = () => {
    const allDays = Array.from({ length: totalDays }, (_, i) => i + 1).filter(
      (d) => d !== activeDay
    );

    if (selectAll) {
      setSelectedDays([]);
      setSelectAll(false);
    } else {
      setSelectedDays(allDays);
      setSelectAll(true);
    }
  };

  useEffect(() => {
    const allDays = Array.from({ length: totalDays }, (_, i) => i + 1).filter(
      (d) => d !== activeDay
    );
    setSelectAll(selectedDays.length === allDays.length);
  }, [selectedDays, totalDays, activeDay]);


  const handleConfirm = () => {
    if (selectedDays.length === 0) {
      showSnackbar("Please select at least one day to copy.", "warning");
      return;
    }


    const copiedFromDay = planDays.find((d) => d.day_number === activeDay);
    const copiedToDays = planDays
      .filter((d) => selectedDays.includes(d.day_number))
      .map((d) => d.id);

    if (!copiedFromDay) {
      showSnackbar("Could not find the source day.", "error");
      return;
    }

    const payload = {
      copied_from_day_id: copiedFromDay.id,
      copied_to_days: copiedToDays,
      replace: replaceExisting,
    };

    console.log("📦 Final payload:", payload);

    copyDays.mutate(payload, {
      onSuccess: (res) => {
        showSnackbar(res?.message || "Days copied successfully!", "success");
        onClose();
      },
      onError: (err) => {
        showSnackbar(
          err?.response?.data?.message || "Failed to copy days.",
          "error"
        );
      },
    });
  };
  useEffect(() => {
    if (!open) {
      setSelectedDays([]);
      setSelectAll(false);
      setReplaceExisting(false);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: "12px", width: 500, p: 2 },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
        Update Meal Plan
      </DialogTitle>

      <DialogContent>
        <div className="text-center mb-2 font-semibold">
          Copy Contents To Additional Days
        </div>

        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">Select Days Below</div>
          <FormControlLabel
            control={
              <Checkbox checked={selectAll} onChange={handleSelectAll} />
            }
            label="Select All Days"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {Array.from({ length: totalDays }, (_, i) => i + 1)
            .filter((day) => day !== activeDay)
            .map((day) => (
              <Button
                key={day}
                variant={selectedDays.includes(day) ? "contained" : "outlined"}
                onClick={() => handleToggleDay(day)}
                sx={{
                  minWidth: 70,
                  borderRadius: 4,
                  textTransform: "none",
                  backgroundColor: selectedDays.includes(day)
                    ? "#16a34a"
                    : "transparent",
                  color: selectedDays.includes(day) ? "white" : "black",
                  "&:hover": {
                    backgroundColor: selectedDays.includes(day)
                      ? "#15803d"
                      : "#f1f5f9",
                  },
                }}
              >
                Day {day}
              </Button>
            ))}
        </div>

        <FormControlLabel
          control={
            <Checkbox
              checked={replaceExisting}
              onChange={(e) => setReplaceExisting(e.target.checked)}
            />
          }
          label="Replace Existing Days"
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={copyDays.isPending}
        >
          Cancel
        </Button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={copyDays.isPending || selectedDays.length === 0}
          className="btn   bg-green-600 hover:bg-green-700 text-white rounded-md relative flex justify-center items-center"
        >
          <span className="text-white">
            {/* { "Copy to Selected Days"} */}
            {copyDays.isPending ? (
              <div className="flex items-center justify-center gap-2">
                <CircularProgress
                  size={18}
                  sx={{
                    color: "white",
                    width: "18px",
                    height: "18px",
                  }}
                />
             
              </div>
            ) : (
              "Copy to Selected Days"
            )}
          </span>

        
        </button>
      </DialogActions>
    </Dialog>
  );
}
