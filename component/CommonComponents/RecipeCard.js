"use client";
import { useSaveRecipe } from "@/helpers/hooks/mamAdmin/mealPlanList";
import { useRouter } from "next/navigation";
import React from "react";

const RecipeCard = ({ recipeData, recipeFoodData }) => {
  // const saveRecipe = useSaveRecipe();
  const router = useRouter();
  const { mutate: saveRecipe } = useSaveRecipe();
  const handleSelect = (isDraft) => {
    saveRecipe({
      recipe_id: recipeNewData?.id,
      is_draft: isDraft,
    });
  };
  const recipeNewData = recipeData?.data;
  const foodNewData = recipeFoodData?.data;

  const recipe = {
    name: recipeNewData?.name || "Untitled Recipe",
    ingredients:
      foodNewData?.ingredients?.length > 0
        ? foodNewData.ingredients.map((item) => ({
            name: item.ingredient?.name || "Unnamed ingredient",
            quantity: `${item.integral} ${
              item.nominator && item.denominator
                ? `${item.nominator}/${item.denominator}`
                : ""
            } ${item.unit || ""}`.trim(),
          }))
        : [{ name: "No ingredients added", quantity: "-" }],
    instructions: foodNewData?.instruction
      ? foodNewData.instruction.split("\n")
      : ["No instructions available."],
    servings: foodNewData?.no_of_servings || "N/A",
  };

  const hanldeCancel = () => {
    router.back();
  };
  return (
    <div className="bg-white shadow-md rounded-md flex flex-1 flex-col mx-auto overflow-auto w-full">
      {/* Title */}

      {/* Main Grid */}
      <div className="flex flex-col flex-1 overflow-auto h-full max-w-6xl mx-auto w-full border border-gray-300 rounded-md p-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-lg font-medium">📄</span>
          <h2 className="text-lg font-semibold capitalize">{recipe.name}</h2>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t overflow-auto">
          {/* Ingredients */}
          <div className="flex flex-col w-full items-center overflow-auto">
            <h3 className="flex w-full justify-center items-center font-semibold mb-2 border-b">
              Ingredients
            </h3>
            <div className="flex flex-col w-full justify-between space-y-2">
              {recipe.ingredients.map((item, idx) => (
                <div
                  key={idx}
                  className="border bg-gray-100 p-2 rounded flex justify-between max-w-lg"
                >
                  <span className="text-gray-800">{item.name}</span>
                  <span className="font-semibold text-gray-700">
                    {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="flex flex-col overflow-auto">
            <h3 className="flex w-full justify-center items-center font-semibold mb-2 border-b">
              Instructions
            </h3>
            <ol className="list-decimal  text-sm p-1 text-gray-700 overflow-auto border rounded-md">
              {recipe.instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
            <p className="mt-3 font-medium text-sm">
              Makes: {recipe.servings} servings.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      {recipeData && (
        <div className="flex justify-center gap-4 w-full mx-auto m-2 border-t border-gray-300 pt-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm text-gray-800"
            onClick={hanldeCancel}
          >
            CANCEL
          </button>
          <button
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
            onClick={() => handleSelect(false)}
          >
            SELECT AS IS
          </button>
          <button
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
            onClick={() => handleSelect(true)}
          >
            SELECT & EDIT
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
