"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Autocomplete,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { HttpClient } from "@/helpers/clients/http-client";
import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getLocalStorageItem } from "@/helpers/localStorage";
import {
  useGetMealPlans,
  useGetTemplatePlan,
  useGetTemplatePlans,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import { useCreateMealPlan } from "@/helpers/hooks/mamAdmin/mamAdmin";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import CommonLoader from "@/component/CommonLoader";
import CustomAutoComplete from "@/component/CommonComponents/CustomAutoComplete";
import CustomTextField from "@/component/CommonComponents/CustomTextField";
import CustomSelectController from "@/component/CommonComponents/CustomSelectController";

export default function AddEditTempPlanModal({
  isOpen,
  setIsOpen,
  customerTrainerId,
  isTemplateCreation = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm({
    defaultValues: {
      plan_name: "",
      number_of_days: 7,
      meals_per_day: "",
      snacks_per_day: "",
      calories_per_day: "",
      category_ids: [],
      template_ids: [],
      visible_to_admins: false,
      visible_to_trainers: false,
      visible_to_customers: false,
    },
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedDays, setSelectedDays] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [activeStatus, setActiveStatus] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [search, setSearch] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("");
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [snacksPerDay, setSnacksPerDay] = useState("");
  const [caloriesPerDay, setCaloriesPerDay] = useState("");

  const [clonedTemplateData, setLittleTemplateData] = useState(null);
  const [templatePlanId, setTemplatePlanId] = useState(null);
  // const [selectedTemplate, setSelectedTemplate] = useState(null);
  const role = getLocalStorageItem("role");
  const { mutate: createMealPlan, isPending: isPlanCreating } =
    useCreateMealPlan();
  // const { data: templatePlans, isLoading: isTemplateLoading } =
  //   useGetTemplatePlan({
  //     templateId: templatePlanId,
  //     enabled: !!templatePlanId,
  //   });

  // const { data, isFetching } = useGetTemplatePlans(
  //   page,
  //   pageSize,
  //   activeStatus,
  //   searchValue
  // );

  // const templatePlansAllData = data?.data?.page_data || [];

  // 1. Fetch ALL templates lazily (only on button click or modal open)

  const fetchTemplatePlans = async ({ pageParam = 1 }) => {
    const response = await HttpClient.get(
      `${API_ENDPOINTS.GET_ALL_TEMPLATE_PLANS}?page=${pageParam}&limit=10${
        selectedDays ? `&number_of_days=${selectedDays}` : ""
      }`
    );
    return response.data;
  };

  // const {
  //   data,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   isLoading,
  //   refetch: refetchTemplates,
  // } = useInfiniteQuery({
  //   queryKey: ["all-template-plans", selectedDays],
  //   queryFn: fetchTemplatePlans,
  //   getNextPageParam: (lastPage) => {
  //     if (lastPage.next_page && lastPage.current_page < lastPage.last_page) {
  //       return lastPage.next_page;
  //     }
  //     return undefined;
  //   },
  // });

  const fetchAllTemplatePlans = async ({ queryKey }) => {
    const [_key, filters] = queryKey;
    const { searchText, numberOfDays } = filters || {};

    const params = new URLSearchParams();
    params.append("page", "1");
    params.append("limit", "1000");

    if (searchText) params.append("search", searchText);

    // 👇 Ensure default is 7 if numberOfDays is not set
    params.append("number_of_days", numberOfDays || 7);

    const response = await HttpClient.get(
      `${API_ENDPOINTS.GET_ALL_TEMPLATE_PLANS}?${params.toString()}`
    );

    return response.data.page_data;
  };

  const {
    data: templatePlansAllData,
    isLoading: isFetchingTemplates,
    isError: isTemplateError,
    error: templateError,
    refetch: refetchTemplates,
  } = useQuery({
    queryKey: ["all-template-plans", { searchText: search, numberOfDays }],
    queryFn: fetchAllTemplatePlans,
    // enabled: true,
    keepPreviousData: true,
  });

  useEffect(() => {
    refetchTemplates();
  }, [search, numberOfDays]);

  const tempPlansAllData = templatePlansAllData || [];

  const handleUseTemplate = (id) => {
    setTemplatePlanId(id);
  };

  const fetchCategories = async () => {
    const response = await HttpClient.get(API_ENDPOINTS.GET_MEAL_PLAN_CATEGORY);
    return response.data.map((item) => ({
      id: item.id,
      name: item.name,
    }));
  };

  const {
    data: categories,
    isLoading: isFetchingCategories,
    isError: isCategoryError,
    error: categoryError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["meal-plan-categories"],
    queryFn: fetchCategories,
    enabled: false,
  });

  useEffect(() => {
    if (isOpen) {
      refetchTemplates();
      refetchCategories();
    }
  }, [isOpen, refetchTemplates, refetchCategories]);

  // useEffect(() => {
  //   if (selectedTemplate?.number_of_days) {
  //     setValue("number_of_days", selectedTemplate.number_of_days, {
  //       shouldValidate: true,
  //     });
  //   }
  // }, [selectedTemplate]);

  // useEffect(() => {
  //   if (selectedTemplate) {
  //     // Set number of days
  //     setValue("number_of_days", selectedTemplate.number_of_days ?? "", {
  //       shouldValidate: true,
  //     });

  //     // Extract full category objects for UI display
  //     const fullCategoryObjects =
  //       selectedTemplate.template_category_maps?.map(
  //         (map) => map.meal_plan_category
  //       ) || [];

  //     // Extract just IDs for form value
  //     const categoryIds = fullCategoryObjects.map((cat) => cat.id);

  //     setSelectedCategories(fullCategoryObjects); // for AutoComplete display
  //     setValue("category_ids", categoryIds, { shouldValidate: true }); // for RHF validation & submission

  //     setLittleTemplateData(selectedTemplate);
  //   }
  // }, [selectedTemplate]);

  useEffect(() => {
    if (selectedTemplate) {
      // Set number of days
      setValue("number_of_days", selectedTemplate.number_of_days ?? "", {
        shouldValidate: true,
      });

      // Set categories from template_category_maps
      const extractedCategories =
        selectedTemplate.template_category_maps?.map(
          (map) => map.meal_plan_category
        ) || [];

      setValue("category_ids", extractedCategories, { shouldValidate: true });
      setSelectedCategories(extractedCategories);

      // Store full template (optional)
      setLittleTemplateData(selectedTemplate);
    }
  }, [selectedTemplate]);

  const router = useRouter();

  const onSubmit = (formData) => {
    createMealPlan({
      formData,
      isTemplateCreation,
      customerTrainerId,
      templatePlanId,
      clonedTemplateData,
    });
  };
  const mutation = useCreateMealPlan();

  const isFormValid =
    !!watch("plan_name") &&
    !!watch("number_of_days") &&
    Array.isArray(watch("category_ids")) &&
    watch("category_ids").length > 0;

  const filteredPlans = (tempPlansAllData || []).filter(
    (plan) =>
      plan.name.toLowerCase().includes(search.toLowerCase()) ||
      `${plan.number_of_days}`.includes(search)
  );
  if (!isOpen) return null;
  if (isPlanCreating) return <CommonLoader />;
  if (isCategoryError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white p-6 rounded-lg w-full max-w-sm h-auto min-h-[425px] shadow-lg relative">
          <p className="text-red-500">
            Error loading categories: {categoryError.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        reset();
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          padding: 0,
          paddingBottom: 1.5,
        }}
      >
        <span style={{ fontSize: "1.125rem", fontWeight: 600 }}>
          Create Template Plan
        </span>
        <IconButton
          onClick={() => {
            setIsOpen(false);
            reset();
            setSelectedTemplate(null);
            setSelectedCategories([]);
            setSearch("");
            setSelectedDays("");
            // setNumberOfDays("");
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          dividers
          sx={{
            borderBottom: "none",
            padding: 1,
          }}
        >
          {/* Plan Name */}
          <label className="input-label block ml-1 mb-1">Name Your Plan*</label>
          <Controller
            name="plan_name"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <CustomTextField {...field} placeholder="Enter Plan Name" />
            )}
          />
          <ErrorMessage
            errors={errors}
            name="plan_name"
            render={({ message }) => (
              <p className="text-red-500 text-sm mb-2">{message}</p>
            )}
          />

          {/* Meal Plan Categories */}
          <label className="input-label block mb-1">
            Categorize Your Plan*
          </label>

          <CustomAutoComplete
            multiple
            options={categories || []}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterSelectedOptions
            loading={isFetchingCategories}
            value={selectedCategories}
            rules={{ required: "This field is required" }}
            onChange={(e, newValue) => {
              setSelectedCategories(newValue);
              setValue("category_ids", newValue, { shouldValidate: true });
            }}
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
            renderInputLabel="Select Category"
          />
          <ErrorMessage
            errors={errors}
            name="category_ids"
            render={({ message }) => (
              <p className="text-red-500 text-sm mb-2">{message}</p>
            )}
          />
 <label className="input-label block ml-1 mb-1">
                Number Of Day*
              </label>

              <CustomSelectController
                name="number_of_days"
                control={control}
                rules={{ required: "This field is required" }}
                disabled={!!selectedTemplate}
                selectedTemplate={selectedTemplate}
                onChange={setNumberOfDays}
                renderValueLabel="Select Duration"
                options={[
                  { label: "7 Days", value: 7 },
                  { label: "14 Days", value: 14 },
                  { label: "21 Days", value: 21 },
                  { label: "28 Days", value: 28 },
                ]}
              />
              
          {/* <div className="flex gap-4">
            <div className="w-1/2">
             
            </div>
            <div className="w-1/2">
              <label className="input-label block ml-1 mb-1">
                Target Calories Per Day*
              </label>
              <CustomSelectController
                name="calories_per_day"
                control={control}
                rules={{ required: "This field is required" }}
                onChange={setCaloriesPerDay}
                renderValueLabel="Select Calories"
                options={[
                  { label: "1200 – 1450", value: "1200-1450" },
                  { label: "1500 – 1750", value: "1500-1750" },
                  { label: "1800 – 2000", value: "1800-2000" },
                  { label: "2000 – 2250", value: "2000-2250" },
                  { label: "2300 – 2500", value: "2300-2500" },
                  { label: "2500 – 3000", value: "2500-3000" },
                  // { label: "Custom", value: "custom" },
                ]}
              />
            </div>
          </div> */}

          {/* <div className="flex gap-4">
            <div className="w-1/2">
              <label className="input-label block ml-1 mb-1">
                Meals Per Day*
              </label>
              <CustomSelectController
                name="meals_per_day"
                control={control}
                rules={{ required: "This field is required" }}
                onChange={setMealsPerDay}
                renderValueLabel="Select Meals"
                options={Array.from({ length: 10 }, (_, i) => ({
                  label: `${i + 1}`,
                  value: i + 1,
                }))}
              />
            </div>

            <div className="w-1/2">
              <label className="input-label block ml-1 mb-1">
                Snacks Per Day*
              </label>
              <CustomSelectController
                name="snacks_per_day"
                control={control}
                rules={{ required: "This field is required" }}
                onChange={setSnacksPerDay}
                renderValueLabel="Select Snacks"
                options={Array.from({ length: 6 }, (_, i) => ({
                  label: `${i + 1}`,
                  value: i + 1,
                }))}
              />
            </div>
          </div> */}

          {isTemplateCreation && role === "admin" && (
            <div className="my-4">
              <label className="input-label block mt-4 mb-2">Visibility</label>
              <div className="flex items-center gap-6 p-1">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-green-600 w-4 h-4"
                    {...register("visible_to_admins")}
                    defaultChecked
                  />
                  <span className="text-sm">Visible to Admins</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-green-600 w-4 h-4"
                    {...register("visible_to_trainers")}
                    defaultChecked
                  />
                  <span className="text-sm">Visible to Trainers</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-green-600 w-4 h-4"
                    {...register("visible_to_customers")}
                    defaultChecked
                  />
                  <span className="text-sm">Visible to Customers</span>
                </label>
              </div>
            </div>
          )}

          {/* <label className="input-label block mb-1">
            Select Template Plan*
          </label>
         
          <div className="relative mb-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Meal Plans"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
            />
            {selectedTemplate && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedTemplate(null);
                  setSelectedCategories([]);
                  // setValue("template_ids", "");
                  setValue("number_of_days", "");
                  setTemplatePlanId(null);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            )}
          </div>

         

          <InfiniteScroll
            dataLength={filteredPlans.length}
            next={fetchNextPage}
            hasMore={hasNextPage || false}
            loader={
              <li className="p-2 text-sm text-gray-500 text-center">
                Loading more...
              </li>
            }
            scrollableTarget="scrollableDiv"
          >
            <div
              id="scrollableDiv"
              className="border rounded-md max-h-64 overflow-y-auto divide-y"
            >
              <ul>
                {filteredPlans.map((plan, index) => (
                  <li
                    key={plan.id}
                    onClick={() => {
                      setSelectedTemplate(plan);
                      setValue("template_ids", plan.id);
                      setSearch(plan.name);
                      handleUseTemplate(plan.id);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-green-50 ${
                      selectedTemplate?.id === plan.id ? "bg-green-100" : ""
                    }`}
                  >
                    <div className="font-medium text-gray-800 flex items-center gap-2">
                      <span>{plan.name}</span>
                      <span className="text-gray-400">|</span>
                      <span>{plan.number_of_days} Days</span>
                    </div>

                    <div className="text-xs text-gray-600 flex flex-wrap gap-4 mt-0.5">
                      <span>
                        <span className="font-semibold">Calories:</span>{" "}
                        {Number(plan.total_calories).toFixed(2)}
                      </span>
                      <span>
                        <span className="font-semibold">Carbs:</span>{" "}
                        {Number(plan.total_carbs).toFixed(2)}g
                      </span>
                      <span>
                        <span className="font-semibold">Protein:</span>{" "}
                        {Number(plan.total_protein).toFixed(2)}g
                      </span>
                      <span>
                        <span className="font-semibold">Fat:</span>{" "}
                        {Number(plan.total_fat).toFixed(2)}g
                      </span>
                      {plan.total_fluid !== undefined && (
                        <span>
                          <span className="font-semibold">Fluid:</span>{" "}
                          {Number(plan.total_fluid).toFixed(2)}ml
                        </span>
                      )}
                    </div>
                  </li>
                ))}

                {!isFetchingNextPage && filteredPlans.length === 0 && (
                  <li className="p-2 text-sm text-gray-500 text-center">
                    No matching templates found.
                  </li>
                )}
              </ul>
            </div>
          </InfiniteScroll> */}
        </DialogContent>
        <DialogActions>
          <button
            type="submit"
            className={`w-full py-2 rounded-lg text-white transition-colors duration-200 ${
              isFormValid && !isPlanCreating
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isFormValid || isPlanCreating}
          >
            {isPlanCreating ? (
              <CircularProgress sx={{ color: "white" }} size={19} />
            ) : isTemplateCreation ? (
              "Create Template"
            ) : (
              "Create Diet Plan"
            )}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
