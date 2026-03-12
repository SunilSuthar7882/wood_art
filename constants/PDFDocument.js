import { mealTypes } from "@/utils/utils";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    width: 120,
  },
  tagline: {
    fontSize: 10,
    color: "#006400",
    textAlign: "right",
  },
  dayHeader: {
    backgroundColor: "#006400",
    color: "#fff",
    padding: 8,
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },
  mealSection: {
    marginBottom: 20,
    borderLeft: 2,
    borderRight: 2,
    borderColor: "#eee",
    paddingHorizontal: 10,
  },
  mealTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    marginBottom: 8,
  },
  mealContent: {
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  mealInfo: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  mealLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333",
    marginRight: 5,
    width: 85,
  },
  nutrientContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nutrientLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333",
    marginRight: 2,
  },
  nutrientValue: {
    fontSize: 9,
    color: "#666",
    marginRight: 2,
  },
  separator: {
    fontSize: 9,
    color: "#999",
    marginHorizontal: 6,
  },
  notesLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
    paddingLeft: 5,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginVertical: 5,
  },
  dayTotal: {
    backgroundColor: "#006400",
    color: "#fff",
    padding: 8,
    fontSize: 10,
    marginTop: 15,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    color: "#666",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
  },
  footerText: {
    textAlign: "center",
    fontSize: 7,
    marginBottom: 5,
  },
  disclaimer: {
    fontSize: 6,
    color: "#888",
    lineHeight: 1.2,
  },
  foodList: {
    marginTop: 6,
    marginBottom: 6,
  },

  foodListLabel: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 2,
  },

  foodName: {
    fontSize: 11,
    marginLeft: 8,
  },
  nutrientLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333",
    marginRight: 12,
    width: 40,
    textAlign: "left",
  },

  nutrientValue: {
    fontSize: 9,
    color: "#555",
    marginRight: 12,
    width: 40,
    textAlign: "left",
  },

  foodName: {
    fontSize: 9,
    color: "#000",
    textAlign: "left",
  },
});

const formatServing = (integral, nominator, denominator) => {
  const int = integral || 0;
  const num = nominator || 0;
  const den = denominator || 0;

  let parts = [];
  if (int > 0) parts.push(int);
  if (num > 0 && den > 0) parts.push(`${num}/${den}`);
  return parts.join(" ");
};

const formatNumber = (val) => {
  return val ? Number(val).toFixed(2) : "0.00";
};

const PDFDocument = ({ data }) => {
  const DayPage = ({ dayData }) => {
    return (
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              alt="txt"
              src="/images/logo-with-name.png"
              style={{ width: 140, height: 50 }}
            />
          </View>
          <Text style={styles.tagline}>
            Smarter Nutrition. Stronger Results.
          </Text>
        </View>

        <View style={styles.dayHeader}>
          <Text>DAY {dayData?.day_number}</Text>
        </View>

        {dayData?.meal_plan_slots.map((item, idx) => (
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 10,
              marginBottom: 12,
            }}
            key={idx}
          >
            <Text style={[styles.mealTitle, { marginBottom: 6 }]}>
              {item.title}
            </Text>

            <View
              style={[
                styles.mealInfo,
                {
                  borderBottomWidth: 0.5,
                  borderBottomColor: "#ccc",
                  paddingBottom: 4,
                  marginBottom: 4,
                },
              ]}
            >
              <Text style={[styles.mealLabel, { width: 60 }]}>Food</Text>
              <Text
                style={[styles.nutrientLabel, { flex: 1, textAlign: "center" }]}
              >
                Cal
              </Text>
              <Text
                style={[styles.nutrientLabel, { flex: 1, textAlign: "center" }]}
              >
                Carb
              </Text>
              <Text
                style={[styles.nutrientLabel, { flex: 1, textAlign: "center" }]}
              >
                Prot
              </Text>
              <Text
                style={[styles.nutrientLabel, { flex: 1, textAlign: "center" }]}
              >
                Fat
              </Text>
              <Text
                style={[styles.nutrientLabel, { flex: 1, textAlign: "center" }]}
              >
                H₂O
              </Text>
            </View>

            {item.meal_plan_foods.map((foodItem, foodIdx) => (
              <View style={styles.mealInfo} key={foodIdx}>
                <Text style={[styles.foodName, { width: 70 }]}>
                  {foodItem.food.name}{" "}
                  {formatServing(
                    foodItem.integral,
                    foodItem.nominator,
                    foodItem.denominator
                  )}{" "}
                  {foodItem.unit || "persons"}
                </Text>
                <Text
                  style={[
                    styles.nutrientValue,
                    { flex: 1, textAlign: "center" },
                  ]}
                >
                  {formatNumber(foodItem.calories || 0)}kcal
                </Text>
                <Text
                  style={[
                    styles.nutrientValue,
                    { flex: 1, textAlign: "center" },
                  ]}
                >
                  {formatNumber(foodItem.carbs || 0)}g
                </Text>
                <Text
                  style={[
                    styles.nutrientValue,
                    { flex: 1, textAlign: "center" },
                  ]}
                >
                  {formatNumber(foodItem.protein || 0)}g
                </Text>
                <Text
                  style={[
                    styles.nutrientValue,
                    { flex: 1, textAlign: "center" },
                  ]}
                >
                  {formatNumber(foodItem.fat || 0)}g
                </Text>
                <Text
                  style={[
                    styles.nutrientValue,
                    { flex: 1, textAlign: "center" },
                  ]}
                >
                  {formatNumber(foodItem.fluid || 0)}ml
                </Text>
              </View>
            ))}

            <View
              style={[
                styles.mealInfo,
                {
                  backgroundColor: "#f7f7f7",
                  padding: 6,
                  borderRadius: 4,
                  marginTop: 8,
                },
              ]}
            >
              <Text style={[styles.mealLabel, { width: 60 }]}>Meal Totals</Text>
              <Text
                style={[styles.nutrientValue, { flex: 1, textAlign: "center" }]}
              >
                {formatNumber(item.total_calories || 0)}kcal
              </Text>
              <Text
                style={[styles.nutrientValue, { flex: 1, textAlign: "center" }]}
              >
                {formatNumber(item.total_carbs || 0)}g
              </Text>
              <Text
                style={[styles.nutrientValue, { flex: 1, textAlign: "center" }]}
              >
                {formatNumber(item.total_protein || 0)}g
              </Text>
              <Text
                style={[styles.nutrientValue, { flex: 1, textAlign: "center" }]}
              >
                {formatNumber(item.total_fat || 0)}g
              </Text>
              <Text
                style={[styles.nutrientValue, { flex: 1, textAlign: "center" }]}
              >
                {formatNumber(item.total_fluid || 0)}ml
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.dayTotal}>
          <Text>
            DAY {dayData?.day_number} TOTAL: Calories{" "}
            {formatNumber(dayData?.total_calories) || 0} cal | Carbs{" "}
            {formatNumber(dayData?.total_carbs) || 0} g | Protein{" "}
            {formatNumber(dayData?.total_protein) || 0} g | Fat{" "}
            {formatNumber(dayData?.total_fat) || 0} g | Fluid{" "}
            {formatNumber(dayData?.total_fluid) || 0} ml
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by Macros & Meals Nutrition. Copyright © 2025. All Rights
            Reserved.
          </Text>
          <Text style={styles.disclaimer}>
            {`The contents of the Macros & Meals Nutrition website, such as text, graphics, images, information, charts, obtained from Macros & Meals Nutrition licensors, including information, advice and coaching received either in printed or electronic form, and other material contained on the Macros & Meals Nutrition website ("Content") are for informational purposes only. The Content is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on or from the Macros & Meals Nutrition website.`}
          </Text>
        </View>
      </Page>
    );
  };

  return (
    <Document>
      {data?.meal_plan_days?.map((item) => (
        <DayPage key={item?.id} dayData={item} />
      ))}
    </Document>
  );
};

export default PDFDocument;
