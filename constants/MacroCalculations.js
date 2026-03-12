// import { mealTypes } from "@/utils/utils";
// import {
//   Document,
//   Page,
//   StyleSheet,
//   Text,
//   View,
//   Image,
// } from "@react-pdf/renderer";

// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontSize: 10,
//     fontFamily: "Helvetica",
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     marginBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//     paddingBottom: 10,
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   logoContainer: {
//     width: 120,
//   },
//   tagline: {
//     fontSize: 10,
//     color: "#006400",
//     textAlign: "right",
//   },
//   dayHeader: {
//     backgroundColor: "#006400",
//     color: "#fff",
//     padding: 8,
//     fontWeight: "bold",
//     fontSize: 12,
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   mealSection: {
//     marginBottom: 20,
//     borderLeft: 2,
//     borderRight: 2,
//     borderColor: "#eee",
//     paddingHorizontal: 10,
//   },
//   mealTitle: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#333",
//     paddingBottom: 5,
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#e0e0e0",
//     marginBottom: 8,
//   },
//   mealContent: {
//     marginTop: 5,
//     marginBottom: 15,
//     paddingHorizontal: 5,
//   },
//   mealInfo: {
//     flexDirection: "row",
//     marginBottom: 10,
//     alignItems: "center",
//     flexWrap: "wrap",
//     justifyContent: "flex-start",
//   },
//   mealLabel: {
//     fontSize: 9,
//     fontWeight: "bold",
//     color: "#333",
//     marginRight: 5,
//     width: 85,
//   },
//   nutrientContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   nutrientLabel: {
//     fontSize: 9,
//     fontWeight: "bold",
//     color: "#333",
//     marginRight: 2,
//   },
//   nutrientValue: {
//     fontSize: 9,
//     color: "#666",
//     marginRight: 2,
//   },
//   separator: {
//     fontSize: 9,
//     color: "#999",
//     marginHorizontal: 6,
//   },
//   notesLabel: {
//     fontSize: 9,
//     fontWeight: "bold",
//     color: "#333",
//     marginTop: 5,
//     paddingLeft: 5,
//   },
//   divider: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//     marginVertical: 5,
//   },
//   dayTotal: {
//     backgroundColor: "#006400",
//     color: "#fff",
//     padding: 8,
//     fontSize: 10,
//     marginTop: 15,
//     textAlign: "center",
//   },
//   footer: {
//     position: "absolute",
//     bottom: 30,
//     left: 30,
//     right: 30,
//     fontSize: 8,
//     color: "#666",
//     borderTopWidth: 1,
//     borderTopColor: "#e0e0e0",
//     paddingTop: 10,
//   },
//   footerText: {
//     textAlign: "center",
//     fontSize: 7,
//     marginBottom: 5,
//   },
//   disclaimer: {
//     fontSize: 6,
//     color: "#888",
//     lineHeight: 1.2,
//   },
//   foodList: {
//     marginTop: 6,
//     marginBottom: 6,
//   },

//   foodListLabel: {
//     fontWeight: "bold",
//     fontSize: 12,
//     marginBottom: 2,
//   },

//   foodName: {
//     fontSize: 11,
//     marginLeft: 8,
//   },
//   nutrientLabel: {
//     fontSize: 9,
//     fontWeight: "bold",
//     color: "#333",
//     marginRight: 12,
//     width: 40,
//     textAlign: "left",
//   },

//   nutrientValue: {
//     fontSize: 9,
//     color: "#555",
//     marginRight: 12,
//     width: 40,
//     textAlign: "left",
//   },

//   foodName: {
//     fontSize: 9,
//     color: "#000",
//     textAlign: "left",
//   },
// });

// const formatServing = (integral, nominator, denominator) => {
//   const int = integral || 0;
//   const num = nominator || 0;
//   const den = denominator || 0;

//   let parts = [];
//   if (int > 0) parts.push(int);
//   if (num > 0 && den > 0) parts.push(`${num}/${den}`);
//   return parts.join(" ");
// };

// const formatNumber = (val) => {
//   return val ? Number(val).toFixed(2) : "0.00";
// };

// const MacroCalculations = ({
//   results,
//   bodyMetrics,
//   unitSystem,
//   TDEE,
//   selectedDiet,
// }) => {
//   //   <Page size="A4" style={styles.page}>
//   //     <View style={styles.header}>
//   //       <View style={styles.logoContainer}>
//   //         <Image
//   //           alt="txt"
//   //           src="/images/logo-with-name.png"
//   //           style={{ width: 140, height: 50 }}
//   //         />
//   //       </View>
//   //       <Text style={styles.tagline}>Eating right, simplified.</Text>
//   //     </View>

//   //     <View style={styles.dayHeader}>
//   //       <Text>DAY {dayData?.day_number}</Text>
//   //     </View>

//   //     {dayData?.meal_plan_slots.map((item, idx) => (
//   //       <View
//   //         style={{
//   //           borderWidth: 1,
//   //           borderColor: "#ccc",
//   //           borderRadius: 8,
//   //           padding: 10,
//   //           marginBottom: 12,
//   //         }}
//   //         key={idx}
//   //       >
//   //         <Text style={[styles.mealTitle, { marginBottom: 6 }]}>
//   //           {item.title}
//   //         </Text>

//   //         <View
//   //           style={[
//   //             styles.mealInfo,
//   //             {
//   //               borderBottomWidth: 0.5,
//   //               borderBottomColor: "#ccc",
//   //               paddingBottom: 4,
//   //               marginBottom: 4,
//   //             },
//   //           ]}
//   //         >
//   //           <Text style={[styles.mealLabel, { width: 60 }]}>Food</Text>
//   //           <Text
//   //             style={[styles.nutrientLabel, { flex: 1, textAlign: "center" }]}
//   //           >
//   //             Cal
//   //           </Text>
//   //           <Text
//   //             style={[styles.nutrientLabel, { flex: 1, textAlign: "center" }]}
//   //           >
//   //             Carb
//   //           </Text>
//   //           <Text
//   //             style={[styles.nutrientLabel, { flex: 1, textAlign: "center" }]}
//   //           >
//   //             Prot
//   //           </Text>
//   //           <Text
//   //             style={[styles.nutrientLabel, { flex: 1, textAlign: "center" }]}
//   //           >
//   //             Fat
//   //           </Text>
//   //           <Text
//   //             style={[styles.nutrientLabel, { flex: 1, textAlign: "center" }]}
//   //           >
//   //             H₂O
//   //           </Text>
//   //         </View>

//   //         {item.meal_plan_foods.map((foodItem, foodIdx) => (
//   //           <View style={styles.mealInfo} key={foodIdx}>
//   //             <Text style={[styles.foodName, { width: 70 }]}>
//   //               {foodItem.food.name}{" "}
//   //               {formatServing(
//   //                 foodItem.integral,
//   //                 foodItem.nominator,
//   //                 foodItem.denominator
//   //               )}{" "}
//   //               {foodItem.unit || "persons"}
//   //             </Text>
//   //             <Text
//   //               style={[
//   //                 styles.nutrientValue,
//   //                 { flex: 1, textAlign: "center" },
//   //               ]}
//   //             >
//   //               {formatNumber(foodItem.calories || 0)}kcal
//   //             </Text>
//   //             <Text
//   //               style={[
//   //                 styles.nutrientValue,
//   //                 { flex: 1, textAlign: "center" },
//   //               ]}
//   //             >
//   //               {formatNumber(foodItem.carbs || 0)}g
//   //             </Text>
//   //             <Text
//   //               style={[
//   //                 styles.nutrientValue,
//   //                 { flex: 1, textAlign: "center" },
//   //               ]}
//   //             >
//   //               {formatNumber(foodItem.protein || 0)}g
//   //             </Text>
//   //             <Text
//   //               style={[
//   //                 styles.nutrientValue,
//   //                 { flex: 1, textAlign: "center" },
//   //               ]}
//   //             >
//   //               {formatNumber(foodItem.fat || 0)}g
//   //             </Text>
//   //             <Text
//   //               style={[
//   //                 styles.nutrientValue,
//   //                 { flex: 1, textAlign: "center" },
//   //               ]}
//   //             >
//   //               {formatNumber(foodItem.fluid || 0)}ml
//   //             </Text>
//   //           </View>
//   //         ))}

//   //         <View
//   //           style={[
//   //             styles.mealInfo,
//   //             {
//   //               backgroundColor: "#f7f7f7",
//   //               padding: 6,
//   //               borderRadius: 4,
//   //               marginTop: 8,
//   //             },
//   //           ]}
//   //         >
//   //           <Text style={[styles.mealLabel, { width: 60 }]}>Meal Totals</Text>
//   //           <Text
//   //             style={[styles.nutrientValue, { flex: 1, textAlign: "center" }]}
//   //           >
//   //             {formatNumber(item.total_calories || 0)}kcal
//   //           </Text>
//   //           <Text
//   //             style={[styles.nutrientValue, { flex: 1, textAlign: "center" }]}
//   //           >
//   //             {formatNumber(item.total_carbs || 0)}g
//   //           </Text>
//   //           <Text
//   //             style={[styles.nutrientValue, { flex: 1, textAlign: "center" }]}
//   //           >
//   //             {formatNumber(item.total_protein || 0)}g
//   //           </Text>
//   //           <Text
//   //             style={[styles.nutrientValue, { flex: 1, textAlign: "center" }]}
//   //           >
//   //             {formatNumber(item.total_fat || 0)}g
//   //           </Text>
//   //           <Text
//   //             style={[styles.nutrientValue, { flex: 1, textAlign: "center" }]}
//   //           >
//   //             {formatNumber(item.total_fluid || 0)}ml
//   //           </Text>
//   //         </View>
//   //       </View>
//   //     ))}

//   //     <View style={styles.dayTotal}>
//   //       <Text>
//   //         DAY {dayData?.day_number} TOTAL: Calories{" "}
//   //         {formatNumber(dayData?.total_calories) || 0} cal | Carbs{" "}
//   //         {formatNumber(dayData?.total_carbs) || 0} g | Protein{" "}
//   //         {formatNumber(dayData?.total_protein) || 0} g | Fat{" "}
//   //         {formatNumber(dayData?.total_fat) || 0} g | Fluid{" "}
//   //         {formatNumber(dayData?.total_fluid) || 0} ml
//   //       </Text>
//   //     </View>

//   //     <View style={styles.footer}>
//   //       <Text style={styles.footerText}>
//   //         Powered by Macros & Meals Nutrition. Copyright © 2025. All Rights
//   //         Reserved.
//   //       </Text>
//   //       <Text style={styles.disclaimer}>
//   //         {`The contents of the Macros & Meals Nutrition website, such as text, graphics, images, information, charts, obtained from Macros & Meals Nutrition licensors, including information, advice and coaching received either in printed or electronic form, and other material contained on the Macros & Meals Nutrition website ("Content") are for informational purposes only. The Content is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on or from the Macros & Meals Nutrition website.`}
//   //       </Text>
//   //     </View>
//   //   </Page>
//   return (
//     <Document>
//       <Text>Macro Calculations</Text>

//       {/* Example usage */}
//       <Text>Unit System: {unitSystem}</Text>
//       <Text>TDEE Value: {TDEE}</Text>

//       <Text>Body Metrics</Text>
//       <Text>Age: {bodyMetrics.age}</Text>
//       <Text>Gender: {bodyMetrics.gender === "male" ? "Male" : "Female"}</Text>

// <Text>Selected Diet: {selectedDiet}</Text>

//       <Text>Height: {bodyMetrics?.originalValues.height}</Text>
//       <Text>Weight: {bodyMetrics?.originalValues.weight}</Text>

//       <Text>Results</Text>
//       <Text>Calories: {results.calories}</Text>
//       <Text>Protein: {results.protein}g</Text>
//       <Text>Carbs: {results.carbs}g</Text>
//       <Text>Fats: {results.fats}g</Text>

//       <Text>Percentage Values:</Text>
//       <Text>Protins:</Text>
//       <Text>Carbs:</Text>
//       <Text>Fats:</Text>
//     </Document>
//   );

//   //   return (
//   //     <Document>
//   //       {data?.meal_plan_days?.map((item) => (
//   //         <DayPage key={item?.id} dayData={item} />
//   //       ))}
//   //     </Document>
//   //   );
// };

// export default MacroCalculations;

// import { StyleSheet, Text, View } from "@react-pdf/renderer";
// import { dietTypes } from "./macroCalculator";

// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontSize: 12,
//     fontFamily: "Helvetica",
//     color: "#333",
//   },
//   heading: {
//     fontSize: 20,
//     marginBottom: 15,
//     color: "#1B5E20", // dark green
//     textAlign: "center",
//     fontWeight: "bold",
//   },
//   section: {
//     marginBottom: 12,
//     padding: 10,
//     borderBottom: "1px solid #A5D6A7", // light green divider
//   },
//   label: {
//     fontSize: 12,
//     color: "#2E7D32", // medium green
//     fontWeight: "bold",
//   },
//   value: {
//     fontSize: 12,
//     marginLeft: 4,
//     color: "#1B5E20",
//   },
//   row: {
//     flexDirection: "row",
//     marginBottom: 4,
//   },
//   resultsBox: {
//     marginTop: 12,
//     padding: 10,
//     backgroundColor: "#E8F5E9", // pale green background
//     borderRadius: 6,
//   },
//   resultText: {
//     fontSize: 12,
//     marginBottom: 3,
//     color: "#1B5E20",
//   },
// });

// const MacroCalculations = ({
//   results,
//   bodyMetrics,
//   unitSystem,
//   TDEE,
//   selectedDiet,
// }) => {
//   const selectedDietLabel =
//     dietTypes.find((d) => d.value === selectedDiet)?.label || "Not specified";
//   return (
//     <View style={styles.page}>
//       {/* Title */}
//       <Text style={styles.heading}>Macro Calculations</Text>

//       {/* General Info */}
//       <View style={styles.resultsBox}>
//         <View style={styles.row}>
//           <Text style={styles.label}>Unit System:</Text>
//           <Text style={styles.value}>{unitSystem}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>TDEE Value:</Text>
//           <Text style={styles.value}>{TDEE}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Selected Diet:</Text>
//           <Text style={styles.value}>{selectedDietLabel}</Text>
//         </View>
//       </View>

//       {/* Body Metrics */}
//       <View style={styles.resultsBox}>
//         <Text style={styles.label}>Body Metrics:</Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Age:</Text>
//           <Text style={styles.value}>{bodyMetrics.age}</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Gender:</Text>
//           <Text style={styles.value}>
//             {bodyMetrics.gender === "male" ? "Male" : "Female"}
//           </Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Height:</Text>
//           <Text style={styles.value}>
//             {bodyMetrics?.originalValues?.height}
//           </Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Weight:</Text>
//           <Text style={styles.value}>
//             {bodyMetrics?.originalValues?.weight}
//           </Text>
//         </View>
//       </View>

//       {/* Results */}
//       <View style={styles.resultsBox}>
//         <Text style={styles.label}>Results:</Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Calories: </Text>
//           <Text style={styles.value}>{results.calories}kcal</Text>
//         </View>

//         <View style={styles.row}>
//           <Text style={styles.label}>Protein: </Text>
//           <Text style={styles.value}>{results.protein} g</Text>
//         </View>

//         <View style={styles.row}>
//           <Text style={styles.label}>Carbs: </Text>
//           <Text style={styles.value}>{results.carbs} g</Text>
//         </View>

//         <View style={styles.row}>
//           <Text style={styles.label}>Fats: </Text>
//           <Text style={styles.value}>{results.fats} g</Text>
//         </View>
//       </View>

//       {/* Percentages */}
//       <View style={styles.resultsBox}>
//         <Text style={styles.label}>Percentage Values:</Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Proteins: </Text>
//           <Text style={styles.value}>
//             {results?.macroPercentages?.protein}%
//           </Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Carbs: </Text>
//           <Text style={styles.value}>{results?.macroPercentages?.carbs}%</Text>
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Fats: </Text>
//           <Text style={styles.value}>{results?.macroPercentages?.fat}%</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default MacroCalculations;

// import { StyleSheet, Text, View } from "@react-pdf/renderer";
// import { dietTypes } from "./macroCalculator";

// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontSize: 12,
//     fontFamily: "Helvetica",
//     color: "#333",
//     backgroundColor: "#FAFAFA",
//   },
//   header: {
//     marginBottom: 7,
//     textAlign: "center",
//     backgroundColor: "#2E7D32",
//     padding: 10,
//     borderRadius: 8,
//   },
//   heading: {
//     fontSize: 18,
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 12,
//     color: "#C8E6C9",
//     textAlign: "center",
//     marginTop: 4,
//   },

//   // Card layouts
//   cardRow: {
//     flexDirection: "row",
//     marginBottom: 10,
//     gap: 15,
//   },
//   card: {
//     backgroundColor: "white",
//     padding: 8,
//     borderRadius: 8,
//     flex: 1,
//     border: "2px solid #E8F5E9",
//     minHeight: 60,
//   },
//   cardFull: {
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10,
//     border: "2px solid #E8F5E9",
//   },

//   cardTitle: {
//     fontSize: 11,
//     color: "#666",
//     fontWeight: "bold",
//     marginBottom: 4,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   cardValue: {
//     fontSize: 20,
//     color: "#2E7D32",
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   cardSubValue: {
//     fontSize: 10,
//     color: "#666",
//   },

//   // Section styling
//   sectionTitle: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#1B5E20",
//     marginBottom: 8,
//     textAlign: "center",
//     borderBottom: "2px solid #4CAF50",
//     paddingBottom: 4,
//   },

//   // Macro breakdown
//   macroContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   macroItem: {
//     alignItems: "center",
//     flex: 1,
//     padding: 8,
//     marginHorizontal: 3,
//     backgroundColor: "#F1F8E9",
//     borderRadius: 8,
//     borderLeft: "4px solid #4CAF50",
//   },
//   macroLabel: {
//     fontSize: 11,
//     color: "#666",
//     fontWeight: "bold",
//     marginBottom: 5,
//     textTransform: "uppercase",
//   },
//   macroValue: {
//     fontSize: 18,
//     color: "#2E7D32",
//     fontWeight: "bold",
//     marginBottom: 3,
//   },
//   macroPercent: {
//     fontSize: 10,
//     color: "#4CAF50",
//     fontWeight: "bold",
//   },

//   // Visual bars
//   barContainer: {
//     marginBottom: 8,
//   },
//   barLabel: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 3,
//   },
//   barLabelText: {
//     fontSize: 10,
//     color: "#333",
//     fontWeight: "bold",
//   },
//   barTrack: {
//     height: 11,
//     backgroundColor: "#E0E0E0",
//     borderRadius: 6,
//     position: "relative",
//     overflow: "hidden",
//   },
//   barFill: {
//     height: "100%",
//     borderRadius: 6,
//   },

//   // Info grid
//   infoGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 10,
//   },
//   infoItem: {
//     width: "48%",
//     padding: 6,
//     backgroundColor: "#F8F9FA",
//     borderRadius: 6,
//     borderLeft: "3px solid #4CAF50",
//   },
//   infoLabel: {
//     fontSize: 10,
//     color: "#666",
//     fontWeight: "bold",
//     marginBottom: 2,
//   },
//   infoValue: {
//     fontSize: 10,
//     color: "#2E7D32",
//     fontWeight: "bold",
//   },
//   infoSubValue: {
//     fontSize: 8,
//     color: "#2E7D32",
//     fontWeight: "bold",
//   },

//   // Calorie indicator
//   calorieIndicator: {
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#E8F5E9",
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   calorieText: {
//     fontSize: 14,
//     color: "#1B5E20",
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   calorieSubtext: {
//     fontSize: 11,
//     color: "#666",
//     textAlign: "center",
//   },

//   // Tips section
//   tipsContainer: {
//     backgroundColor: "#F1F8E9",
//     padding: 7,
//     borderRadius: 8,
//     borderLeft: "4px solid #4CAF50",
//   },
//   tipsTitle: {
//     fontSize: 13,
//     fontWeight: "bold",
//     color: "#2E7D32",
//     marginBottom: 2,
//   },
//   tipText: {
//     fontSize: 10,
//     color: "#333",
//     lineHeight: 1,
//     marginBottom: 1,
//   },
// });

// // Simple visual bar component
// const VisualBar = ({ label, value, max, color }) => {
//   const percentage = Math.min((value / max) * 100, 100);

//   return (
//     <View style={styles.barContainer}>
//       <View style={styles.barLabel}>
//         <Text style={styles.barLabelText}>{label}</Text>
//         <Text style={styles.barLabelText}>{value}g</Text>
//       </View>
//       <View style={styles.barTrack}>
//         <View
//           style={[
//             styles.barFill,
//             { width: `${percentage}%`, backgroundColor: color },
//           ]}
//         />
//       </View>
//     </View>
//   );
// };

// const MacroCalculations = ({
//   results,
//   calcBmrResult,
//   calcTDEEResult,
//   bodyMetrics,
//   unitSystem,
//   TDEE,
//   selectedDiet,
//   bmi,
// }) => {
//   const selectedDietLabel =
//     dietTypes.find((d) => d.value === selectedDiet)?.label || "Not specified";

//   // Calculate BMI
//   const heightInM =
//     unitSystem === "metric"
//       ? parseFloat(bodyMetrics?.originalValues?.height) / 100
//       : (parseFloat(bodyMetrics?.originalValues?.height) * 2.54) / 100;
//   const weightInKg =
//     unitSystem === "metric"
//       ? parseFloat(bodyMetrics?.originalValues?.weight)
//       : parseFloat(bodyMetrics?.originalValues?.weight) * 0.453592;
//   // const bmi = weightInKg / (heightInM * heightInM);

//   // Determine calorie status
//   const calorieStatus =
//     results.calories < TDEE
//       ? "Caloric Deficit"
//       : results.calories > TDEE
//       ? "Caloric Surplus"
//       : "Maintenance";
//   const calorieDiff = Math.abs(results.calories - TDEE);

//   return (
//     <View style={styles.page}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.heading}> Macro Nutrition Calculations</Text>
//         <Text style={styles.subtitle}>
//           Personalized nutrition breakdown •{" "}
//           {bodyMetrics?.gender === "male" ? "Male" : "Female"} • Age{" "}
//           {bodyMetrics?.age}
//         </Text>
//       </View>

//       {/* Key Metrics Row */}
//       <View style={styles.cardRow}>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Daily Calories</Text>
//           <Text style={styles.cardValue}>{results.calories}</Text>
//           <Text style={styles.cardSubValue}>kcal per day</Text>
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>TDEE</Text>
//           <Text style={styles.cardValue}>
//             {TDEE ? Number(TDEE).toFixed(2) : "--"}
//           </Text>
//           <Text style={styles.cardSubValue}>total daily energy</Text>
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>BMI</Text>
//           <Text style={styles.cardValue}>
//             {bmi ? Number(bmi).toFixed(2) : "--"}
//           </Text>
//           <Text style={styles.cardSubValue}>
//             {bmi < 18.5
//               ? "Underweight"
//               : bmi < 25
//               ? "Normal"
//               : bmi < 30
//               ? "Overweight"
//               : "Obese"}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.cardFull}>
//         <Text style={styles.sectionTitle}>BMR & Activity Levels</Text>
//         {calcBmrResult?.activityLevels?.map((item, index) => (
//           <View key={index} style={styles.infoItem}>
//             <Text style={styles.infoLabel}>{item.label}</Text>
//             <Text style={styles.infoValue}>{item.calories} kcal</Text>
//           </View>
//         ))}
//       </View>

//       <View style={styles.cardFull}>
//         <Text style={styles.sectionTitle}>Weight Management Options</Text>

//         <Text style={styles.subTitle}>Weight Loss</Text>
//         {calcTDEEResult?.weightLossOptions?.map((opt, idx) => (
//           <View key={idx} style={styles.infoItem}>
//             <Text style={styles.infoLabel}>{opt.label}</Text>
//             <Text style={styles.infoValue}>{opt.calories} kcal/day</Text>
//             <Text style={styles.infoSubValue}>{opt.percentage}% change</Text>
//           </View>
//         ))}

//         <Text style={styles.subTitle}>Weight Gain</Text>
//         {calcTDEEResult?.weightGainOptions?.map((opt, idx) => (
//           <View key={idx} style={styles.infoItem}>
//             <Text style={styles.infoLabel}>{opt.label}</Text>
//             <Text style={styles.infoValue}>{opt.calories} kcal/day</Text>
//             <Text style={styles.infoSubValue}>{opt.percentage}% change</Text>
//           </View>
//         ))}
//       </View>

//       {/* Macro Distribution */}
//       <View style={styles.cardFull}>
//         <Text style={styles.sectionTitle}>Macro Distribution</Text>
//         <View style={styles.macroContainer}>
//           <View style={styles.macroItem}>
//             <Text style={styles.macroLabel}>Protein</Text>
//             <Text style={styles.macroValue}>{results.protein}g</Text>
//             <Text style={styles.macroPercent}>
//               {results?.macroPercentages?.protein}%
//             </Text>
//           </View>
//           <View style={styles.macroItem}>
//             <Text style={styles.macroLabel}>Carbs</Text>
//             <Text style={styles.macroValue}>{results.carbs}g</Text>
//             <Text style={styles.macroPercent}>
//               {results?.macroPercentages?.carbs}%
//             </Text>
//           </View>
//           <View style={styles.macroItem}>
//             <Text style={styles.macroLabel}>Fats</Text>
//             <Text style={styles.macroValue}>{results.fats}g</Text>
//             <Text style={styles.macroPercent}>
//               {results?.macroPercentages?.fat}%
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Visual Progress Bars */}
//       <View style={styles.cardFull}>
//         <Text style={styles.sectionTitle}>Daily Targets</Text>
//         <VisualBar
//           label="Protein Target"
//           value={results.protein}
//           max={Math.round(results.protein * 1.2)}
//           color="#FF6B6B"
//         />
//         <VisualBar
//           label="Carbohydrate Target"
//           value={results.carbs}
//           max={Math.round(results.carbs * 1.2)}
//           color="#4ECDC4"
//         />
//         <VisualBar
//           label="Fat Target"
//           value={results.fats}
//           max={Math.round(results.fats * 1.2)}
//           color="#45B7D1"
//         />
//       </View>

//       {/* Personal Information Grid */}
//       <View style={styles.cardFull}>
//         <Text style={styles.sectionTitle}>Personal Profile</Text>
//         <View style={styles.infoGrid}>
//           <View style={styles.infoItem}>
//             <Text style={styles.infoLabel}>HEIGHT</Text>
//             <Text style={styles.infoValue}>
//               {bodyMetrics?.originalValues?.height}
//             </Text>
//           </View>
//           <View style={styles.infoItem}>
//             <Text style={styles.infoLabel}>WEIGHT</Text>
//             <Text style={styles.infoValue}>
//               {bodyMetrics?.originalValues?.weight}
//             </Text>
//           </View>
//           <View style={styles.infoItem}>
//             <Text style={styles.infoLabel}>DIET TYPE</Text>
//             <Text style={styles.infoValue}>{selectedDietLabel}</Text>
//           </View>
//           <View style={styles.infoItem}>
//             <Text style={styles.infoLabel}>UNIT SYSTEM</Text>
//             <Text style={styles.infoValue}>
//               {unitSystem === "metric" ? "Metric" : "US"}
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Tips Section */}
//       <View style={styles.tipsContainer}>
//         <Text style={styles.tipsTitle}>Nutrition Tips</Text>
//         <Text style={styles.tipText}>
//           • Distribute protein intake evenly throughout the day for optimal
//           muscle protein synthesis
//         </Text>
//         <Text style={styles.tipText}>
//           • Time carbohydrates around workouts for better performance and
//           recovery
//         </Text>
//         <Text style={styles.tipText}>
//           • Include healthy fats (omega-3, monounsaturated) for hormone
//           production and nutrient absorption
//         </Text>
//         <Text style={styles.tipText}>
//           • Stay hydrated with 8-10 glasses of water daily to support metabolism
//           and nutrient transport
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default MacroCalculations;

import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { activityData, dietTypes, goalData } from "./macroCalculator";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Helvetica",
    color: "#333",
    backgroundColor: "#FAFAFA",
  },
  header: {
    marginBottom: 10,
    textAlign: "center",
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 8,
  },
  heading: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 10,
    color: "#C8E6C9",
    textAlign: "center",
    marginTop: 3,
  },

  cardRow: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 3,
    border: "2px solid #E8F5E9",
    minHeight: 55,
  },
  cardTitle: {
    fontSize: 10,
    color: "#666",
    fontWeight: "bold",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  cardValue: { fontSize: 16, color: "#2E7D32", fontWeight: "bold" },
  cardSubValue: { fontSize: 9, color: "#666" },

  cardFull: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    border: "2px solid #E8F5E9",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 6,
    textAlign: "center",
  },

  macroContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  macroItem: {
    alignItems: "center",
    flex: 1,
    padding: 5,
    marginHorizontal: 2,
    backgroundColor: "#F1F8E9",
    borderRadius: 6,
    borderLeft: "3px solid #4CAF50",
  },
  macroLabel: {
    fontSize: 9,
    color: "#666",
    fontWeight: "bold",
    marginBottom: 2,
  },
  macroValue: { fontSize: 14, color: "#2E7D32", fontWeight: "bold" },
  macroPercent: { fontSize: 8, color: "#4CAF50", fontWeight: "bold" },

  barContainer: { marginBottom: 6 },
  barLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  barLabelText: { fontSize: 8, color: "#333", fontWeight: "bold" },
  barTrack: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 5 },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  infoItem: {
    width: "48%",
    padding: 5,
    backgroundColor: "#F8F9FA",
    borderRadius: 5,
    borderLeft: "3px solid #4CAF50",
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 8,
    color: "#666",
    fontWeight: "bold",
    marginBottom: 1,
  },
  infoValue: { fontSize: 10, color: "#2E7D32", fontWeight: "bold" },
  infoSubValue: { fontSize: 8, color: "#2E7D32", fontWeight: "bold" },

  tipsContainer: {
    backgroundColor: "#F1F8E9",
    padding: 6,
    borderRadius: 5,
    borderLeft: "3px solid #4CAF50",
    marginTop: 4,
  },
  tipsTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 2,
  },
  tipText: { fontSize: 8, color: "#333", lineHeight: 1.1, marginBottom: 1 },
});

// Visual bar component
const VisualBar = ({ label, value, max, color }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <View style={styles.barContainer}>
      <View style={styles.barLabel}>
        <Text style={styles.barLabelText}>{label}</Text>
        <Text style={styles.barLabelText}>{value}g</Text>
      </View>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
};

const MacroCalculations = ({
  results,
  calcBmrResult,
  calcTDEEResult,
  bodyMetrics,
  unitSystem,
  TDEE,
  selectedDiet,
  bmi,
  selectedGoal,
  selectedActivity,
}) => {
  const selectedDietLabel =
    dietTypes.find((d) => d.value === selectedDiet)?.label || "Not specified";
  const selectedGoalLabel =
    goalData.find((goal) => goal.value === selectedGoal)?.label || "";
  // Get only selected activity level
  const selectedActivityLevel = calcBmrResult?.activityLevels?.find(
    (item) => item.calories === calcTDEEResult?.bmr
  );

  const selectecAvtivityLabel =
    activityData.find((a) => a.value === selectedActivity)?.label || "";

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Macro Nutrition Calculations</Text>
        <Text style={styles.subtitle}>
          Personalized nutrition breakdown •{" "}
          {bodyMetrics?.gender === "male" ? "Male" : "Female"} • Age{" "}
          {bodyMetrics?.age}
        </Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.cardFull}>
        <Text style={styles.sectionTitle}>Personal Profile</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>HEIGHT</Text>
            <Text style={styles.infoValue}>
              {bodyMetrics?.originalValues?.height}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>WEIGHT</Text>
            <Text style={styles.infoValue}>
              {bodyMetrics?.originalValues?.weight}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>DIET TYPE</Text>
            <Text style={styles.infoValue}>{selectedDietLabel}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>UNIT SYSTEM</Text>
            <Text style={styles.infoValue}>
              {unitSystem === "metric" ? "Metric" : "US"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Calories</Text>
          <Text style={styles.cardValue}>{results.calories}</Text>
          <Text style={styles.cardSubValue}>kcal/day</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>BMR</Text>
          <Text style={styles.cardValue}>
            {calcBmrResult?.bmr ? Number(calcBmrResult?.bmr).toFixed(2) : "--"}
          </Text>
          <Text style={styles.cardSubValue}>calories/day</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>BMI</Text>
          <Text style={styles.cardValue}>
            {bmi ? Number(bmi).toFixed(2) : "--"}
          </Text>
          <Text style={styles.cardSubValue}>
            {bmi < 18.5
              ? "Underweight"
              : bmi < 25
              ? "Normal"
              : bmi < 30
              ? "Overweight"
              : "Obese"}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>TDEE</Text>
          <Text style={styles.cardValue}>
            {TDEE ? Number(TDEE).toFixed(2) : "--"}
          </Text>
          <Text style={styles.cardSubValue}>total daily energy</Text>
        </View>
      </View>

      <View style={styles.cardFull}>
        <Text style={styles.sectionTitle}>Activity Level</Text>
        <View style={styles.infoGrid}>
          <View style={[styles.infoItem, { width: "100%" }]}>
            <Text style={styles.infoLabel}>Activity Level</Text>
            <Text style={styles.infoValue}>{selectecAvtivityLabel}</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardFull}>
        <Text style={styles.sectionTitle}>Goal</Text>
        <View style={styles.infoGrid}>
          <View style={[styles.infoItem, { width: "100%" }]}>
            {/* <Text style={styles.infoLabel}>Activity Level</Text> */}
            <Text style={styles.infoValue}>{selectedGoalLabel}</Text>
          </View>
        </View>
      </View>
      {/* Macro Distribution */}
      <View style={styles.cardFull}>
        <Text style={styles.sectionTitle}>Macro Distribution</Text>
        <View style={styles.macroContainer}>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{results.protein}g</Text>
            <Text style={styles.macroPercent}>
              {results?.macroPercentages?.p}%
            </Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{results.carbs}g</Text>
            <Text style={styles.macroPercent}>
              {results?.macroPercentages?.c}%
            </Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Fats</Text>
            <Text style={styles.macroValue}>{results.fats}g</Text>
            <Text style={styles.macroPercent}>
              {results?.macroPercentages?.f}%
            </Text>
          </View>
        </View>
      </View>

      {/* Visual Progress Bars */}
      <View style={styles.cardFull}>
        <Text style={styles.sectionTitle}>Daily Targets</Text>
        <VisualBar
          label="Protein Target"
          value={results.protein}
          max={Math.round(results.protein * 1.2)}
          color="#FF6B6B"
        />
        <VisualBar
          label="Carbohydrate Target"
          value={results.carbs}
          max={Math.round(results.carbs * 1.2)}
          color="#4ECDC4"
        />
        <VisualBar
          label="Fat Target"
          value={results.fats}
          max={Math.round(results.fats * 1.2)}
          color="#45B7D1"
        />
      </View>

      {/* Personal Profile */}

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Nutrition Tips</Text>
        <Text style={styles.tipText}>
          • Distribute protein intake evenly throughout the day for optimal
          muscle protein synthesis
        </Text>
        <Text style={styles.tipText}>
          • Time carbohydrates around workouts for better performance and
          recovery
        </Text>
        <Text style={styles.tipText}>
          • Include healthy fats (omega-3, monounsaturated) for hormone
          production and nutrient absorption
        </Text>
        <Text style={styles.tipText}>
          • Stay hydrated with 8-10 glasses of water daily to support metabolism
          and nutrient transport
        </Text>
      </View>
    </View>
  );
};

export default MacroCalculations;
