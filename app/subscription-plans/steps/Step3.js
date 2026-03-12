import React, { forwardRef, useEffect, useRef } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import {
  Typography,
  TextField,
  Box,
  Autocomplete,
  Chip,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { commonAllergies, dietTypes } from "@/utils/utils";
import { useFetchFoodList } from "@/helpers/hooks/mamAdmin/mealPlanList";
import CustomAutoComplete from "@/component/CommonComponents/CustomAutoComplete";
import CustomTextField from "@/component/CommonComponents/CustomTextField";

const CustomListboxComponentInner = (props, ref) => {
  const { onLoadMore, hasNextPage, isFetchingNextPage, ...other } = props;

  const listboxRef = useRef(null);
  const previousScrollHeight = useRef(0);
  const previousScrollTop = useRef(0);

  useEffect(() => {
    if (isFetchingNextPage && listboxRef.current) {
      previousScrollTop.current = listboxRef.current.scrollTop;
      previousScrollHeight.current = listboxRef.current.scrollHeight;
    }
  }, [isFetchingNextPage]);

  useEffect(() => {
    if (
      !isFetchingNextPage &&
      listboxRef.current &&
      previousScrollHeight.current
    ) {
      const newScrollHeight = listboxRef.current.scrollHeight;
      const scrollDifference = newScrollHeight - previousScrollHeight.current;
      listboxRef.current.scrollTop =
        previousScrollTop.current + scrollDifference;
    }
  }, [other.children, isFetchingNextPage]);

  const handleScroll = (event) => {
    const listboxNode = event.currentTarget;

    const scrollTop = listboxNode.scrollTop;
    const scrollHeight = listboxNode.scrollHeight;
    const clientHeight = listboxNode.clientHeight;

    if (hasNextPage && scrollHeight - scrollTop - clientHeight < 50) {
      if (onLoadMore) {
        onLoadMore();
      }
    }
  };

  return (
    <ul
      {...other}
      ref={(node) => {
        listboxRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      onScroll={handleScroll}
      style={{
        maxHeight: 300,
        overflowY: hasNextPage ? "auto" : "visible",
      }}
    >
      {other.children}

      {isFetchingNextPage && (
        <li style={{ display: "flex", justifyContent: "center", padding: 8 }}>
          <CircularProgress size={20} />
        </li>
      )}
    </ul>
  );
};

// Use forwardRef
export const CustomListboxComponent = forwardRef(CustomListboxComponentInner);

// Set the displayName explicitly
CustomListboxComponent.displayName = "CustomListboxComponent";

export const FoodSelector = ({
  control,
  name,
  label,
  otherFoodName,
  otherFoodIds,
  data,
  isFetchingNextPage,
  handleLoadMore,
}) => {
  const selectedFoodIds = useWatch({
    control,
    name,
    defaultValue: [],
  });

  // Filter out foods that are already selected in the other list
  const filteredOptions =
    data?.pages
      ?.flatMap((page) => page.foods || [])
      .filter(
        (food) =>
          !selectedFoodIds.includes(food.id) && !otherFoodIds.includes(food.id)
      ) ?? [];

  return (
    <Box className="mb-4">
      <Typography className="!mb-2 font-medium">{label}</Typography>

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ...rest } }) => (
          <CustomAutoComplete
          renderInputLabel={`Select or type ${label.toLowerCase()}`}
            {...rest}
            multiple
            freeSolo
            options={filteredOptions}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option?.name ?? ""
            }
            value={
              selectedFoodIds.map((id) => {
                return data?.pages
                  ?.flatMap((page) => page.foods || [])
                  .find((food) => food.id === id);
              }) || []
            }
            onChange={(_, newValue) => {
              const newIds = newValue.map((option) =>
                typeof option === "string" ? option : option.id
              );
              onChange(newIds);
            }}
            ListboxComponent={forwardRef(function ListboxWithRef(
              listboxProps,
              ref
            ) {
              return (
                <CustomListboxComponent
                  {...listboxProps}
                  ref={ref}
                  hasNextPage={true}
                  isFetchingNextPage={isFetchingNextPage}
                  onLoadMore={handleLoadMore}
                />
              );
            })}
            noOptionsText={
              !isFetchingNextPage &&
              (data?.pages?.length === 0 ||
                data?.pages?.every((page) => (page.foods || []).length === 0))
                ? "No foods found"
                : "Loading..."
            }
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    {...tagProps}
                    label={option?.name}
                    className="bg-green-100"
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder={`Select or type ${label.toLowerCase()}`}
              />
            )}
          />
        )}
      />
    </Box>
  );
};

export default function Step3() {
  const { control } = useFormContext();

  const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useFetchFoodList({
      pageSize: 10,
    });

  const likedFoodIds = useWatch({
    control,
    name: "liked_foods",
    defaultValue: [],
  });

  const anyAllergies = useWatch({
    control,
    name: "any_allergies",
    defaultValue: false,
  });

  const handleLoadMore = () => {
    if (!isFetching && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Box>
      <Box className="mb-4">
        <Typography className="!mb-2 font-medium">
          Preferred cuisines
        </Typography>
        <Controller
          name="preferred_cuisine"
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              variant="outlined"
              fullWidth
              placeholder="e.g., Italian, Indian, Mexican..."
            />
          )}
        />
      </Box>

      <Box className="mb-4">
        <Controller
          name="any_allergies"
          control={control}
          render={({
            field: { value, onChange, ...rest },
            fieldState: { error },
          }) => (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value || false}
                    onChange={(e) => onChange(e.target.checked)}
                    {...rest}
                  />
                }
                label="Do you have any food allergies?"
              />
              {error && (
                <Typography color="error" variant="caption" display="block">
                  {error.message}
                </Typography>
              )}
            </>
          )}
        />
      </Box>

      {anyAllergies && (
        <Box className="mb-4">
          <Typography className="!mb-2 font-medium">
            Select your allergies
          </Typography>
          <Controller
            name="allergies"
            control={control}
            defaultValue={[]}
            rules={{
              validate: (value) => {
                if (anyAllergies && (!value || value.length === 0)) {
                  return "Please select at least one allergy";
                }
                return true;
              },
            }}
            render={({
              field: { onChange, value, ...rest },
              fieldState: { error },
            }) => (
              <>
                <CustomAutoComplete
                  {...rest}
                  multiple
                  freeSolo
                  options={commonAllergies}
                  value={value || []}
                  onChange={(_, newValue) => onChange(newValue)}
                 renderTags={(value, getTagProps) =>
  value.map((option, index) => {
    const { key, ...tagProps } = getTagProps({ index });
    return (
      <Chip
        key={key} // ✅ explicitly pass the key
        label={option}
        className="bg-red-100"
        {...tagProps} // ✅ spread the rest
      />
    );
  })
}

                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select or type allergies"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </>
            )}
          />
        </Box>
      )}

      <Box className="mb-4">
        <Typography className="!mb-2 font-medium">Diet Type*</Typography>
        <Controller
          name="diet_type"
          control={control}
          rules={{ required: "Diet type is required" }}
          render={({
            field: { onChange, value, ...rest },
            fieldState: { error },
          }) => (
            <CustomAutoComplete
            renderInputLabel="Select or type your diet"
              {...rest}
              options={dietTypes}
              value={value || null}
              onChange={(_, newValue) => onChange(newValue)}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
                  placeholder="Select or type your diet"
                />
              )}
            />
          )}
        />
      </Box>

      <Box>
        <FoodSelector
          control={control}
          name="liked_foods"
          label="Foods you love"
          otherFoodName="avoided_foods"
          otherFoodIds={likedFoodIds}
          data={data}
          isFetchingNextPage={isFetchingNextPage}
          handleLoadMore={handleLoadMore}
        />

        <FoodSelector
          control={control}
          name="avoided_foods"
          label="Foods to avoid"
          otherFoodName="liked_foods"
          otherFoodIds={likedFoodIds}
          data={data}
          isFetchingNextPage={isFetchingNextPage}
          handleLoadMore={handleLoadMore}
        />
      </Box>
    </Box>
  );
}
