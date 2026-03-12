import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Typography, TextField, Box } from "@mui/material";
import { useGetProfile } from "@/helpers/hooks/profilesection/getprofile";
import CustomTextField from "@/component/CommonComponents/CustomTextField";

export default function Step5() {
  const { control } = useFormContext();
  const { data: profileData, isFetching: isProfileFetching } = useGetProfile();
  return (
    <Box>
      <Box className="mb-4">
        <Typography className="!mb-2 font-medium">
          {`Anything else you'd like us to know?`}
        </Typography>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              placeholder="Share any special needs, concerns, or goals here..."
            />
          )}
        />
      </Box>
    </Box>
  );
}
