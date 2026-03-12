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

import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { useCopiedDaySlot } from "@/helpers/hooks/mamAdmin/useCopiedDay";

export default function CopyMealSlotModal({
  open,
  onClose,
  selectedMeal,
  planDays,
  activeStep, // ✅ current active day number
  totalDays,
}) {
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [replaceExisting, setReplaceExisting] = useState(false);

  const { showSnackbar } = useSnackbar();
  const copyMealSlot = useCopiedDaySlot();


  const filteredDays = planDays?.filter(
    (d) => d.day_number !== activeStep
  );

  // ✅ Toggle individual day selection
  const handleToggleDay = (dayId) => {
    setSelectedDays((prev) => {
      let updated;
      if (prev.includes(dayId)) {
        updated = prev.filter((d) => d !== dayId);
      } else {
        updated = [...prev, dayId];
      }
      const allDays = filteredDays.map((d) => d.id);
      setSelectAll(updated.length === allDays.length);
      return updated;
    });
  };

  // ✅ Select or deselect all
  const handleSelectAll = () => {
    const allDays = filteredDays.map((d) => d.id);
    if (selectAll) {
      setSelectedDays([]);
      setSelectAll(false);
    } else {
      setSelectedDays(allDays);
      setSelectAll(true);
    }
  };

  // ✅ Reset modal state when closed
  useEffect(() => {
    if (!open) {
      setSelectedDays([]);
      setSelectAll(false);
      setReplaceExisting(false);
    }
  }, [open]);
console.log("filteredDays ",filteredDays )
  // ✅ Confirm (API call)
  const handleConfirm = () => {
    if (selectedDays.length === 0) {
      showSnackbar("Please select at least one day to copy.", "warning");
      return;
    }

    if (!selectedMeal?.id) {
      showSnackbar("Meal slot ID missing.", "error");
      return;
    }

    const payload = {
      copied_from_slot_id: selectedMeal.id,
      copied_to_days: selectedDays,
      replace: replaceExisting,
    };

    console.log("📦 Copy Meal Slot Payload:", payload);

    copyMealSlot.mutate(payload, {
      onSuccess: (res) => {
        showSnackbar(
          res?.message || "Meal slot copied successfully!",
          "success"
        );
        onClose();
      },
      onError: (err) => {
        showSnackbar(
          err?.response?.data?.message || "Failed to copy meal slot.",
          "error"
        );
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: "12px", width: 500, p: 2 },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
        Copy Meal Slot
      </DialogTitle>

      <DialogContent>
        <div className="text-center mb-2 font-semibold">
          Copy This Meal Slot to Other Days
        </div>

        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">Select Days Below</div>
          <FormControlLabel
            control={<Checkbox checked={selectAll} onChange={handleSelectAll} />}
            label="Select All Days"
          />
        </div>

        {/* ✅ Show all days except the active one */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {filteredDays?.map((day) => (
            <Button
              key={day.id}
              variant={selectedDays.includes(day.id) ? "contained" : "outlined"}
              onClick={() => handleToggleDay(day.id)}
              sx={{
                minWidth: 70,
                borderRadius: 4,
                textTransform: "none",
                backgroundColor: selectedDays.includes(day.id)
                  ? "#16a34a"
                  : "transparent",
                color: selectedDays.includes(day.id) ? "white" : "black",
                "&:hover": {
                  backgroundColor: selectedDays.includes(day.id)
                    ? "#15803d"
                    : "#f1f5f9",
                },
              }}
            >
              Day {day.day_number}
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
          disabled={copyMealSlot.isPending}
        >
          Cancel
        </Button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={copyMealSlot.isPending || selectedDays.length === 0}
          className="btn bg-green-600 hover:bg-green-700 text-white rounded-md relative flex justify-center items-center px-4 py-2"
        >
          <span className="text-white">
            {copyMealSlot.isPending ? (
              <div className="flex items-center justify-center gap-2">
                <CircularProgress
                  size={18}
                  sx={{
                    color: "white",
                    width: "18px",
                    height: "18px",
                  }}
                />
                Copying...
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
