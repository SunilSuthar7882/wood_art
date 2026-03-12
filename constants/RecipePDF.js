// import React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
// } from "@react-pdf/renderer";

// // Create styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: "column",
//     backgroundColor: "#FFFFFF",
//     padding: 40,
//     fontFamily: "Helvetica",
//   },
//   header: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#2E7D32",
//     fontWeight: "bold",
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     marginBottom: 10,
//     fontWeight: "bold",
//     color: "#1976D2",
//   },
//   ingredient: {
//     fontSize: 12,
//     marginBottom: 5,
//     flexDirection: "row",
//   },
//   instruction: {
//     fontSize: 12,
//     marginBottom: 8,
//     lineHeight: 1.4,
//   },
//   nutritionGrid: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 20,
//     padding: 15,
//     backgroundColor: "#F5F5F5",
//     borderRadius: 5,
//   },
//   nutritionItem: {
//     flexDirection: "column",
//     alignItems: "center",
//     minWidth: 80,
//   },
//   nutritionLabel: {
//     fontSize: 10,
//     color: "#666",
//     marginBottom: 2,
//   },
//   nutritionValue: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#2E7D32",
//   },
//   servingsInfo: {
//     fontSize: 14,
//     textAlign: "center",
//     marginBottom: 20,
//     padding: 10,
//     backgroundColor: "#E8F5E8",
//     borderRadius: 5,
//   },
//   footer: {
//     position: "absolute",
//     bottom: 30,
//     left: 40,
//     right: 40,
//     textAlign: "center",
//     fontSize: 8,
//     color: "#666",
//     borderTop: "1px solid #ddd",
//     paddingTop: 10,
//   },
//   categoriesContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginTop: 10,
//   },
//   categoryTag: {
//     backgroundColor: "#E3F2FD",
//     padding: 5,
//     margin: 2,
//     borderRadius: 3,
//     fontSize: 10,
//   },
//   imageContainer: {
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   recipeImage: {
//     width: 200,
//     height: 150,
//     objectFit: "cover",
//     borderRadius: 5,
//   },
// });

// const RecipePDF = ({ data }) => {
//   // Format ingredients list
//   const formatIngredients = () => {
//     if (!data.ingredients || data.ingredients.length === 0) {
//       return ["No ingredients listed"];
//     }

//     return data.ingredients.map((item) => {
//       const amount =
//         item.integral +
//         (item.nominator && item.denominator
//           ? ` ${item.nominator}/${item.denominator}`
//           : "");
//       return `${item.ingredient.name} ${amount} ${item.unit}`;
//     });
//   };

//   // Format instructions
//   const formatInstructions = () => {
//     if (!data.instruction) {
//       return ["No instructions provided"];
//     }

//     // Split instructions by periods or line breaks and number them
//     const instructions = data.instruction
//       .split(/[.\n]+/)
//       .filter((inst) => inst.trim().length > 0);
//     return instructions.map((inst, index) => `${index + 1}. ${inst.trim()}`);
//   };

//   // Get categories
//   const getCategories = () => {
//     if (!data.food_category_maps || data.food_category_maps.length === 0) {
//       return ["Uncategorized"];
//     }
//     return data.food_category_maps.map((cat) => cat.food_category.name);
//   };

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Header */}
//         <Text style={styles.header}>{data.name || "Recipe"}</Text>

//         {/* Recipe Image */}
//         {data.image && (
//           <View style={styles.imageContainer}>
//             <Image src={data.image} style={styles.recipeImage} />
//           </View>
//         )}

//         {/* Servings Info */}
//         <Text style={styles.servingsInfo}>{data.no_of_servings} Servings</Text>

//         {/* Categories */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Categories</Text>
//           <View style={styles.categoriesContainer}>
//             {getCategories().map((category, index) => (
//               <Text key={index} style={styles.categoryTag}>
//                 {category}
//               </Text>
//             ))}
//           </View>
//         </View>

//         {/* Ingredients */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Ingredients</Text>
//           {formatIngredients().map((ingredient, index) => (
//             <Text key={index} style={styles.ingredient}>
//               • {ingredient}
//             </Text>
//           ))}
//         </View>

//         {/* Nutrition Totals */}
//      <View style={styles.nutritionGrid}>
//   <View style={styles.nutritionItem}>
//     <Text style={styles.nutritionLabel}>Calories</Text>
//     <Text style={styles.nutritionValue}>
//       {Number(data.total_calories || 0).toFixed(2)}
//     </Text>
//   </View>
//   <View style={styles.nutritionItem}>
//     <Text style={styles.nutritionLabel}>Carbs</Text>
//     <Text style={styles.nutritionValue}>
//       {Number(data.total_carbs || 0).toFixed(2)}g
//     </Text>
//   </View>
//   <View style={styles.nutritionItem}>
//     <Text style={styles.nutritionLabel}>Protein</Text>
//     <Text style={styles.nutritionValue}>
//       {Number(data.total_protein || 0).toFixed(2)}g
//     </Text>
//   </View>
//   <View style={styles.nutritionItem}>
//     <Text style={styles.nutritionLabel}>Fat</Text>
//     <Text style={styles.nutritionValue}>
//       {Number(data.total_fat || 0).toFixed(2)}g
//     </Text>
//   </View>
//   <View style={styles.nutritionItem}>
//     <Text style={styles.nutritionLabel}>Fluid</Text>
//     <Text style={styles.nutritionValue}>
//       {Number(data.total_fluid || 0).toFixed(2)} fl oz
//     </Text>
//   </View>
// </View>

//         {/* Instructions */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Instructions</Text>
//           {formatInstructions().map((instruction, index) => (
//             <Text key={index} style={styles.instruction}>
//               {instruction}
//             </Text>
//           ))}
//         </View>

//         {/* Footer */}
//         <Text style={styles.footer}>
//           Eating right, simplified.{"\n"}
//           Powered by Macros and Meals Nutrition. Copyright © 2025. All Rights Reserved.
//           {"\n"}
//           The contents of the Macros and Meals Nutrition services are for informational
//           purposes only. Always seek the advice of your physician or other
//           qualified health provider with any questions you may have regarding a
//           medical condition.
//         </Text>
//       </Page>
//     </Document>
//   );
// };

// export default RecipePDF;

// import React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
// } from "@react-pdf/renderer";

// // Create enhanced styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: "column",
//     backgroundColor: "#FFFFFF",
//     padding: 30,
//     fontFamily: "Helvetica",
//   },
//   header: {
//     fontSize: 32,
//     marginBottom: 15,
//     textAlign: "center",
//     color: "#E65100",
//     fontWeight: "bold",
//     textTransform: "uppercase",
//     letterSpacing: 2,
//   },
//   subtitle: {
//     fontSize: 14,
//     textAlign: "center",
//     color: "#666",
//     marginBottom: 25,
//     fontStyle: "italic",
//   },
//   heroSection: {
//     marginBottom: 25,
//     borderRadius: 15,
//     overflow: "hidden",
//     border: "3px solid #E65100",
//   },
//   recipeImage: {
//     width: "100%",
//     height: 200,
//     objectFit: "cover",
//   },
//   imageOverlay: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     padding: 15,
//   },
//   overlayText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   quickInfoRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 25,
//     padding: 15,
//     backgroundColor: "#FFF3E0",
//     borderRadius: 10,
//     border: "2px solid #FFB74D",
//   },
//   quickInfoItem: {
//     alignItems: "center",
//     flex: 1,
//   },
//   quickInfoIcon: {
//     width: 20,
//     height: 20,
//     backgroundColor: "#FF9800",
//     borderRadius: 10,
//     marginBottom: 5,
//   },
//   quickInfoLabel: {
//     fontSize: 10,
//     color: "#666",
//     textTransform: "uppercase",
//     fontWeight: "bold",
//     marginBottom: 2,
//   },
//   quickInfoValue: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#E65100",
//   },
//   section: {
//     marginBottom: 20,
//     padding: 15,
//     backgroundColor: "#FAFAFA",
//     borderRadius: 10,
//     border: "1px solid #E0E0E0",
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 15,
//     paddingBottom: 8,
//     borderBottom: "2px solid #E65100",
//   },
//   sectionIcon: {
//     width: 8,
//     height: 8,
//     backgroundColor: "#E65100",
//     borderRadius: 4,
//     marginRight: 10,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#E65100",
//     textTransform: "uppercase",
//     letterSpacing: 1,
//   },
//   ingredientRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//     padding: 8,
//     backgroundColor: "white",
//     borderRadius: 5,
//     border: "1px solid #E8E8E8",
//   },
//   ingredientBullet: {
//     width: 6,
//     height: 6,
//     backgroundColor: "#4CAF50",
//     borderRadius: 3,
//     marginRight: 10,
//   },
//   ingredientText: {
//     fontSize: 12,
//     color: "#333",
//     flex: 1,
//   },
//   ingredientAmount: {
//     fontSize: 11,
//     color: "#666",
//     fontWeight: "bold",
//     backgroundColor: "#F5F5F5",
//     padding: "3 8",
//     borderRadius: 3,
//   },
//   instructionItem: {
//     flexDirection: "row",
//     marginBottom: 12,
//     padding: 10,
//     backgroundColor: "white",
//     borderRadius: 8,
//     border: "1px solid #E8E8E8",
//   },
//   instructionNumber: {
//     width: 25,
//     height: 25,
//     backgroundColor: "#2196F3",
//     borderRadius: 12.5,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//     flexShrink: 0,
//   },
//   instructionNumberText: {
//     color: "white",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   instructionText: {
//     fontSize: 12,
//     lineHeight: 1.5,
//     color: "#333",
//     flex: 1,
//   },
//   nutritionContainer: {
//     marginBottom: 25,
//   },
//   nutritionGrid: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 15,
//     backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     borderRadius: 10,
//     border: "2px solid #5E35B1",
//   },
//   nutritionCard: {
//     alignItems: "center",
//     backgroundColor: "rgba(255,255,255,0.9)",
//     padding: 10,
//     borderRadius: 8,
//     minWidth: 70,
//     border: "1px solid rgba(255,255,255,0.3)",
//   },
//   nutritionValue: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#2E7D32",
//     marginBottom: 2,
//   },
//   nutritionLabel: {
//     fontSize: 9,
//     color: "#666",
//     textTransform: "uppercase",
//     fontWeight: "bold",
//   },
//   categoriesContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 5,
//     marginBottom: 20,
//   },
//   categoryTag: {
//     backgroundColor: "#E1F5FE",
//     padding: "6 12",
//     borderRadius: 15,
//     border: "1px solid #29B6F6",
//   },
//   categoryText: {
//     fontSize: 10,
//     color: "#0277BD",
//     fontWeight: "bold",
//   },
//   servingsInfo: {
//     fontSize: 14,
//     textAlign: "center",
//     marginBottom: 20,
//     padding: 12,
//     backgroundColor: "linear-gradient(45deg, #66BB6A, #4CAF50)",
//     borderRadius: 8,
//     color: "white",
//     fontWeight: "bold",
//   },
//   footer: {
//     position: "absolute",
//     bottom: 20,
//     left: 30,
//     right: 30,
//     textAlign: "center",
//     fontSize: 8,
//     color: "#666",
//     borderTop: "2px solid #E65100",
//     paddingTop: 10,
//     backgroundColor: "#FAFAFA",
//     // borderRadius: "0 0 10 10",
//     padding: 10,
//   },
//   footerBrand: {
//     fontSize: 10,
//     fontWeight: "bold",
//     color: "#E65100",
//     marginBottom: 5,
//   },
//   decorativeLine: {
//     height: 3,
//     backgroundColor: "linear-gradient(90deg, #FF9800, #E65100, #FF9800)",
//     marginBottom: 20,
//     borderRadius: 2,
//   },
//   badge: {
//     position: "absolute",
//     top: 15,
//     right: 15,
//     backgroundColor: "#FF5722",
//     color: "white",
//     padding: "5 10",
//     borderRadius: 12,
//     fontSize: 8,
//     fontWeight: "bold",
//     textTransform: "uppercase",
//   },
// });

// const RecipePDF = ({ data }) => {
//   if (!data) {
//     return (
//       <Document>
//         <Page size="A4" style={styles.page}>
//           <Text style={styles.header}>No Recipe Data</Text>
//         </Page>
//       </Document>
//     );
//   }

//   // Format ingredients list
//   const formatIngredients = () => {
//     if (!data.ingredients || data.ingredients.length === 0) {
//       return [{ ingredient: "No ingredients listed", amount: "" }];
//     }

//     return data.ingredients.map((item) => {
//       const amount = item.integral + (item.nominator && item.denominator ? ` ${item.nominator}/${item.denominator}` : "");
//       return {
//         ingredient: item.ingredient.name,
//         amount: `${amount} ${item.unit}`,
//       };
//     });
//   };

//   // Format instructions
//   const formatInstructions = () => {
//     if (!data.instruction) {
//       return ["No instructions provided"];
//     }

//     const instructions = data.instruction
//       .split(/[.\n]+/)
//       .filter((inst) => inst.trim().length > 0);
//     return instructions.map((inst) => inst.trim());
//   };

//   // Get categories
//   const getCategories = () => {
//     if (!data.food_category_maps || data.food_category_maps.length === 0) {
//       return ["Uncategorized"];
//     }
//     return data.food_category_maps.map((cat) => cat.food_category.name);
//   };

//   const ingredients = formatIngredients();
//   const instructions = formatInstructions();
//   const categories = getCategories();

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Draft Badge */}
//         {data.is_draft && (
//           <Text style={styles.badge}>DRAFT</Text>
//         )}

//         {/* Decorative Line */}
//         <View style={styles.decorativeLine} />

//         {/* Header */}
//         <Text style={styles.header}>{data.name || "Recipe"}</Text>
//         <Text style={styles.subtitle}>A delicious recipe crafted with care</Text>

//         {/* Hero Section with Image */}
//         {data.image && (
//           <View style={styles.heroSection}>
//             <Image src={data.image} style={styles.recipeImage} />
//           </View>
//         )}

//         {/* Quick Info Row */}
//         <View style={styles.quickInfoRow}>
//           <View style={styles.quickInfoItem}>
//             <View style={styles.quickInfoIcon} />
//             <Text style={styles.quickInfoLabel}>Servings</Text>
//             <Text style={styles.quickInfoValue}>{data.no_of_servings}</Text>
//           </View>
//           <View style={styles.quickInfoItem}>
//             <View style={styles.quickInfoIcon} />
//             <Text style={styles.quickInfoLabel}>Prep Time</Text>
//             <Text style={styles.quickInfoValue}>15 min</Text>
//           </View>
//           <View style={styles.quickInfoItem}>
//             <View style={styles.quickInfoIcon} />
//             <Text style={styles.quickInfoLabel}>Cook Time</Text>
//             <Text style={styles.quickInfoValue}>25 min</Text>
//           </View>
//           <View style={styles.quickInfoItem}>
//             <View style={styles.quickInfoIcon} />
//             <Text style={styles.quickInfoLabel}>Difficulty</Text>
//             <Text style={styles.quickInfoValue}>Easy</Text>
//           </View>
//         </View>

//         {/* Categories */}
//         <View style={styles.categoriesContainer}>
//           {categories.map((category, index) => (
//             <View key={index} style={styles.categoryTag}>
//               <Text style={styles.categoryText}>{category}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Nutrition Section */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.sectionIcon} />
//             <Text style={styles.sectionTitle}>Nutrition Facts</Text>
//           </View>
//           <View style={styles.nutritionGrid}>
//             <View style={styles.nutritionCard}>
//               <Text style={styles.nutritionValue}>
//                 {Number(data.total_calories || 0).toFixed(0)}
//               </Text>
//               <Text style={styles.nutritionLabel}>Calories</Text>
//             </View>
//             <View style={styles.nutritionCard}>
//               <Text style={styles.nutritionValue}>
//                 {Number(data.total_carbs || 0).toFixed(1)}g
//               </Text>
//               <Text style={styles.nutritionLabel}>Carbs</Text>
//             </View>
//             <View style={styles.nutritionCard}>
//               <Text style={styles.nutritionValue}>
//                 {Number(data.total_protein || 0).toFixed(1)}g
//               </Text>
//               <Text style={styles.nutritionLabel}>Protein</Text>
//             </View>
//             <View style={styles.nutritionCard}>
//               <Text style={styles.nutritionValue}>
//                 {Number(data.total_fat || 0).toFixed(1)}g
//               </Text>
//               <Text style={styles.nutritionLabel}>Fat</Text>
//             </View>
//             <View style={styles.nutritionCard}>
//               <Text style={styles.nutritionValue}>
//                 {Number(data.total_fluid || 0).toFixed(1)}
//               </Text>
//               <Text style={styles.nutritionLabel}>Fluid oz</Text>
//             </View>
//           </View>
//         </View>

//         {/* Ingredients Section */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.sectionIcon} />
//             <Text style={styles.sectionTitle}>Ingredients</Text>
//           </View>
//           {ingredients.map((item, index) => (
//             <View key={index} style={styles.ingredientRow}>
//               <View style={styles.ingredientBullet} />
//               <Text style={styles.ingredientText}>{item.ingredient}</Text>
//               <Text style={styles.ingredientAmount}>{item.amount}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Instructions Section */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.sectionIcon} />
//             <Text style={styles.sectionTitle}>Instructions</Text>
//           </View>
//           {instructions.map((instruction, index) => (
//             <View key={index} style={styles.instructionItem}>
//               <View style={styles.instructionNumber}>
//                 <Text style={styles.instructionNumberText}>{index + 1}</Text>
//               </View>
//               <Text style={styles.instructionText}>{instruction}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text style={styles.footerBrand}>Eating right, simplified.</Text>
//           <Text>
//             Powered by Macros and Meals Nutrition. Copyright © 2025. All Rights Reserved.
//           </Text>
//           <Text style={{ marginTop: 5 }}>
//             The contents of the Macros and Meals Nutrition services are for informational
//             purposes only. Always seek the advice of your physician or other
//             qualified health provider with any questions you may have regarding a
//             medical condition.
//           </Text>
//         </View>
//       </Page>
//     </Document>
//   );
// };

// export default RecipePDF;

// import React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
// } from "@react-pdf/renderer";

// // Create enhanced styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: "column",
//     backgroundColor: "#FFFFFF",
//     padding: 30,
//     fontFamily: "Helvetica",
//   },
//   header: {
//     fontSize: 32,
//     marginBottom: 15,
//     textAlign: "center",
//     color: "#2E7D32",
//     fontWeight: "bold",
//     textTransform: "uppercase",
//     letterSpacing: 2,
//   },
//   subtitle: {
//     fontSize: 14,
//     textAlign: "center",
//     color: "#666",
//     marginBottom: 25,
//     fontStyle: "italic",
//   },
//   heroSection: {
//     marginBottom: 25,
//     borderRadius: 15,
//     overflow: "hidden",
//     border: "3px solid #4CAF50",
//   },
//   recipeImage: {
//     width: "100%",
//     height: 200,
//     objectFit: "cover",
//   },
//   imageOverlay: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     padding: 15,
//   },
//   overlayText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   quickInfoRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 25,
//     padding: 15,
//     backgroundColor: "#E8F5E8",
//     borderRadius: 10,
//     border: "2px solid #81C784",
//   },
//   quickInfoItem: {
//     alignItems: "center",
//     flex: 1,
//   },
//   quickInfoIcon: {
//     width: 12,
//     height: 12,
//     backgroundColor: "#66BB6A",
//     borderRadius: 10,
//     marginBottom: 5,
//   },
//   quickInfoLabel: {
//     fontSize: 10,
//     color: "#666",
//     textTransform: "uppercase",
//     fontWeight: "bold",
//     marginBottom: 2,
//   },
//   quickInfoValue: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#2E7D32",
//     padding:1,
//   },
//   section: {
//     marginBottom: 20,
//     padding: 15,
//     backgroundColor: "#FAFAFA",
//     borderRadius: 10,
//     border: "1px solid #E0E0E0",
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 15,
//     paddingBottom: 8,
//     borderBottom: "2px solid #4CAF50",
//   },
//   sectionIcon: {
//     width: 8,
//     height: 8,
//     backgroundColor: "#4CAF50",
//     borderRadius: 4,
//     marginRight: 10,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#4CAF50",
//     textTransform: "uppercase",
//     letterSpacing: 1,
//   },
//   ingredientRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//     padding: 8,
//     backgroundColor: "white",
//     borderRadius: 5,
//     border: "1px solid #E8E8E8",
//   },
//   ingredientBullet: {
//     width: 6,
//     height: 6,
//     backgroundColor: "#4CAF50",
//     borderRadius: 3,
//     marginRight: 10,
//   },
//   ingredientText: {
//     fontSize: 12,
//     color: "#333",
//     flex: 1,
//   },
//   ingredientAmount: {
//     fontSize: 11,
//     color: "#666",
//     fontWeight: "bold",
//     backgroundColor: "#F5F5F5",
//     padding: "3 8",
//     borderRadius: 3,
//   },
//   instructionItem: {
//     flexDirection: "row",
//     marginBottom: 12,
//     padding: 10,
//     backgroundColor: "white",
//     borderRadius: 8,
//     border: "1px solid #E8E8E8",
//   },
//   instructionNumber: {
//     width: 25,
//     height: 25,
//     backgroundColor: "#66BB6A",
//     borderRadius: 12.5,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//     flexShrink: 0,
//   },
//   instructionNumberText: {
//     color: "white",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   instructionText: {
//     fontSize: 12,
//     lineHeight: 1.5,
//     color: "#333",
//     flex: 1,
//   },
//   nutritionContainer: {
//     marginBottom: 25,
//   },
//   nutritionGrid: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 15,
//     backgroundColor: "#A5D6A7",
//     borderRadius: 10,
//     border: "2px solid #4CAF50",
//   },
//   nutritionCard: {
//     alignItems: "center",
//     backgroundColor: "rgba(255,255,255,0.9)",
//     padding: 10,
//     borderRadius: 8,
//     minWidth: 70,
//     border: "1px solid rgba(255,255,255,0.3)",
//   },
//   nutritionValue: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#2E7D32",
//     marginBottom: 2,
//   },
//   nutritionLabel: {
//     fontSize: 9,
//     color: "#666",
//     textTransform: "uppercase",
//     fontWeight: "bold",
//   },
//   categoriesContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 5,
//     marginBottom: 20,
//   },
//   categoryTag: {
//     backgroundColor: "#C8E6C9",
//     padding: "6 12",
//     borderRadius: 15,
//     border: "1px solid #66BB6A",
//   },
//   categoryText: {
//     fontSize: 10,
//     color: "#2E7D32",
//     fontWeight: "bold",
//   },
//   servingsInfo: {
//     fontSize: 14,
//     textAlign: "center",
//     marginBottom: 20,
//     padding: 12,
//     backgroundColor: "#4CAF50",
//     borderRadius: 8,
//     color: "white",
//     fontWeight: "bold",
//   },
//   footer: {
//     position: "absolute",
//     bottom: 20,
//     left: 30,
//     right: 30,
//     textAlign: "center",
//     fontSize: 8,
//     color: "#666",
//     borderTop: "2px solid #4CAF50",
//     paddingTop: 10,
//     backgroundColor: "#FAFAFA",
//     borderRadius: 10,
//     padding: 10,
//   },
//   footerBrand: {
//     fontSize: 10,
//     fontWeight: "bold",
//     color: "#4CAF50",
//     marginBottom: 5,
//   },
//   decorativeLine: {
//     height: 3,
//     backgroundColor: "#4CAF50",
//     marginBottom: 20,
//     borderRadius: 2,
//   },
//   badge: {
//     position: "absolute",
//     top: 15,
//     right: 15,
//     backgroundColor: "#43A047",
//     color: "white",
//     padding: "5 10",
//     borderRadius: 12,
//     fontSize: 8,
//     fontWeight: "bold",
//     textTransform: "uppercase",
//   },
// });

// const RecipePDF = ({ data }) => {
//   if (!data) {
//     return (
//       <Document>
//         <Page size="A4" style={styles.page}>
//           <Text style={styles.header}>No Recipe Data</Text>
//         </Page>
//       </Document>
//     );
//   }

//   // Format ingredients list
//   const formatIngredients = () => {
//     if (!data.ingredients || data.ingredients.length === 0) {
//       return [{ ingredient: "No ingredients listed", amount: "" }];
//     }

//     return data.ingredients.map((item) => {
//       const amount = item.integral + (item.nominator && item.denominator ? ` ${item.nominator}/${item.denominator}` : "");
//       return {
//         ingredient: item.ingredient.name,
//         amount: `${amount} ${item.unit}`,
//       };
//     });
//   };

//   // Format instructions
//   const formatInstructions = () => {
//     if (!data.instruction) {
//       return ["No instructions provided"];
//     }

//     const instructions = data.instruction
//       .split(/[.\n]+/)
//       .filter((inst) => inst.trim().length > 0);
//     return instructions.map((inst) => inst.trim());
//   };

//   // Get categories
//   const getCategories = () => {
//     if (!data.food_category_maps || data.food_category_maps.length === 0) {
//       return ["Uncategorized"];
//     }
//     return data.food_category_maps.map((cat) => cat.food_category.name);
//   };

//   const ingredients = formatIngredients();
//   const instructions = formatInstructions();
//   const categories = getCategories();

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Draft Badge */}
//         {data.is_draft && (
//           <Text style={styles.badge}>DRAFT</Text>
//         )}

//         {/* Decorative Line */}
//         <View style={styles.decorativeLine} />

//         {/* Header */}
//         <Text style={styles.header}>{data.name || "Recipe"}</Text>
//         <Text style={styles.subtitle}>A delicious recipe crafted with care</Text>

//         {/* Hero Section with Image */}
//         {data.image && (
//           <View style={styles.heroSection}>
//             <Image src={data.image} style={styles.recipeImage} />
//           </View>
//         )}

//         {/* Quick Info Row */}
//      <View style={styles.quickInfoRow}>
//   {/* Servings */}
//   <View style={[styles.quickInfoItem, { flexDirection: 'row', alignItems: 'center', marginRight: 12 }]}>
//     <View style={styles.quickInfoIcon} />
//     <Text style={styles.quickInfoLabel}>Servings:</Text>
//     <Text style={[styles.quickInfoValue, { marginLeft: 4 }]}>{data.no_of_servings}</Text>
//   </View>

//   {/* Categories */}
//   <View style={[styles.categoriesContainer, { flexDirection: 'row', flexWrap: 'wrap' }]}>
//     {categories.map((category, index) => (
//       <View key={index} style={styles.categoryTag}>
//         <Text style={styles.categoryText}>{category}</Text>
//       </View>
//     ))}
//   </View>
// </View>

//         {/* Nutrition Section */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.sectionIcon} />
//             <Text style={styles.sectionTitle}>Nutrition Facts</Text>
//           </View>
//           <View style={styles.nutritionGrid}>
//             <View style={styles.nutritionCard}>
//               <Text style={styles.nutritionValue}>
//                 {Number(data.total_calories || 0).toFixed(0)}
//               </Text>
//               <Text style={styles.nutritionLabel}>Calories</Text>
//             </View>
//             <View style={styles.nutritionCard}>
//               <Text style={styles.nutritionValue}>
//                 {Number(data.total_carbs || 0).toFixed(1)}g
//               </Text>
//               <Text style={styles.nutritionLabel}>Carbs</Text>
//             </View>
//             <View style={styles.nutritionCard}>
//               <Text style={styles.nutritionValue}>
//                 {Number(data.total_protein || 0).toFixed(1)}g
//               </Text>
//               <Text style={styles.nutritionLabel}>Protein</Text>
//             </View>
//             <View style={styles.nutritionCard}>
//               <Text style={styles.nutritionValue}>
//                 {Number(data.total_fat || 0).toFixed(1)}g
//               </Text>
//               <Text style={styles.nutritionLabel}>Fat</Text>
//             </View>
//             <View style={styles.nutritionCard}>
//               <Text style={styles.nutritionValue}>
//                 {Number(data.total_fluid || 0).toFixed(1)}
//               </Text>
//               <Text style={styles.nutritionLabel}>Fluid oz</Text>
//             </View>
//           </View>
//         </View>

//         {/* Ingredients Section */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.sectionIcon} />
//             <Text style={styles.sectionTitle}>Ingredients</Text>
//           </View>
//           {ingredients.map((item, index) => (
//             <View key={index} style={styles.ingredientRow}>
//               <View style={styles.ingredientBullet} />
//               <Text style={styles.ingredientText}>{item.ingredient}</Text>
//               <Text style={styles.ingredientAmount}>{item.amount}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Instructions Section */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.sectionIcon} />
//             <Text style={styles.sectionTitle}>Instructions</Text>
//           </View>
//           {instructions.map((instruction, index) => (
//             <View key={index} style={styles.instructionItem}>
//               <View style={styles.instructionNumber}>
//                 <Text style={styles.instructionNumberText}>{index + 1}</Text>
//               </View>
//               <Text style={styles.instructionText}>{instruction}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text style={styles.footerBrand}>Eating right, simplified.</Text>
//           <Text>
//             Powered by Macros and Meals Nutrition. Copyright © 2025. All Rights Reserved.
//           </Text>
//           <Text style={{ marginTop: 5 }}>
//             The contents of the Macros and Meals Nutrition services are for informational
//             purposes only. Always seek the advice of your physician or other
//             qualified health provider with any questions you may have regarding a
//             medical condition.
//           </Text>
//         </View>
//       </Page>
//     </Document>
//   );
// };

// export default RecipePDF;

// import React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
// } from "@react-pdf/renderer";

// // ✅ PDF styles
// const styles = StyleSheet.create({
//   page: {
//     backgroundColor: "#FFFFFF",
//     padding: 30,
//     fontFamily: "Helvetica",
//   },
//   header: {
//     fontSize: 22,
//     marginBottom: 8,
//     textAlign: "center",
//     color: "#2E7D32",
//     fontWeight: "bold",
//     textTransform: "uppercase",
//   },
//   subtitle: {
//     fontSize: 10,
//     textAlign: "center",
//     color: "#666",
//     marginBottom: 20,
//     fontStyle: "italic",
//   },
//   heroSection: {
//     marginBottom: 20,
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor: "#4CAF50",
//     overflow: "hidden",
//   },
//   recipeImage: {
//     width: "100%",
//     height: 150,
//     objectFit: "cover",
//   },
//   quickInfoRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     alignItems: "center",
//     marginBottom: 20,
//     padding: 10,
//     backgroundColor: "#E8F5E8",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#81C784",
//   },
//   quickInfoItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 12,
//     marginBottom: 6,
//   },
//   quickInfoIcon: {
//     width: 8,
//     height: 8,
//     backgroundColor: "#66BB6A",
//     borderRadius: 4,
//     marginRight: 4,
//   },
//   quickInfoLabel: {
//     fontSize: 9,
//     color: "#555",
//     fontWeight: "bold",
//     marginRight: 4,
//   },
//   quickInfoValue: {
//     fontSize: 9,
//     fontWeight: "bold",
//     color: "#2E7D32",
//   },
//   categoryTag: {
//     backgroundColor: "#C8E6C9",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginRight: 6,
//     marginBottom: 4,
//     borderWidth: 1,
//     borderColor: "#66BB6A",
//   },
//   categoryText: {
//     fontSize: 8,
//     color: "#2E7D32",
//     fontWeight: "bold",
//   },
//   section: {
//     marginBottom: 18,
//     padding: 12,
//     backgroundColor: "#FAFAFA",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#E0E0E0",
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//     paddingBottom: 6,
//     borderBottomWidth: 1.5,
//     borderBottomColor: "#4CAF50",
//   },
//   sectionIcon: {
//     width: 6,
//     height: 6,
//     backgroundColor: "#4CAF50",
//     borderRadius: 3,
//     marginRight: 8,
//   },
//   sectionTitle: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#4CAF50",
//     textTransform: "uppercase",
//   },
//   ingredientRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 6,
//     padding: 6,
//     backgroundColor: "#fff",
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: "#E8E8E8",
//     flexWrap: "wrap",
//   },
//   ingredientBullet: {
//     width: 5,
//     height: 5,
//     backgroundColor: "#4CAF50",
//     borderRadius: 3,
//     marginRight: 6,
//   },
//   ingredientText: {
//     fontSize: 9,
//     color: "#333",
//     flex: 1,
//   },
//   ingredientAmount: {
//     fontSize: 9,
//     color: "#666",
//     fontWeight: "bold",
//     backgroundColor: "#F5F5F5",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 3,
//   },
//   instructionItem: {
//     flexDirection: "row",
//     marginBottom: 6,
//     padding: 4,
//     backgroundColor: "#fff",
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#E8E8E8",
//   },
//    instructionNumber: {
//     fontWeight: "bold",
//     fontSize: 9,
//     marginRight: 4,
//   },
//   instructionNumberText: {
//     color: "white",
//     fontSize: 8.5,
//     fontWeight: "bold",
//   },
// instructionText: {
//     fontSize: 9, // smaller text
//     lineHeight: 1.3, // compact lines
//     flex: 1,
//   },
//   nutritionGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//     justifyContent: "space-between",
//   },
//   nutritionCard: {
//     alignItems: "center",
//     padding: 8,
//     backgroundColor: "#fff",
//     borderRadius: 6,
//     minWidth: 60,
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },
//   nutritionValue: {
//     fontSize: 10,
//     fontWeight: "bold",
//     color: "#2E7D32",
//   },
//   nutritionLabel: {
//     fontSize: 7,
//     color: "#666",
//     textTransform: "uppercase",
//     fontWeight: "bold",
//   },
//   // footer: {
//   //   marginTop: 20,
//   //   fontSize: 8,
//   //   color: "#666",
//   //   textAlign: "center",
//   //   borderTopWidth: 1,
//   //   borderTopColor: "#4CAF50",
//   //   paddingTop: 8,
//   // },
//    footer: {
//     borderTopWidth: 1,
//     borderTopColor: "#4CAF50",
//     position: "absolute",
//     bottom: 20,
//     left: 30,
//     right: 30,
//     textAlign: "center",
//     fontSize: 8.5,
//     color: "grey"
//   },
//   footerBrand: {
//     fontSize: 8,
//     fontWeight: "bold",
//     color: "#4CAF50",
//     marginBottom: 4,
//   },
// ingredientRowContainer: {
//   marginBottom: 8, // space between each ingredient block
// },

// ingredientNutrition: {
//   fontSize: 8.5,
//   color: '#666',
//   marginLeft: 16, // indent to align with ingredient text
//   marginTop: 2,
// },
//  instructionsSection: {
//     marginTop: 10,
//     padding: 10,
//     backgroundColor: "#f8f8f8",
//     borderRadius: 4,
//     pageBreakInside: "avoid", // avoid breaking between pages
//   },
//    instructionStep: {
//     flexDirection: "row",
//     marginBottom: 4,
//   },
//   nutritionCard: {
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 10,
//     backgroundColor: "#E8F5E9", // light green like the nutrition label
//     borderRadius: 10,
//     minWidth: 60,
//     borderWidth: 1,
//     borderColor: "#4CAF50",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
// },

// });

// // ✅ Helper components
// const SectionHeader = ({ title }) => (
//   <View style={styles.sectionHeader}>
//     <View style={styles.sectionIcon} />
//     <Text style={styles.sectionTitle}>{title}</Text>
//   </View>
// );

// const RecipePDF = ({ data }) => {
//   if (!data) {
//     return (
//       <Document>
//         <Page size="A4" style={styles.page}>
//           <Text style={styles.header}>No Recipe Data</Text>
//         </Page>
//       </Document>
//     );
//   }

//   const ingredients = (data.ingredients || []).map((item, i) => ({
//     id: `${item.ingredient?.name || "item"}-${i}`,
//     ingredient: item.ingredient?.name || "Unknown ingredient",
//     amount: `${item.integral || ""} ${
//       item.nominator && item.denominator
//         ? `${item.nominator}/${item.denominator}`
//         : ""
//     } ${item.unit || ""}`.trim(),
//     calories:`${item.calories}`,
//     protein:`${item.protein}`,
//     fat:`${item.fat}`,
//     fluid:`${item.fluid}`,
//     carbs:`${item.carbs}`,
//   }));

//   const instructions = data.instruction
//     ? data.instruction
//         .split(/[.\n]+/)
//         .map((s) => s.trim())
//         .filter(Boolean)
//     : ["No instructions provided"];

//   const categories =
//     data.food_category_maps?.map((cat) => cat.food_category?.name) || [
//       "Uncategorized",
//     ];

//     const servings = data.no_of_servings || 1;

//     const perServingNutrition = {
//   calories: Math.round((data.total_calories || 0) / servings),
//   carbs: ((data.total_carbs || 0) / servings).toFixed(1),
//   protein: ((data.total_protein || 0) / servings).toFixed(1),
//   fat: ((data.total_fat || 0) / servings).toFixed(1),
//   fluid: ((data.total_fluid || 0) / servings).toFixed(1),
// };

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Header */}
//         <Text style={styles.header}>{data.name || "Recipe"}</Text>
//         <Text style={styles.subtitle}>A delicious recipe crafted with care</Text>

//         {/* Image */}
//         {/* {data.image && (
//           <View style={styles.heroSection}>
//             <Image src={data.image} style={styles.recipeImage} />
//           </View>
//         )} */}

//         {/* Servings & Categories */}
//         <View style={styles.quickInfoRow}>
//           <View style={styles.quickInfoItem}>
//             <View style={styles.quickInfoIcon} />
//             <Text style={styles.quickInfoLabel}>Servings:</Text>
//             <Text style={styles.quickInfoValue}>{data.no_of_servings}</Text>
//           </View>
//           {categories.map((cat, idx) => (
//             <View key={idx} style={styles.categoryTag}>
//               <Text style={styles.categoryText}>{cat}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Nutrition Facts */}
//         <View style={styles.section}>
//           <SectionHeader title="Nutrition Facts" />
//           <View style={styles.nutritionGrid}>
//             {[
//               { label: "Calories", value: `${Math.round(data.total_calories || 0)}` },
//               { label: "Carbs", value: `${(data.total_carbs || 0).toFixed(1)}g` },
//               { label: "Protein", value: `${(data.total_protein || 0).toFixed(1)}g` },
//               { label: "Fat", value: `${(data.total_fat || 0).toFixed(1)}g` },
//               { label: "Fluid oz", value: `${(data.total_fluid || 0).toFixed(1)}` },
//             ].map((item, i) => (
//               <View key={i} style={styles.nutritionCard}>
//                 <Text style={styles.nutritionValue}>{item.value}</Text>
//                 <Text style={styles.nutritionLabel}>{item.label}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Ingredients */}
//        <View style={styles.section}>
//   <SectionHeader title="Ingredients" />
//   {ingredients.map((ing) => (
//     <View key={ing.id} style={styles.ingredientRowContainer}>
//       {/* Row 1: Ingredient + Amount */}
//       <View style={styles.ingredientRow}>
//         <View style={styles.ingredientBullet} />
//         <Text style={styles.ingredientText}>{ing.ingredient}</Text>
//         {ing.amount && (
//           <Text style={styles.ingredientAmount}>{ing.amount}</Text>
//         )}
//       </View>

//       {/* Row 2: Nutrition values */}
//       <Text style={styles.ingredientNutrition}>
//         {`${ing.calories} kcal | ${ing.protein}g Protein | ${ing.fat}g Fat | ${ing.carbs}g Carbs | ${ing.fluid}ml Fluid`}
//       </Text>
//     </View>
//   ))}
// </View>

//         {/* Instructions */}
//         {/* <View style={styles.section}>
//           <SectionHeader title="Instructions" />
//           {instructions.map((step, i) => (
//             <View key={i} style={styles.instructionItem}>
//               <View style={styles.instructionNumber}>
//                 <Text style={styles.instructionNumberText}>{i + 1}</Text>
//               </View>
//               <Text style={styles.instructionText}>{step}</Text>
//             </View>
//           ))}
//         </View> */}

// <View style={styles.instructionsSection} wrap={false}>
//   <SectionHeader title="Instructions" />
//   {instructions.map((step, i) => (
//     <View key={i} style={styles.instructionStep}>
//       <Text style={styles.instructionNumber}>{i + 1}.</Text>
//       <Text style={styles.instructionText}>{step}</Text>
//     </View>
//   ))}
// </View>

// <View style={styles.section} wrap={false}>
//   <SectionHeader title="Nutrition per Serving" />
//   <View style={styles.nutritionGrid}>
//     {[
//       { label: "Calories", value: `${perServingNutrition.calories}` },
//       { label: "Carbs", value: `${perServingNutrition.carbs}g` },
//       { label: "Protein", value: `${perServingNutrition.protein}g` },
//       { label: "Fat", value: `${perServingNutrition.fat}g` },
//       { label: "Fluid oz", value: `${perServingNutrition.fluid}` },
//     ].map((item, i) => (
//       <View key={i} style={styles.nutritionCard}>
//         <Text style={styles.nutritionValue}>{item.value}</Text>
//         <Text style={styles.nutritionLabel}>{item.label}</Text>
//       </View>
//     ))}
//   </View>
// </View>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text style={styles.footerBrand}>Eating right, simplified.</Text>
//           <Text>
//             Powered by Macros and Meals Nutrition. Copyright © 2025.
//           </Text>
//           <Text>
//             For informational purposes only. Always seek medical advice from
//             a qualified provider.
//           </Text>
//         </View>
//       </Page>
//     </Document>
//   );
// };

// export default RecipePDF;

// import React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
// } from "@react-pdf/renderer";

// // ✅ PDF styles
// const styles = StyleSheet.create({
//   page: {
//     backgroundColor: "#FFFFFF",
//     padding: 30,
//     fontFamily: "Helvetica",
//   },
//   header: {
//     fontSize: 22,
//     marginBottom: 8,
//     textAlign: "center",
//     color: "#2E7D32",
//     fontWeight: "bold",
//     textTransform: "uppercase",
//   },
//   subtitle: {
//     fontSize: 10,
//     textAlign: "center",
//     color: "#666",
//     marginBottom: 20,
//     fontStyle: "italic",
//   },
//   heroSection: {
//     marginBottom: 20,
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor: "#4CAF50",
//     overflow: "hidden",
//   },
//   recipeImage: {
//     width: "100%",
//     height: 150,
//     objectFit: "cover",
//   },
//   quickInfoRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     alignItems: "center",
//     marginBottom: 20,
//     padding: 10,
//     backgroundColor: "#E8F5E8",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#81C784",
//   },
//   quickInfoItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 12,
//     marginBottom: 6,
//   },
//   quickInfoIcon: {
//     width: 8,
//     height: 8,
//     backgroundColor: "#66BB6A",
//     borderRadius: 4,
//     marginRight: 4,
//   },
//   quickInfoLabel: {
//     fontSize: 9,
//     color: "#555",
//     fontWeight: "bold",
//     marginRight: 4,
//   },
//   quickInfoValue: {
//     fontSize: 9,
//     fontWeight: "bold",
//     color: "#2E7D32",
//   },
//   categoryTag: {
//     backgroundColor: "#C8E6C9",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginRight: 6,
//     marginBottom: 4,
//     borderWidth: 1,
//     borderColor: "#66BB6A",
//   },
//   categoryText: {
//     fontSize: 8,
//     color: "#2E7D32",
//     fontWeight: "bold",
//   },
//   section: {
//     marginBottom: 18,
//     padding: 12,
//     backgroundColor: "#FAFAFA",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#E0E0E0",
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//     paddingBottom: 6,
//     borderBottomWidth: 1.5,
//     borderBottomColor: "#4CAF50",
//   },
//   sectionIcon: {
//     width: 6,
//     height: 6,
//     backgroundColor: "#4CAF50",
//     borderRadius: 3,
//     marginRight: 8,
//   },
//   sectionTitle: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#4CAF50",
//     textTransform: "uppercase",
//   },
//   ingredientRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 6,
//     padding: 6,
//     backgroundColor: "#fff",
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: "#E8E8E8",
//     flexWrap: "wrap",
//   },
//   ingredientBullet: {
//     width: 5,
//     height: 5,
//     backgroundColor: "#4CAF50",
//     borderRadius: 3,
//     marginRight: 6,
//   },
//   ingredientText: {
//     fontSize: 9,
//     color: "#333",
//     flex: 1,
//   },
//   ingredientAmount: {
//     fontSize: 9,
//     color: "#666",
//     fontWeight: "bold",
//     backgroundColor: "#F5F5F5",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 3,
//   },
//   instructionItem: {
//     flexDirection: "row",
//     marginBottom: 6,
//     padding: 4,
//     backgroundColor: "#fff",
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#E8E8E8",
//   },
//    instructionNumber: {
//     fontWeight: "bold",
//     fontSize: 9,
//     marginRight: 4,
//   },
//   instructionNumberText: {
//     color: "white",
//     fontSize: 8.5,
//     fontWeight: "bold",
//   },
// instructionText: {
//     fontSize: 9,
//     lineHeight: 1.3,
//     flex: 1,
//   },
//   nutritionGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//     justifyContent: "space-between",
//   },
//   nutritionCard: {
//     alignItems: "center",
//     padding: 8,
//     backgroundColor: "#fff",
//     borderRadius: 6,
//     minWidth: 60,
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },
//   nutritionValue: {
//     fontSize: 10,
//     fontWeight: "bold",
//     color: "#2E7D32",
//   },
//   nutritionLabel: {
//     fontSize: 7,
//     color: "#666",
//     textTransform: "uppercase",
//     fontWeight: "bold",
//   },
//    footer: {
//     borderTopWidth: 1,
//     borderTopColor: "#4CAF50",
//     position: "absolute",
//     bottom: 20,
//     left: 30,
//     right: 30,
//     textAlign: "center",
//     fontSize: 8.5,
//     color: "grey"
//   },
//   footerBrand: {
//     fontSize: 8,
//     fontWeight: "bold",
//     color: "#4CAF50",
//     marginBottom: 4,
//   },
// ingredientRowContainer: {
//   marginBottom: 8,
// },

// ingredientNutrition: {
//   fontSize: 8.5,
//   color: '#666',
//   marginLeft: 16,
//   marginTop: 2,
// },
//  instructionsSection: {
//     marginTop: 10,
//     padding: 10,
//     backgroundColor: "#f8f8f8",
//     borderRadius: 4,
//     pageBreakInside: "avoid",
//   },
//    instructionStep: {
//     flexDirection: "row",
//     marginBottom: 4,
//   },

//   // NEW NUTRITION FACTS LABEL STYLES
//   nutritionFactsLabel: {
//     width: 250,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 2,
//     borderColor: "#000000",
//     padding: 0,
//     marginTop: 20,
//     alignSelf: "center",
//   },
//   nutritionLabelTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     color: "#000000",
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//   },
//   nutritionLabelSection: {
//     borderTopWidth: 1,
//     borderTopColor: "#000000",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
//   nutritionLabelThickBorder: {
//     borderTopWidth: 8,
//     borderTopColor: "#000000",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
//   nutritionLabelRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 2,
//   },
//   nutritionLabelMainText: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#000000",
//   },
//   nutritionLabelSubText: {
//     fontSize: 10,
//     color: "#000000",
//   },
//   nutritionLabelSmallText: {
//     fontSize: 8,
//     color: "#000000",
//   },
//   nutritionLabelRightAlign: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#000000",
//     textAlign: "right",
//   },
//   nutritionLabelIndented: {
//     paddingLeft: 15,
//   },
//   nutritionLabelFootnote: {
//     fontSize: 7,
//     color: "#000000",
//     paddingTop: 4,
//     lineHeight: 1.2,
//   },
// });

// // ✅ Helper components
// const SectionHeader = ({ title }) => (
//   <View style={styles.sectionHeader}>
//     <View style={styles.sectionIcon} />
//     <Text style={styles.sectionTitle}>{title}</Text>
//   </View>
// );

// // NEW NUTRITION FACTS LABEL COMPONENT
// const NutritionFactsLabel = ({ data, servings }) => {
//   const perServingNutrition = {
//     calories: Math.round((data.total_calories || 0) / servings),
//     totalFat: ((data.total_fat || 0) / servings).toFixed(1),
//     saturatedFat: "0", // You may need to add this to your data
//     transFat: "0", // You may need to add this to your data
//     cholesterol: "0", // You may need to add this to your data
//     sodium: "0", // You may need to add this to your data
//     totalCarbs: ((data.total_carbs || 0) / servings).toFixed(1),
//     dietaryFiber: "0", // You may need to add this to your data
//     totalSugars: "0", // You may need to add this to your data
//     protein: ((data.total_protein || 0) / servings).toFixed(1),
//     vitaminD: "0", // You may need to add this to your data
//     calcium: "0", // You may need to add this to your data
//     iron: "0", // You may need to add this to your data
//     potassium: "0", // You may need to add this to your data
//   };

//   // Calculate daily value percentages (these are rough estimates)
//   const calculateDV = (nutrient, amount) => {
//     const dailyValues = {
//       totalFat: 78, // grams
//       saturatedFat: 20, // grams
//       cholesterol: 300, // mg
//       sodium: 2300, // mg
//       totalCarbs: 275, // grams
//       dietaryFiber: 28, // grams
//       protein: 50, // grams
//     };

//     if (!dailyValues[nutrient]) return 0;
//     return Math.round((parseFloat(amount) / dailyValues[nutrient]) * 100);
//   };

//   return (
//     <View style={styles.nutritionFactsLabel}>
//       {/* Title */}
//       <Text style={styles.nutritionLabelTitle}>Nutrition Facts</Text>

//       {/* Servings */}
//       <View style={styles.nutritionLabelSection}>
//         <Text style={styles.nutritionLabelSubText}>Amount Per</Text>
//         <Text style={styles.nutritionLabelSubText}>Serving</Text>
//       </View>

//       {/* Calories */}
//       <View style={styles.nutritionLabelThickBorder}>
//         <View style={styles.nutritionLabelRow}>
//           <Text style={styles.nutritionLabelMainText}>Calories</Text>
//           <Text style={styles.nutritionLabelRightAlign}>{perServingNutrition.calories}</Text>
//         </View>
//       </View>

//       {/* Daily Value Header */}
//       <View style={styles.nutritionLabelSection}>
//         <Text style={[styles.nutritionLabelSmallText, { textAlign: "right", fontWeight: "bold" }]}>% Daily Value*</Text>
//       </View>

//       {/* Total Fat */}
//       <View style={styles.nutritionLabelSection}>
//         <View style={styles.nutritionLabelRow}>
//           <Text style={styles.nutritionLabelMainText}>Total Fat {perServingNutrition.totalFat}g</Text>
//           <Text style={styles.nutritionLabelRightAlign}>{calculateDV('totalFat', perServingNutrition.totalFat)}%</Text>
//         </View>
//         <View style={[styles.nutritionLabelRow, styles.nutritionLabelIndented]}>
//           <Text style={styles.nutritionLabelSubText}>Saturated Fat {perServingNutrition.saturatedFat}g</Text>
//           <Text style={styles.nutritionLabelSubText}>{calculateDV('saturatedFat', perServingNutrition.saturatedFat)}%</Text>
//         </View>
//         <View style={[styles.nutritionLabelRow, styles.nutritionLabelIndented]}>
//           <Text style={styles.nutritionLabelSubText}>Trans Fat {perServingNutrition.transFat}g</Text>
//         </View>
//       </View>

//       {/* Cholesterol */}
//       <View style={styles.nutritionLabelSection}>
//         <View style={styles.nutritionLabelRow}>
//           <Text style={styles.nutritionLabelMainText}>Cholesterol {perServingNutrition.cholesterol}mg</Text>
//           <Text style={styles.nutritionLabelRightAlign}>{calculateDV('cholesterol', perServingNutrition.cholesterol)}%</Text>
//         </View>
//       </View>

//       {/* Sodium */}
//       <View style={styles.nutritionLabelSection}>
//         <View style={styles.nutritionLabelRow}>
//           <Text style={styles.nutritionLabelMainText}>Sodium {perServingNutrition.sodium}mg</Text>
//           <Text style={styles.nutritionLabelRightAlign}>{calculateDV('sodium', perServingNutrition.sodium)}%</Text>
//         </View>
//       </View>

//       {/* Total Carbohydrates */}
//       <View style={styles.nutritionLabelSection}>
//         <View style={styles.nutritionLabelRow}>
//           <Text style={styles.nutritionLabelMainText}>Total Carbohydrates {perServingNutrition.totalCarbs}g</Text>
//           <Text style={styles.nutritionLabelRightAlign}>{calculateDV('totalCarbs', perServingNutrition.totalCarbs)}%</Text>
//         </View>
//         <View style={[styles.nutritionLabelRow, styles.nutritionLabelIndented]}>
//           <Text style={styles.nutritionLabelSubText}>Dietary Fiber {perServingNutrition.dietaryFiber}g</Text>
//           <Text style={styles.nutritionLabelSubText}>{calculateDV('dietaryFiber', perServingNutrition.dietaryFiber)}%</Text>
//         </View>
//         <View style={[styles.nutritionLabelRow, styles.nutritionLabelIndented]}>
//           <Text style={styles.nutritionLabelSubText}>Total Sugars {perServingNutrition.totalSugars}g</Text>
//         </View>
//       </View>

//       {/* Protein */}
//       <View style={styles.nutritionLabelThickBorder}>
//         <View style={styles.nutritionLabelRow}>
//           <Text style={styles.nutritionLabelMainText}>Protein {perServingNutrition.protein}g</Text>
//         </View>
//       </View>

//       {/* Vitamins and Minerals */}
//       <View style={styles.nutritionLabelSection}>
//         <View style={styles.nutritionLabelRow}>
//           <Text style={styles.nutritionLabelSubText}>Vitamin D {perServingNutrition.vitaminD}mcg</Text>
//           <Text style={styles.nutritionLabelSubText}>0%</Text>
//         </View>
//         <View style={styles.nutritionLabelRow}>
//           <Text style={styles.nutritionLabelSubText}>Calcium {perServingNutrition.calcium}mg</Text>
//           <Text style={styles.nutritionLabelSubText}>0%</Text>
//         </View>
//         <View style={styles.nutritionLabelRow}>
//           <Text style={styles.nutritionLabelSubText}>Iron {perServingNutrition.iron}mg</Text>
//           <Text style={styles.nutritionLabelSubText}>0%</Text>
//         </View>
//         <View style={styles.nutritionLabelRow}>
//           <Text style={styles.nutritionLabelSubText}>Potassium {perServingNutrition.potassium}mg</Text>
//           <Text style={styles.nutritionLabelSubText}>0%</Text>
//         </View>
//       </View>

//       {/* Footnote */}
//       <View style={styles.nutritionLabelThickBorder}>
//         <Text style={styles.nutritionLabelFootnote}>
//           * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
//         </Text>
//       </View>
//     </View>
//   );
// };

// const RecipePDF = ({ data }) => {
//   if (!data) {
//     return (
//       <Document>
//         <Page size="A4" style={styles.page}>
//           <Text style={styles.header}>No Recipe Data</Text>
//         </Page>
//       </Document>
//     );
//   }

//   const ingredients = (data.ingredients || []).map((item, i) => ({
//     id: `${item.ingredient?.name || "item"}-${i}`,
//     ingredient: item.ingredient?.name || "Unknown ingredient",
//     amount: `${item.integral || ""} ${
//       item.nominator && item.denominator
//         ? `${item.nominator}/${item.denominator}`
//         : ""
//     } ${item.unit || ""}`.trim(),
//     calories:`${item.calories}`,
//     protein:`${item.protein}`,
//     fat:`${item.fat}`,
//     fluid:`${item.fluid}`,
//     carbs:`${item.carbs}`,
//   }));

//   const instructions = data.instruction
//     ? data.instruction
//         .split(/[.\n]+/)
//         .map((s) => s.trim())
//         .filter(Boolean)
//     : ["No instructions provided"];

//   const categories =
//     data.food_category_maps?.map((cat) => cat.food_category?.name) || [
//       "Uncategorized",
//     ];

//   const servings = data.no_of_servings || 1;

//   const perServingNutrition = {
//     calories: Math.round((data.total_calories || 0) / servings),
//     carbs: ((data.total_carbs || 0) / servings).toFixed(1),
//     protein: ((data.total_protein || 0) / servings).toFixed(1),
//     fat: ((data.total_fat || 0) / servings).toFixed(1),
//     fluid: ((data.total_fluid || 0) / servings).toFixed(1),
//   };

//   return (
//     <Document>
//       {/* Page 1: Recipe Details */}
//       <Page size="A4" style={styles.page}>
//         {/* Header */}
//         <Text style={styles.header}>{data.name || "Recipe"}</Text>
//         <Text style={styles.subtitle}>A delicious recipe crafted with care</Text>

//         {/* Servings & Categories */}
//         <View style={styles.quickInfoRow}>
//           <View style={styles.quickInfoItem}>
//             <View style={styles.quickInfoIcon} />
//             <Text style={styles.quickInfoLabel}>Servings:</Text>
//             <Text style={styles.quickInfoValue}>{data.no_of_servings}</Text>
//           </View>
//           {categories.map((cat, idx) => (
//             <View key={idx} style={styles.categoryTag}>
//               <Text style={styles.categoryText}>{cat}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Nutrition Facts */}
//         <View style={styles.section}>
//           <SectionHeader title="Nutrition Facts (Total)" />
//           <View style={styles.nutritionGrid}>
//             {[
//               { label: "Calories", value: `${Math.round(data.total_calories || 0)}` },
//               { label: "Carbs", value: `${(data.total_carbs || 0).toFixed(1)}g` },
//               { label: "Protein", value: `${(data.total_protein || 0).toFixed(1)}g` },
//               { label: "Fat", value: `${(data.total_fat || 0).toFixed(1)}g` },
//               { label: "Fluid oz", value: `${(data.total_fluid || 0).toFixed(1)}` },
//             ].map((item, i) => (
//               <View key={i} style={styles.nutritionCard}>
//                 <Text style={styles.nutritionValue}>{item.value}</Text>
//                 <Text style={styles.nutritionLabel}>{item.label}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Ingredients */}
//         <View style={styles.section}>
//           <SectionHeader title="Ingredients" />
//           {ingredients.map((ing) => (
//             <View key={ing.id} style={styles.ingredientRowContainer}>
//               <View style={styles.ingredientRow}>
//                 <View style={styles.ingredientBullet} />
//                 <Text style={styles.ingredientText}>{ing.ingredient}</Text>
//                 {ing.amount && (
//                   <Text style={styles.ingredientAmount}>{ing.amount}</Text>
//                 )}
//               </View>
//               <Text style={styles.ingredientNutrition}>
//                 {`${ing.calories} kcal | ${ing.protein}g Protein | ${ing.fat}g Fat | ${ing.carbs}g Carbs | ${ing.fluid}ml Fluid`}
//               </Text>
//             </View>
//           ))}
//         </View>

//         {/* Instructions */}
//         <View style={styles.instructionsSection} wrap={false}>
//           <SectionHeader title="Instructions" />
//           {instructions.map((step, i) => (
//             <View key={i} style={styles.instructionStep}>
//               <Text style={styles.instructionNumber}>{i + 1}.</Text>
//               <Text style={styles.instructionText}>{step}</Text>
//             </View>
//           ))}
//         </View>

//         <View style={styles.section} wrap={false}>
//           <SectionHeader title="Nutrition per Serving" />
//           <View style={styles.nutritionGrid}>
//             {[
//               { label: "Calories", value: `${perServingNutrition.calories}` },
//               { label: "Carbs", value: `${perServingNutrition.carbs}g` },
//               { label: "Protein", value: `${perServingNutrition.protein}g` },
//               { label: "Fat", value: `${perServingNutrition.fat}g` },
//               { label: "Fluid oz", value: `${perServingNutrition.fluid}` },
//             ].map((item, i) => (
//               <View key={i} style={styles.nutritionCard}>
//                 <Text style={styles.nutritionValue}>{item.value}</Text>
//                 <Text style={styles.nutritionLabel}>{item.label}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text style={styles.footerBrand}>Eating right, simplified.</Text>
//           <Text>
//             Powered by Macros and Meals Nutrition. Copyright © 2025.
//           </Text>
//           <Text>
//             For informational purposes only. Always seek medical advice from
//             a qualified provider.
//           </Text>
//         </View>
//         <NutritionFactsLabel data={data} servings={servings} />
//       </Page>

//       {/* Page 2: Nutrition Facts Label
//       <Page size="A4" style={styles.page}>

//       </Page> */}
//     </Document>
//   );
// };

// export default RecipePDF;

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// ✅ PDF styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 22,
    marginBottom: 8,
    textAlign: "center",
    color: "#2E7D32",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
    fontStyle: "italic",
  },
  heroSection: {
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#4CAF50",
    overflow: "hidden",
  },
  recipeImage: {
    width: "100%",
    height: 150,
    objectFit: "cover",
  },
  quickInfoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#E8F5E8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#81C784",
  },
  quickInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 6,
  },
  quickInfoIcon: {
    width: 8,
    height: 8,
    backgroundColor: "#66BB6A",
    borderRadius: 4,
    marginRight: 4,
  },
  quickInfoLabel: {
    fontSize: 9,
    color: "#555",
    fontWeight: "bold",
    marginRight: 4,
  },
  quickInfoValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  categoryTag: {
    backgroundColor: "#C8E6C9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#66BB6A",
  },
  categoryText: {
    fontSize: 8,
    color: "#2E7D32",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 18,
    padding: 12,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: "#4CAF50",
  },
  sectionIcon: {
    width: 6,
    height: 6,
    backgroundColor: "#4CAF50",
    borderRadius: 3,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4CAF50",
    textTransform: "uppercase",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    flexWrap: "wrap",
  },
  ingredientBullet: {
    width: 5,
    height: 5,
    backgroundColor: "#4CAF50",
    borderRadius: 3,
    marginRight: 6,
  },
  ingredientText: {
    fontSize: 9,
    color: "#333",
    flex: 1,
  },
  ingredientAmount: {
    fontSize: 9,
    color: "#666",
    fontWeight: "bold",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 6,
    padding: 4,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  instructionNumber: {
    fontWeight: "bold",
    fontSize: 9,
    marginRight: 4,
  },
  instructionNumberText: {
    color: "white",
    fontSize: 8.5,
    fontWeight: "bold",
  },
  instructionText: {
    fontSize: 9,
    lineHeight: 1.3,
    flex: 1,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  nutritionCard: {
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 6,
    minWidth: 60,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  nutritionValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  nutritionLabel: {
    fontSize: 7,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#4CAF50",
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8.5,
    color: "grey",
  },
  footerBrand: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 4,
  },
  ingredientRowContainer: {
    marginBottom: 8,
  },

  ingredientNutrition: {
    fontSize: 8.5,
    color: "#666",
    marginLeft: 16,
    marginTop: 2,
  },
  instructionsSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 4,
    pageBreakInside: "avoid",
  },
  instructionStep: {
    flexDirection: "row",
    marginBottom: 4,
  },

  // NEW NUTRITION FACTS LABEL STYLES
  nutritionFactsLabel: {
    width: 250,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#000000",
    padding: 0,
    marginTop: 20,
    alignSelf: "center",
  },
  nutritionLabelTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000000",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  nutritionLabelSection: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  nutritionLabelThickBorder: {
    borderTopWidth: 8,
    borderTopColor: "#000000",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  nutritionLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  nutritionLabelMainText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  nutritionLabelSubText: {
    fontSize: 10,
    color: "#000000",
  },
  nutritionLabelSmallText: {
    fontSize: 8,
    color: "#000000",
  },
  nutritionLabelRightAlign: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "right",
  },
  nutritionLabelIndented: {
    paddingLeft: 15,
  },
  nutritionLabelFootnote: {
    fontSize: 7,
    color: "#000000",
    paddingTop: 4,
    lineHeight: 1.2,
  },

  // CIRCULAR DASHBOARD STYLES
  circularDashboard: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 20,
    position: "relative",
  },
  dashboardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  dashboardSubtitle: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  caloriesCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 80,
    zIndex: 2,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  caloriesNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  caloriesLabel: {
    fontSize: 8,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  perServingText: {
    fontSize: 6,
    color: "#FFFFFF",
  },
  macroRingsContainer: {
    position: "relative",
    width: 280,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  macroRing: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  macroRingInner: {
    alignItems: "center",
  },
  proteinRing: {
    backgroundColor: "#4ECDC4",
    top: 20,
    left: 105,
  },
  carbsRing: {
    backgroundColor: "#45B7D1",
    top: 60,
    right: 40,
  },
  fatRing: {
    backgroundColor: "#FFA07A",
    bottom: 60,
    right: 40,
  },
  fluidRing: {
    backgroundColor: "#98D8C8",
    bottom: 20,
    left: 105,
  },
  macroValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  macroLabel: {
    fontSize: 7,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  // HEXAGON GRID STYLES
  hexagonGrid: {
    marginTop: 20,
    alignItems: "center",
    padding: 20,
  },
  hexagonGridTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 15,
    textAlign: "center",
  },
  hexagonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  hexagonItem: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    transform: [{ rotate: "45deg" }],
    borderRadius: 8,
  },
  hexagonValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    transform: [{ rotate: "-45deg" }],
  },
  hexagonLabel: {
    fontSize: 8,
    color: "#FFFFFF",
    fontWeight: "bold",
    transform: [{ rotate: "-45deg" }],
    textAlign: "center",
  },
  hexagonFooter: {
    marginTop: 15,
    alignItems: "center",
  },
  hexagonFooterText: {
    fontSize: 10,
    color: "#666",
    fontStyle: "italic",
  },

  // MINIMALIST CARDS STYLES
  minimalistCards: {
    marginTop: 20,
    padding: 20,
  },
  minimalistHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  minimalistTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  minimalistSubtitle: {
    fontSize: 10,
    color: "#666",
    fontStyle: "italic",
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 12,
  },
  nutritionCard2: {
    width: 50,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardUnit: {
    fontSize: 8,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  cardLabel: {
    fontSize: 7,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  minimalistFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  footerEmoji: {
    fontSize: 12,
    marginRight: 6,
  },
  footerText: {
    fontSize: 9,
    color: "#666",
    fontStyle: "italic",
  },
});

// ✅ Helper components
const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionIcon} />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// UNIQUE CIRCULAR NUTRITION DASHBOARD COMPONENT
const CircularNutritionDashboard = ({ data, servings }) => {
  const perServingNutrition = {
    calories: Math.round((data.total_calories || 0) / servings),
    carbs: ((data.total_carbs || 0) / servings).toFixed(1),
    protein: ((data.total_protein || 0) / servings).toFixed(1),
    fat: ((data.total_fat || 0) / servings).toFixed(1),
    fluid: ((data.total_fluid || 0) / servings).toFixed(1),
  };

  return (
    <View style={styles.circularDashboard}>
      {/* Central Calories Circle */}
      <View style={styles.caloriesCircle}>
        <Text style={styles.caloriesNumber}>
          {perServingNutrition.calories}
        </Text>
        <Text style={styles.caloriesLabel}>CALORIES</Text>
        <Text style={styles.perServingText}>per serving</Text>
      </View>

      {/* Macro Rings Around Central Circle */}
      <View style={styles.macroRingsContainer}>
        {/* Protein Ring */}
        <View style={[styles.macroRing, styles.proteinRing]}>
          <View style={styles.macroRingInner}>
            <Text style={styles.macroValue}>
              {perServingNutrition.protein}g
            </Text>
            <Text style={styles.macroLabel}>PROTEIN</Text>
          </View>
        </View>

        {/* Carbs Ring */}
        <View style={[styles.macroRing, styles.carbsRing]}>
          <View style={styles.macroRingInner}>
            <Text style={styles.macroValue}>{perServingNutrition.carbs}g</Text>
            <Text style={styles.macroLabel}>CARBS</Text>
          </View>
        </View>

        {/* Fat Ring */}
        <View style={[styles.macroRing, styles.fatRing]}>
          <View style={styles.macroRingInner}>
            <Text style={styles.macroValue}>{perServingNutrition.fat}g</Text>
            <Text style={styles.macroLabel}>FAT</Text>
          </View>
        </View>

        {/* Fluid Ring */}
        <View style={[styles.macroRing, styles.fluidRing]}>
          <View style={styles.macroRingInner}>
            <Text style={styles.macroValue}>{perServingNutrition.fluid}</Text>
            <Text style={styles.macroLabel}>FLUID OZ</Text>
          </View>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.dashboardTitle}>NUTRITION BREAKDOWN</Text>
      <Text style={styles.dashboardSubtitle}>Per Serving Analysis</Text>
    </View>
  );
};

// ALTERNATIVE: MODERN HEXAGON NUTRITION GRID
const HexagonNutritionGrid = ({ data, servings }) => {
  const perServingNutrition = {
    calories: Math.round((data.total_calories || 0) / servings),
    carbs: ((data.total_carbs || 0) / servings).toFixed(1),
    protein: ((data.total_protein || 0) / servings).toFixed(1),
    fat: ((data.total_fat || 0) / servings).toFixed(1),
    fluid: ((data.total_fluid || 0) / servings).toFixed(1),
  };

  const nutritionItems = [
    {
      label: "CALORIES",
      value: perServingNutrition.calories,
      color: "#FF6B6B",
      unit: "",
    },
    {
      label: "PROTEIN",
      value: perServingNutrition.protein,
      color: "#4ECDC4",
      unit: "g",
    },
    {
      label: "CARBS",
      value: perServingNutrition.carbs,
      color: "#45B7D1",
      unit: "g",
    },
    {
      label: "FAT",
      value: perServingNutrition.fat,
      color: "#FFA07A",
      unit: "g",
    },
    {
      label: "FLUID",
      value: perServingNutrition.fluid,
      color: "#98D8C8",
      unit: "oz",
    },
  ];

  return (
    <View style={styles.hexagonGrid}>
      <Text style={styles.hexagonGridTitle}>NUTRITION PER SERVING</Text>

      <View style={styles.hexagonContainer}>
        {nutritionItems.map((item, index) => (
          <View
            key={index}
            style={[styles.hexagonItem, { backgroundColor: item.color }]}
          >
            <Text style={styles.hexagonValue}>
              {item.value}
              {item.unit}
            </Text>
            <Text style={styles.hexagonLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.hexagonFooter}>
        <Text style={styles.hexagonFooterText}>
          📊 Balanced nutrition for optimal health
        </Text>
      </View>
    </View>
  );
};

// ALTERNATIVE: MINIMALIST CARD LAYOUT
const MinimalistNutritionCards = ({ data, servings }) => {
  const perServingNutrition = {
    calories: Math.round((data.total_calories || 0) / servings),
    carbs: ((data.total_carbs || 0) / servings).toFixed(1),
    protein: ((data.total_protein || 0) / servings).toFixed(1),
    fat: ((data.total_fat || 0) / servings).toFixed(1),
    fluid: ((data.total_fluid || 0) / servings).toFixed(1),
  };

  const cards = [
    {
      icon: "🔥",
      label: "Energy",
      value: perServingNutrition.calories,
      unit: "cal",
      gradient: ["#FF9A56", "#FF6B6B"],
    },
    {
      icon: "💪",
      label: "Protein",
      value: perServingNutrition.protein,
      unit: "g",
      gradient: ["#4ECDC4", "#44A08D"],
    },
    {
      icon: "🌾",
      label: "Carbs",
      value: perServingNutrition.carbs,
      unit: "g",
      gradient: ["#45B7D1", "#2196F3"],
    },
    {
      icon: "🥑",
      label: "Fat",
      value: perServingNutrition.fat,
      unit: "g",
      gradient: ["#FFA07A", "#FA8072"],
    },
    {
      icon: "💧",
      label: "Fluid",
      value: perServingNutrition.fluid,
      unit: "oz",
      gradient: ["#98D8C8", "#66D9EF"],
    },
  ];

  return (
    <View style={styles.minimalistCards}>
      <View style={styles.minimalistHeader}>
        <Text style={styles.minimalistTitle}>Nutrition Snapshot</Text>
        <Text style={styles.minimalistSubtitle}>Per serving breakdown</Text>
      </View>

      <View style={styles.cardsGrid}>
        {cards.map((card, index) => (
          <View
            key={index}
            style={[
              styles.nutritionCard2,
              { backgroundColor: card.gradient[0] },
            ]}
          >
            <Text style={styles.cardIcon}>{card.icon}</Text>
            <Text style={styles.cardValue}>{card.value}</Text>
            <Text style={styles.cardUnit}>{card.unit}</Text>
            <Text style={styles.cardLabel}>{card.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.minimalistFooter}>
        <Text style={styles.footerEmoji}>✨</Text>
        <Text style={styles.footerText}>
          Crafted with nutritional precision
        </Text>
      </View>
    </View>
  );
};

// Choose which component to use (you can switch between them)
const NutritionFactsLabel = ({ data, servings }) => {
  // Option 1: Circular Dashboard (uncomment to use)
  // return <CircularNutritionDashboard data={data} servings={servings} />;

  // Option 2: Hexagon Grid (uncomment to use)
  // return <HexagonNutritionGrid data={data} servings={servings} />;

  // Option 3: Minimalist Cards (currently active)
  return <MinimalistNutritionCards data={data} servings={servings} />;
};

const RecipePDF = ({ data }) => {
  if (!data) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.header}>No Recipe Data</Text>
        </Page>
      </Document>
    );
  }

  const ingredients = (data.ingredients || []).map((item, i) => ({
    id: `${item.ingredient?.name || "item"}-${i}`,
    ingredient: item.ingredient?.name || "Unknown ingredient",
    amount: `${item.integral || ""} ${
      item.nominator && item.denominator
        ? `${item.nominator}/${item.denominator}`
        : ""
    } ${item.unit || ""}`.trim(),
    calories: `${item.calories}`,
    protein: `${item.protein}`,
    fat: `${item.fat}`,
    fluid: `${item.fluid}`,
    carbs: `${item.carbs}`,
  }));

  const instructions = data.instruction
    ? data.instruction
        .split(/[.\n]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : ["No instructions provided"];

  const categories = data.food_category_maps?.map(
    (cat) => cat.food_category?.name
  ) || ["Uncategorized"];

  const servings = data.no_of_servings || 1;

  const perServingNutrition = {
    calories: Math.round((data.total_calories || 0) / servings),
    carbs: ((data.total_carbs || 0) / servings).toFixed(1),
    protein: ((data.total_protein || 0) / servings).toFixed(1),
    fat: ((data.total_fat || 0) / servings).toFixed(1),
    fluid: ((data.total_fluid || 0) / servings).toFixed(1),
  };

  return (
    <Document>
      {/* Page 1: Recipe Details */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>{data.name || "Recipe"}</Text>
        <Text style={styles.subtitle}>
          A delicious recipe crafted with care
        </Text>

        {/* Servings & Categories */}
        {/* <View style={styles.quickInfoRow}>
          <View style={styles.quickInfoItem}>
            <View style={styles.quickInfoIcon} />
            <Text style={styles.quickInfoLabel}>Servings:</Text>
            <Text style={styles.quickInfoValue}>{data.no_of_servings}</Text>
          </View>
          {categories.map((cat, idx) => (
            <View key={idx} style={styles.categoryTag}>
              <Text style={styles.categoryText}>{cat}</Text>
            </View>
          ))}
        </View> */}

        {/* Nutrition Facts */}
  <View style={styles.section}>
  {/* Header + Quick Info Row Side by Side */}
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap:2, padding:3 }}>
    <SectionHeader title="Nutrition Facts (Total)" />

    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={styles.quickInfoItem}>
        <View style={styles.quickInfoIcon} />
        <Text style={styles.quickInfoLabel}>Servings:</Text>
        <Text style={styles.quickInfoValue}>{data.no_of_servings}</Text>
      </View>

      {categories.map((cat, idx) => (
        <View key={idx} style={[styles.categoryTag, { marginLeft: 8 }]}>
          <Text style={styles.categoryText}>{cat}</Text>
        </View>
      ))}
    </View>
  </View>

  {/* Nutrition Grid */}
  <View style={styles.nutritionGrid}>
    {[
      { label: "Calories", value: `${Math.round(data.total_calories || 0)}` },
      { label: "Carbs", value: `${(data.total_carbs || 0).toFixed(1)}g` },
      { label: "Protein", value: `${(data.total_protein || 0).toFixed(1)}g` },
      { label: "Fat", value: `${(data.total_fat || 0).toFixed(1)}g` },
      { label: "Fluid oz", value: `${(data.total_fluid || 0).toFixed(1)}` },
    ].map((item, i) => (
      <View key={i} style={styles.nutritionCard}>
        <Text style={styles.nutritionValue}>{item.value}</Text>
        <Text style={styles.nutritionLabel}>{item.label}</Text>
      </View>
    ))}
  </View>
</View>



 <View style={styles.section} wrap={false}>
          <SectionHeader title="Nutrition per Serving" />
          <View style={styles.nutritionGrid}>
            {[
              { label: "Calories", value: `${perServingNutrition.calories}` },
              { label: "Carbs", value: `${perServingNutrition.carbs}g` },
              { label: "Protein", value: `${perServingNutrition.protein}g` },
              { label: "Fat", value: `${perServingNutrition.fat}g` },
              { label: "Fluid oz", value: `${perServingNutrition.fluid}` },
            ].map((item, i) => (
              <View key={i} style={styles.nutritionCard}>
                <Text style={styles.nutritionValue}>{item.value}</Text>
                <Text style={styles.nutritionLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* <NutritionFactsLabel data={data} servings={servings} /> */}
        {/* Ingredients */}
        <View style={styles.section}>
          <SectionHeader title="Ingredients" />
          {ingredients.map((ing) => (
            <View key={ing.id} style={styles.ingredientRowContainer}>
              <View style={styles.ingredientRow}>
                <View style={styles.ingredientBullet} />
                <Text style={styles.ingredientText}>{ing.ingredient}</Text>
                {ing.amount && (
                  <Text style={styles.ingredientAmount}>{ing.amount}</Text>
                )}
              </View>
              <Text style={styles.ingredientNutrition}>
                {`${ing.calories} kcal | ${ing.protein}g Protein | ${ing.fat}g Fat | ${ing.carbs}g Carbs | ${ing.fluid}ml Fluid`}
              </Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsSection} wrap={true}>
          <SectionHeader title="Instructions" />
          {instructions.map((step, i) => (
            <View key={i} style={styles.instructionStep}>
              <Text style={styles.instructionNumber}>{i + 1}.</Text>
              <Text style={styles.instructionText}>{step}</Text>
            </View>
          ))}
        </View>

       

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Eating right, simplified.</Text>
          <Text>Powered by Macros and Meals Nutrition. Copyright © 2025.</Text>
          <Text>
            For informational purposes only. Always seek medical advice from a
            qualified provider.
          </Text>
        </View>

        {/* Nutrition Facts Label on Same Page */}
      </Page>
    </Document>
  );
};

export default RecipePDF;
