import { addStripePlan } from "@/helpers/hooks/stripeflowapi/addstripeplan";
import {
  Box,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import React, { useEffect } from "react";
import { CustomButton } from "../ThemeRegistry";
import { errorNotification, successNotification } from "@/helpers/notification";
import { editStripePlan } from "@/helpers/hooks/stripeflowapi/editstripeplan";

const ManageplansFormDetails = ({
  handleaddCloseDialog,
  stripePlanDataStore,
  openModalId,
  modalMode,
}) => {
  const { mutate: addstripeplan } = addStripePlan();
  const { mutate: editstripeplan } = editStripePlan();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
  });
  useEffect(() => {
    if (modalMode === "edit" && stripePlanDataStore) {
      const defaultPrice = stripePlanDataStore.prices.find(
        (p) => p.id === stripePlanDataStore.product.default_price
      );

      if (defaultPrice) {
        setValue("name", stripePlanDataStore.product.name);
        setValue("description", stripePlanDataStore.product.description || "");
        setValue("priceAmount", defaultPrice.unit_amount);
        setValue("priceCurrency", defaultPrice.currency);
        setValue("priceInterval", defaultPrice.recurring.interval);
      }
    }
  }, [modalMode, stripePlanDataStore, setValue]);
  const onSubmit = (data) => {
    const addPayload = {
      name: data.name,
      description: data.description,
      default_price_data: {
        currency: "usd",
        amount: parseInt(data.priceAmount),
        interval: data.priceInterval,
      },
    };
    const selectedInterval = data.priceInterval;
    const selectedCurrency = "usd";
    const matchingPrice = stripePlanDataStore?.prices?.find(
      (price) =>
        price.recurring?.interval === selectedInterval &&
        price.currency === selectedCurrency
    );

    const editPayload = {
      default_price_data: {
        currency: "usd",
        amount: parseInt(data.priceAmount),
        interval: data.priceInterval,
      },
    };

    if (modalMode === "add") {
      addstripeplan(addPayload, {
        onSuccess: (data) => {
          successNotification(data?.message);
          handleaddCloseDialog();
        },
        onError: (error) => {
          errorNotification(error?.response?.data?.message);
        },
      });
    } else if (modalMode === "edit") {
      editstripeplan(editPayload, {
        onSuccess: (data) => {
          successNotification(data?.message);
          handleaddCloseDialog();
        },
        onError: (error) => {
          errorNotification(error?.response?.data?.message);
        },
      });
    }
  };
  return (
    <Box display={"flex"} flexDirection={"column"} gap={"11px"}>
      <form onSubmit={handleSubmit(onSubmit)} id="add-plan-form">
        {modalMode === "add" && (
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Plan Name"
                fullWidth
                margin="normal"
              />
            )}
          />
        )}
        {modalMode === "add" && (
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                margin="normal"
              />
            )}
          />
        )}

        <Controller
          name="priceCurrency"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Currency"
              type="text"
              value={"usd"}
              fullWidth
              margin="normal"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          )}
        />
        <Controller
          name="priceAmount"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Price Amount (cents)"
              type="number"
              fullWidth
              margin="normal"
            />
          )}
        />

        <Controller
          name="priceInterval"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Interval"
              select
              fullWidth
              margin="normal"
              value={field.value || ""}
              onChange={field.onChange}
            >
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </TextField>
          )}
        />

        <CustomButton
          type={"submit"}
          variant={"contained"}
          width={"100%"}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Save"}
        </CustomButton>
      </form>
    </Box>
  );
};

export default ManageplansFormDetails;
