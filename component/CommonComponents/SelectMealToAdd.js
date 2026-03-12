// import { useState } from "react";
// import { TextField, InputAdornment, MenuItem, Button } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import CustomTextField from "./CustomTextField";

// const SelectMealToAdd = ({ setShowAddMealView }) => {
//   const [activeTab, setActiveTab] = useState("all");

//   const meals = [
//     { name: "1233333", type: "Lunch", time: "1:01 am", calories: 6 },
//     { name: "7890", type: "Lunch", time: "1:01 am", calories: 6 },
//     {
//       name: "glaze salmon, balsamic garden salad",
//       type: "Dinner",
//       time: "6:00 pm",
//       calories: 699,
//     },
//     { name: "test snack", type: "Snack", time: "", calories: 91 },
//   ];

//   return (
//     <div className="flex flex-col flex-1 p-2 border rounded-md bg-white shadow-sm overflow-auto max-w-6xl mx-auto w-full">
//       {/* Back Button */}
//       <div className="self-start">
//         <Button
//           variant="text"
//           color="primary"
//           onClick={() => setShowAddMealView(false)}
//           sx={{ m: 0 }}
//         >
//           Back to Meals
//         </Button>
//       </div>

//       <h2 className="text-lg font-semibold mb-4 text-center">
//         Select Meal To Add
//       </h2>

//       {/* Search & Filter Row */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4 items-center p-1">
//         <CustomTextField
//           size="small"
//           placeholder="Search Meals"
//           InputProps={{
//             sx: {
//               "& input": {
//                 paddingTop: 0,
//                 paddingBottom: 0,
//                 paddingLeft: 0,
//                 paddingRight: 0,
//               },
//             },
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon fontSize="small" />
//               </InputAdornment>
//             ),
//           }}
//           className="w-full"
//         />

//         <CustomTextField
//           select
//           size="small"
//           defaultValue="all"
//           className="w-full"
//         >
//           <MenuItem value="all">All meals</MenuItem>
//           <MenuItem value="breakfast">Breakfast</MenuItem>
//           <MenuItem value="lunch">Lunch</MenuItem>
//         </CustomTextField>

//         <button
//           // onClick={handleQuickAdd}
//           className="flex flex-col items-center w-full h-full text-[#01933C] font-semibold whitespace-nowrap text-left" // match TextField height
//         >
//           <AddCircleOutlineIcon fontSize="small" className="mr-1" />
//           Quick Add
//         </button>
//       </div>

//       {/* Tabs */}
//       <div className="flex border-b mb-2">
//         <button
//           onClick={() => setActiveTab("all")}
//           className={`flex-1 text-center pb-2 font-semibold ${
//             activeTab === "all"
//               ? "text-[#01933C] border-b-2 border-[#01933C]"
//               : "text-gray-500"
//           }`}
//         >
//           All Meals
//         </button>
//         <button
//           onClick={() => setActiveTab("past")}
//           className={`flex-1 text-center pb-2 font-semibold ${
//             activeTab === "past"
//               ? "text-[#01933C] border-b-2 border-[#01933C]"
//               : "text-gray-500"
//           }`}
//         >
//           Past Selections
//         </button>
//       </div>

//       {/* Meal List */}
//       <ul className="divide-y">
//         {meals.map((meal, index) => (
//           <li
//             key={index}
//             className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
//           >
//             <span>
//               {meal.name}, {meal.type}
//               {meal.time && ` ${meal.time}`}{" "}
//               <strong>({meal.calories} calories)</strong>
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SelectMealToAdd;

import { useCallback, useEffect, useRef, useState } from "react";
import { TextField, InputAdornment, MenuItem, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CustomTextField from "./CustomTextField";
import CustomSelectController from "./CustomSelectController";
import { Controller, useForm } from "react-hook-form";
import {
  useFetchFavMealList,
  useFetchSlotNames,
  useGetFavMealDetails,
  useGetMealPlan,
  useGetRecentMealList,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import CommonLoader from "../CommonLoader";

const SelectMealToAdd = ({
  setShowAddMealView,
  onAddMealInPlan,
  activeStep,
  loading,
}) => {
  const {
    data: favMealsData,
    isPending: isLoadingFavMeals,
    isError: isErrorFavMeals,
    error: errorFavMeal,
    refetch: refetchFavMeals,
  } = useFetchFavMealList();

  //   const selectedMealType = watch("mealType");
  // const searchValue = watch("search"); // if you add a search input field

  // const {
  //   data: favMealsData,
  //   isPending,
  //   isError,
  // } = useFetchFavMealList({
  //   mealType: selectedMealType,
  //   search: searchValue,
  // });

  const { data: names = [], isLoading: isNamesLoading } = useFetchSlotNames();
  console.log("names", names);
  //   const {
  //   data: recentSelectedMeal,
  //   isPending: isLoadingRecentMeal,
  //   isError: isErrorRecentMeal,
  //   error: errorRecentMeal,
  //   refetch: refetchRecentFavMeals,
  // } = useGetRecentMealList({ page: 1, limit: 10 });

  // useEffect(()=>{
  //   refetchFavMeals();
  // })
  const FavMealData = favMealsData?.data;
  console.log("FavMealData", FavMealData);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFavMealId, setSelectedFavMealId] = useState("");
  const [selectedFavId, setSelectedFavId] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      mealType: "all",
      search: "",
    },
  });
  const {
    data: pastMealsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPastMeals,
    isError,
  } = useGetRecentMealList({
    type: ["favorite_meal"],
    enabled: activeTab === "past",
    limit: 10,
  });

  // const observerRef = useRef();

  // const lastItemRef = useCallback(
  //   (node) => {
  //     if (isFetchingNextPage) return;

  //     if (observerRef.current) observerRef.current.disconnect();

  //     observerRef.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && hasNextPage) {
  //         fetchNextPage();
  //       }
  //     });

  //     if (node) observerRef.current.observe(node);
  //   },
  //   [isFetchingNextPage, hasNextPage, fetchNextPage]
  // );

  const observerRef = useRef();

  const lastItemRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const {
    data: favMealDetails,
    refetch,
    isPending: isGetMealPlanPending,
  } = useGetFavMealDetails({
    favMealId: selectedFavMealId,
    enabled: !!selectedFavMealId,
  });
  useEffect(() => {
    if (favMealDetails) {
      setSelectedMeal(favMealDetails?.data);
    }
  }, [favMealDetails]);

  const handleAddMeal = (favMealId, favapipassid) => {
    setSelectedFavMealId(favMealId);
    setSelectedFavId(favapipassid);
  };

  if (loading) return <CommonLoader />;
  if (selectedMeal) {
    return (
      <>
        <div className="flex flex-col flex-1 p-2 border rounded-md bg-white shadow-sm overflow-auto max-w-4xl mx-auto w-full">
          <div className="flex flex-col items-start">
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                setSelectedMeal(null);
                setSelectedFavId(null);
                setSelectedFavMealId(null);
              }}
            >
              Back
            </Button>
          </div>
          <h2 className="text-lg font-semibold text-center mb-4">
            {selectedMeal.title} {selectedMeal.time}
          </h2>

          {/* <ul className="flex flex-1 flex-col overflow-auto border border-gray-400 divide-y bg-gray-50 rounded-md">
            {selectedMeal?.meal_plan_foods?.map((item, idx) => {
              const quantity =
                item.integral || item.nominator
                  ? `${item.integral ?? ""}${
                      item.nominator && item.denominator
                        ? ` ${item.nominator}/${item.denominator}`
                        : ""
                    }`
                  : "—";

              return (
                <li key={idx} className="p-3 text-sm flex justify-between">
                  <span className="text-gray-800">
                    {item.food?.name ?? "Unnamed Food"}&nbsp;
                    <span className="text-gray-500">
                      ({quantity} {item.unit ?? "person"})
                    </span>
                  </span>

                  <span className="text-gray-600 text-right">
                    <strong>
                      {`${Number(item.calories || 0).toFixed(2)} Cal | 
            ${Number(item.carbs || 0).toFixed(2)}g Carbs | 
            ${Number(item.protein || 0).toFixed(2)}g Protein | 
            ${Number(item.fat || 0).toFixed(2)}g Fat | 
            ${Number(item.fluid || 0).toFixed(2)}ml Fluid`}
                    </strong>
                  </span>
                </li>
              );
            })}
          </ul> */}
          <ul className="flex flex-1 flex-col overflow-auto border border-gray-400 divide-y bg-gray-50 rounded-md">
            {selectedMeal?.meal_plan_foods?.map((item, idx) => {
              const quantity =
                item.integral || item.nominator
                  ? `${item.integral ?? ""}${
                      item.nominator && item.denominator
                        ? ` ${item.nominator}/${item.denominator}`
                        : ""
                    }`
                  : "—";

              return (
                <li
                  key={idx}
                  className={`p-3 text-sm flex justify-between ${
                    idx % 2 === 1 ? "bg-gray-50" : "bg-gray-100"
                  }`}
                >
                  <span className="text-gray-800">
                    {item.food?.name ?? "Unnamed Food"}&nbsp;
                    <span className="text-gray-500">
                      ({quantity} {item.unit ?? "person"})
                    </span>
                  </span>

                  <span className="text-gray-600 text-right">
                    <strong>
                      {`${Number(item.calories || 0).toFixed(2)} Cal | 
            ${Number(item.carbs || 0).toFixed(2)}g Carbs | 
            ${Number(item.protein || 0).toFixed(2)}g Protein | 
            ${Number(item.fat || 0).toFixed(2)}g Fat | 
            ${Number(item.fluid || 0).toFixed(2)}ml Fluid`}
                    </strong>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="flex justify-center mt-4 gap-2">
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => {
                setSelectedMeal(null);
                setSelectedFavId(null);
                setSelectedFavMealId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#01933C", textTransform: "none" }}
              onClick={() => onAddMealInPlan(selectedFavId, activeStep)}
              // onClick={() => onAddMealInPlan(selectedFavId, activeStep)}
            >
              Select This Meal
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col flex-1 p-2 border rounded-md bg-white shadow-sm overflow-auto max-w-6xl mx-auto w-full">
        {/* Back Button */}
        <div className="self-start">
          <Button
            variant="text"
            color="primary"
            onClick={() => {
              setSelectedMeal(null);
              setSelectedFavId(null);
              setSelectedFavMealId(null);
              setShowAddMealView(false);
            }}
            sx={{ m: 0 }}
          >
            Back to Meals
          </Button>
        </div>

        <h2 className="text-lg font-semibold mb-4 text-center">
          Select Meal To Add
        </h2>

        {/* Search & Filter */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 items-center p-1">
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                size="small"
                placeholder="Search Meals"
                InputProps={{
                  sx: {
                    "& .MuiInputBase-input": {
                      paddingY: 0.5,
                      paddingX: 0,
                    },
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" className="text-gray-500" />
                    </InputAdornment>
                  ),
                }}
                className="w-full"
              />
            )}
          />

         
          <CustomSelectController
            name="mealType"
            control={control}
            options={[
              { label: "All meals", value: "all" },
              ...names.map((slot) => ({
                label: slot.name,
                value: slot.id, // or slot.name if you want to filter by name instead of id
              })),
            ]}
            renderValueLabel="Select meal type"
            size="small"
          />
        </div> */}

        {/* Tabs */}
        <div className="flex border-b mb-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 text-center pb-2 font-semibold ${
              activeTab === "all"
                ? "text-[#01933C] border-b-2 border-[#01933C]"
                : "text-gray-500"
            }`}
          >
            All Meals
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 text-center pb-2 font-semibold ${
              activeTab === "past"
                ? "text-[#01933C] border-b-2 border-[#01933C]"
                : "text-gray-500"
            }`}
          >
            Past Selections
          </button>
        </div>

        {/* Meal List */}
        {/* <ul className="flex flex-col gap-3">
          {FavMealData?.map((favMeal) => {
            const slot = favMeal.meal_plan_slot;
            const handleMealClick = () => {
              handleAddMeal(slot.id);
              setSelectedFavId(favMeal.id);
            };
            return (
              <li
                key={favMeal.id}
                className="border rounded p-2 cursor-pointer hover:bg-green-100 hover:shadow hover:border-green-500 transition duration-200"
                onClick={handleMealClick}
              >
                <span className="font-semibold mr-2">{slot.title}:</span>
                <span>
                  {`Calories: ${slot.total_calories} | Carbs: ${slot.total_carbs} | Protein: ${slot.total_protein} | Fat: ${slot.total_fat} | Fluid: ${slot.total_fluid}`}
                </span>
              </li>
            );
          })}
        </ul> */}

        {activeTab === "all" && (
          <ul className="flex flex-col gap-3 overflow-auto">
            {FavMealData?.map((favMeal) => {
              const slot = favMeal.meal_plan_slot;
              const favpassapiId = favMeal?.id;

              return (
                <li
                  key={favMeal.id}
                  onClick={() => handleAddMeal(slot.id, favpassapiId)}
                  // onClick={() => handleAddMeal(favMeal.id)}
                  className="cursor-pointer border rounded p-2 hover:bg-gray-50 transition"
                >
                  <span className="font-semibold mr-2">{slot.title}:</span>
                  <span>
                    {`Calories: ${(slot.total_calories ?? 0).toFixed(2)} | 
Carbs: ${(slot.total_carbs ?? 0).toFixed(2)} | 
Protein: ${(slot.total_protein ?? 0).toFixed(2)} | 
Fat: ${(slot.total_fat ?? 0).toFixed(2)} | 
Fluid: ${(slot.total_fluid ?? 0).toFixed(2)}`}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {/* {activeTab === "past" && (
          <ul className="flex flex-col gap-3">
            {pastMealsData?.pages?.flatMap((page, pageIndex) =>
              page.meals?.map((item, idx) => {
                const mealSlot = item.favorite_meal?.meal_plan_slot;
                const mealTitle = mealSlot?.title ?? "Untitled";
                const favMealId = item.favorite_meal?.id;

                const isLastItem =
                  pageIndex === pastMealsData.pages.length - 1 &&
                  idx === page.meals.length - 1;

                return (
                  <li
                    key={item.id}
                    className="cursor-pointer border rounded p-2 hover:bg-gray-50 transition"
                    ref={isLastItem ? lastItemRef : null}
                    onClick={() =>
                      console.log("Select past meal ID:", favMealId)
                    }
                  >
                    <span className="font-semibold mr-2">{mealTitle}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {new Date(item.selection_date).toLocaleString()}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        )} */}

        {activeTab === "past" && (
          <>
            <ul className="flex flex-col gap-3 overflow-auto">
              {pastMealsData?.pages?.flatMap((page, pageIndex) =>
                page.meals?.map((item, idx) => {
                  const mealSlot = item.favorite_meal?.meal_plan_slot;
                  const mealTitle = mealSlot?.title ?? "Untitled";
                  const favMealId = item.favorite_meal?.id;
                  // const slot = item.favorite_meal.meal_plan_slot;
                  const isLastItem =
                    pageIndex === pastMealsData.pages.length - 1 &&
                    idx === page.meals.length - 1;
                  return (
                    <li
                      key={item.id}
                      className="cursor-pointer border rounded p-2 hover:bg-gray-50 transition"
                      ref={isLastItem ? lastItemRef : null}
                      // onClick={() =>

                      //   console.log("Select past meal ID:", favMealId)
                      // }
                      onClick={() => handleAddMeal(mealSlot.id, favMealId)}
                    >
                      <span className="font-semibold mr-2">{mealTitle}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {new Date(item.selection_date).toLocaleString()}
                      </span>
                    </li>
                  );
                })
              )}
            </ul>

            {isFetchingNextPage && (
              <div className="text-center text-gray-500 text-sm mt-2">
                Loading more...
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SelectMealToAdd;
