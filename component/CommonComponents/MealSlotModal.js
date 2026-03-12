

import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CommonLoader from "../CommonLoader";
import { useFetchSlotNames } from "@/helpers/hooks/mamAdmin/mealPlanList";

const MealSlotModal = ({
  loading,
  open,
  onClose,
  onSave,
  initialData,
  mode = "add",
}) => {
  const [selectedSlot, setSelectedSlot] = useState("");
  const { data: names = [], isLoading: isNamesLoading } = useFetchSlotNames();
  useEffect(() => {
    if (initialData?.title) {
      setSelectedSlot(initialData.title);
    } else {
      setSelectedSlot("");
    }
  }, [open, initialData]);

  const handleSave = () => {
    if (!selectedSlot) return;

    const payload = {
      title: selectedSlot,
      ...(mode === "edit" && { slot_id: initialData.id }),
    };

    onSave(payload);
  };

  if (loading) return <CommonLoader />;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 1 }}>
        <Typography variant="h6" component="div" fontWeight="600">
          {mode === "add" ? "Add Meal Slot" : "Edit Meal Slot"}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="!pt-3" sx={{p:1}}>
        <FormControl fullWidth size="small" required>
          <InputLabel id="slot-label">Select Slot</InputLabel>
          <Select
            labelId="slot-label"
            id="slot"
            value={selectedSlot}
            label="Select Slot"
            onChange={(e) => setSelectedSlot(e.target.value)}
          >
            <MenuItem value="">
              <em>Select Slot</em>
            </MenuItem>

            {isNamesLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
                Loading...
              </MenuItem>
            ) : (
              names.map((slot) => (
                <MenuItem key={slot.id} value={slot.name}>
                  {slot.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions
        sx={{
          p: 1,
          borderTop: "1px solid #e0e0e0",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="primary"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!selectedSlot || loading}
          startIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <AddIcon />
            )
          }
          sx={{ textTransform: "none" }}
        >
          {loading
            ? mode === "add"
              ? "Adding Meal Slot"
              : "Saving Meal Slot"
            : mode === "add"
            ? "Add Meal Slot"
            : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MealSlotModal;
