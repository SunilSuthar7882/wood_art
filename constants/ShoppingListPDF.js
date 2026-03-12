import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Enhanced Green Theme Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#f8fffe",
    color: "#1a4d3a",
  },

  // Header Section
  header: {
    backgroundColor: "#16a34a",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: -15,
  },
  title: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 10,
    color: "#b8e6d3",
    textAlign: "center",
  },

  // Date and Summary Bar
  summaryBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#e8f5f0",
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
    borderLeft: "4 solid #4ade80",
  },
  summaryText: {
    fontSize: 9,
    color: "#166534",
    fontWeight: "bold",
  },

  // Category Section
  categoryContainer: {
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    border: "1 solid #d1fae5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    break: false, // Prevent breaking inside category
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottom: "2 solid #4ade80",
    break: false, // Keep header with content
  },
  categoryIcon: {
    width: 12,
    height: 12,
    backgroundColor: "#4ade80",
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIconText: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#166534",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  categoryCount: {
    fontSize: 9,
    color: "#059669",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 12,
    marginLeft: "auto",
  },

  // Item Rows
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginVertical: 1,
    backgroundColor: "#f9fffe",
    borderRadius: 4,
    borderLeft: "3 solid #a7f3d0",
    break: false, // Prevent item breaking
  },
  itemRowAlternate: {
    backgroundColor: "#ffffff",
  },

  // Checkbox Style
  checkbox: {
    width: 12,
    height: 12,
    borderRadius: 3,
    border: "2 solid #4ade80",
    marginRight: 10,
    backgroundColor: "white",
  },

  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    flex: 2,
    fontSize: 10,
    color: "#166534",
    fontWeight: "500",
  },
  itemDetails: {
    flex: 1,
    textAlign: "center",
  },
  itemQty: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#059669",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  itemUnit: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 1,
  },

  // Priority Indicator
  priorityHigh: {
    backgroundColor: "#fef3c7",
    borderLeft: "3 solid #f59e0b",
  },
  priorityMedium: {
    backgroundColor: "#fef7ff",
    borderLeft: "3 solid #a855f7",
  },

  // Footer
  footer: {
    marginTop: 10,
    paddingTop: 8,
    borderTop: "1 solid #d1fae5",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    color: "#6b7280",
  },

  // Notes Section
  notesSection: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#f0fdf4",
    borderRadius: 6,
    border: "1 solid #bbf7d0",
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 6,
  },
  notesLines: {
    borderBottom: "1 solid #d1fae5",
    height: 15,
    marginBottom: 6,
  },
});

// Category Icons mapping
const getCategoryIcon = (category) => {
  const iconMap = {
    produce: "🥬",
    fruits: "🍎",
    vegetables: "🥕",
    dairy: "🥛",
    meat: "🥩",
    seafood: "🐟",
    bakery: "🍞",
    frozen: "❄️",
    pantry: "🥫",
    snacks: "🍿",
    beverages: "🥤",
    household: "🏠",
    "personal care": "🧴",
    default: "🛒",
  };

  return iconMap[category.toLowerCase()] || iconMap.default;
};

export const ShoppingListPDF = ({ data }) => {
  const totalItems = data.reduce(
    (sum, category) => sum + category.items.length,
    0
  );
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Split categories across pages if needed
  const categoriesPerPage = 3; // Adjust based on average category size
  const pageGroups = [];

  for (let i = 0; i < data.length; i += categoriesPerPage) {
    pageGroups.push(data.slice(i, i + categoriesPerPage));
  }

  return (
    <Document>
      {pageGroups.map((pageCategories, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page} wrap={false}>
          {/* Header - only on first page */}
          {pageIndex === 0 && (
            <>
              <View style={styles.header} fixed={false}>
                <Text style={styles.title}>Shopping List</Text>
                <Text style={styles.subtitle}>
                  Your organized grocery companion
                </Text>
              </View>

              {/* Summary Bar - only on first page */}
              <View style={styles.summaryBar}>
                <Text style={styles.summaryText}>{currentDate}</Text>
                <Text style={styles.summaryText}>{data.length} Categories</Text>
                <Text style={styles.summaryText}>{totalItems} Items Total</Text>
              </View>
            </>
          )}

          {/* Page continuation header for subsequent pages */}
          {pageIndex > 0 && (
            <View
              style={[styles.summaryBar, { marginTop: 0, marginBottom: 25 }]}
            >
              <Text style={styles.summaryText}> Shopping List (continued)</Text>
              <Text style={styles.summaryText}>Page {pageIndex + 1}</Text>
            </View>
          )}

          {/* Categories for this page */}
          {pageCategories.map((category, idx) => {
            // For large categories, we might need to split items across pages
            const maxItemsPerCategory = 15;
            const categoryItems = category.items;

            if (categoryItems.length <= maxItemsPerCategory) {
              // Small category - render normally
              return (
                <View
                  key={`${pageIndex}-${idx}`}
                  style={styles.categoryContainer}
                  wrap={false}
                >
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryIcon}>
                      {/* <Text style={styles.categoryIconText}>
                        {getCategoryIcon(category.category).charAt(0)}
                      </Text> */}
                    </View>
                    <Text style={styles.categoryTitle}>
                      {category.category}
                    </Text>
                    <Text style={styles.categoryCount}>
                      {category.items.length} items
                    </Text>
                  </View>

                  {categoryItems.map((item, i) => {
                    const isAlternate = i % 2 === 1;
                    const itemStyle = [
                      styles.itemRow,
                      isAlternate && styles.itemRowAlternate,
                    ];

                    return (
                      <View style={itemStyle} key={i} wrap={false}>
                        <View style={styles.checkbox} />
                        <View style={styles.itemContent}>
                          <Text style={styles.itemName}>
                            {item.food?.name || item.name || "Unnamed Item"}
                          </Text>
                          <View style={styles.itemDetails}>
                            <Text>
                              <Text style={styles.itemQty}>
                                {item.total_quantity || item.quantity || 1}{" "}
                              </Text>
                              {item.unit && (
                                <Text style={styles.itemUnit}>{item.unit}</Text>
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            } else {
              // Large category - split items
              const itemChunks = [];
              for (
                let i = 0;
                i < categoryItems.length;
                i += maxItemsPerCategory
              ) {
                itemChunks.push(
                  categoryItems.slice(i, i + maxItemsPerCategory)
                );
              }

              return itemChunks.map((chunk, chunkIdx) => (
                <View
                  key={`${pageIndex}-${idx}-${chunkIdx}`}
                  style={styles.categoryContainer}
                  wrap={false}
                >
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryIcon}>
                      {/* <Text style={styles.categoryIconText}>
                        {getCategoryIcon(category.category).charAt(0)}
                      </Text> */}
                    </View>
                    <Text style={styles.categoryTitle}>
                      {category.category} {chunkIdx > 0 ? `(continued)` : ""}
                    </Text>
                    <Text style={styles.categoryCount}>
                      {chunk.length} of {category.items.length} items
                    </Text>
                  </View>

                  {chunk.map((item, i) => {
                    const isAlternate = i % 2 === 1;
                    const itemStyle = [
                      styles.itemRow,
                      isAlternate && styles.itemRowAlternate,
                    ];

                    return (
                      <View style={itemStyle} key={i} wrap={false}>
                        <View style={styles.checkbox} />
                        <View style={styles.itemContent}>
                          <Text style={styles.itemName}>
                            {item.food?.name || item.name || "Unnamed Item"}
                          </Text>
                          <View style={styles.itemDetails}>
                            <Text style={styles.itemQty}>
                              {item.total_quantity || item.quantity || 1}
                            </Text>
                            {item.unit && (
                              <Text style={styles.itemUnit}>{item.unit}</Text>
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ));
            }
          })}

          {/* Notes Section - only on last page */}
          {pageIndex === pageGroups.length - 1 && (
            <>
              <View style={styles.notesSection} wrap={false}>
                <Text style={styles.notesTitle}>Shopping Notes</Text>
                <View style={styles.notesLines} />
                <View style={styles.notesLines} />
                <View style={styles.notesLines} />
              </View>

              {/* Footer - only on last page */}
              <View style={styles.footer}>
                <Text>Generated: {new Date().toLocaleString()}</Text>
                <Text>Happy Shopping!</Text>
              </View>
            </>
          )}
        </Page>
      ))}
    </Document>
  );
};
