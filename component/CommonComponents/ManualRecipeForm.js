import React from "react";
import { Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import TableDeleteActionButton from "./TableDeleteActionButton"; // Adjust the path as needed
import CustomTextField from "./CustomTextField"; // Adjust the path
import CustomSelectController from "./CustomSelectController"; // Adjust the path

const ManualRecipeForm = ({
  recipeData,
  servings,
  isEditingServings,
  control,
  errors,
  setOpenServingModal,
  toggleFavorite,
  setIsEditingServings,
  setServingToDelete,
  setDeleteConfirmOpen,
  setNumberOfServings,
}) => {
  return (
    <div className="flex flex-1 flex-col overflow-auto border border-gray-300 p-2 rounded-md">
      {servings.map((serving, index) => {
        const isEditing = isEditingServings[serving.id] ?? false;

        return (
          <div
            key={serving.id}
            className="flex flex-col max-w-xl w-full mx-auto border p-4 rounded shadow-sm bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-semibold">Food #{index + 1}</span>
                <div className="pt-1">
                  <button
                    className="text-sm text-green-600 underline"
                    onClick={() => {
                      setOpenServingModal(true);
                    }}
                  >
                    + Add Serving
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                {/* Favorite Icon Button */}
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() =>
                    toggleFavorite(serving.id, !serving.is_favorite)
                  }
                  sx={{ p: 0.25 }}
                >
                  {serving.is_favorite ? (
                    <FavoriteIcon sx={{ fontSize: "1.5rem" }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ fontSize: "1.5rem" }} />
                  )}
                </IconButton>

                {isEditing ? (
                  <button
                    className="text-sm underline text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditingServings((prev) => ({
                        ...prev,
                        [serving.id]: false,
                      }));
                    }}
                  >
                    Cancel
                  </button>
                ) : (
                  <TableDeleteActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setServingToDelete(serving);
                      setDeleteConfirmOpen(true);
                    }}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* ✅ TOTAL NUTRITION DISPLAY */}
      {servings.length > 0 && (
        <div className="max-w-3xl mx-auto mt-4 p-4 border rounded bg-gray-50 text-sm">
          <h4 className="font-semibold mb-2">Total Nutrition:</h4>
          {(() => {
            const total = servings.reduce(
              (acc, s) => {
                acc.calories += Number(s.calories) || 0;
                acc.carbs += Number(s.carbs) || 0;
                acc.protein += Number(s.protein) || 0;
                acc.fat += Number(s.fat) || 0;
                acc.fluid += Number(s.fluid) || 0;
                return acc;
              },
              { calories: 0, carbs: 0, protein: 0, fat: 0, fluid: 0 }
            );

            return (
              <div className="flex flex-wrap gap-x-4">
                <span>
                  <strong>Calories:</strong> {total.calories.toFixed(2)} g
                </span>
                <span>
                  <strong>Carbs:</strong> {total.carbs.toFixed(2)} g
                </span>
                <span>
                  <strong>Protein:</strong> {total.protein.toFixed(2)} g
                </span>
                <span>
                  <strong>Fat:</strong> {total.fat.toFixed(2)} g
                </span>
                <span>
                  <strong>Fluid:</strong> {total.fluid.toFixed(2)} fl oz
                </span>
              </div>
            );
          })()}
        </div>
      )}

      {/* Instructions and Servings */}
      <div className="flex flex-row mx-auto w-full max-w-3xl gap-2 my-2 ">
        {/* Instructions Field */}
        <div className="w-1/2">
          <label className="input-label block mb-1">Recipe Instructions*</label>
          <Controller
            name="recipe_instructions"
            control={control}
            // rules={{ required: "This field is required" }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                placeholder="Type the instructions"
                multiline
                minRows={6}
              />
            )}
          />
          <ErrorMessage
            errors={errors}
            name="recipe_instructions"
            render={({ message }) => (
              <p className="text-red-500 text-sm mb-2">{message}</p>
            )}
          />
        </div>

        {/* Number of Servings */}
        <div className="w-1/2">
          <label className="input-label block mb-1">Number of Servings</label>
          <CustomSelectController
            name="no_of_servings"
            control={control}
            onChange={setNumberOfServings}
            renderValueLabel="Select Meals"
            options={Array.from({ length: 10 }, (_, i) => ({
              label: `${i + 1}`,
              value: i + 1,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default ManualRecipeForm;
