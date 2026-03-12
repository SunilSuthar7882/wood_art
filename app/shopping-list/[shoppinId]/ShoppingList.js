import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Checkbox, Divider } from "@mui/material";
import { useUpdatefoodhaveitflagebycustomer } from "@/helpers/hooks/customer/updatefoodhaveitflagebycustomer";
import { useGetfoodshoppinglistbycustomer } from "@/helpers/hooks/customer/getfoodshoppinglistbycustomer";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomButton } from "@/app/ThemeRegistry";
import CommonLoader from "@/component/CommonLoader";
const ShoppingList = ({ planId }) => {
  const { mutate: updateHaveItFlag } = useUpdatefoodhaveitflagebycustomer();
  const { data: usershoppingList, isFetching } =
    useGetfoodshoppinglistbycustomer(planId);
  const [localData, setLocalData] = useState([]);
  const [categoryVisibility, setCategoryVisibility] = useState({});

  useEffect(() => {
    if (usershoppingList?.data) {
      setLocalData(usershoppingList.data);
      const initialVisibility = {};
      usershoppingList.data.forEach((cat, index) => {
        initialVisibility[cat.category] = true;
      });
      setCategoryVisibility(initialVisibility);
    }
  }, [usershoppingList]);

  const handleToggle = (catIndex, itemIndex) => {
    const item = localData[catIndex].items[itemIndex];
    const food_serving_id = parseInt(item.food_serving_id);

    if (!food_serving_id || isNaN(food_serving_id)) {
      console.error("Invalid food_serving_id:", food_serving_id);
      return;
    }

    updateHaveItFlag(
      { plan_id: planId, food_serving_id },
      {
        onSuccess: () => {
          setLocalData((prev) => {
            const updated = [...prev];
            const updatedItems = [...updated[catIndex].items];
            updatedItems[itemIndex] = {
              ...item,
              is_have_it: !item.is_have_it,
            };
            updated[catIndex] = {
              ...updated[catIndex],
              items: updatedItems,
            };
            return updated;
          });
        },
      }
    );
  };

  if (isFetching) return <CommonLoader />;

  return (
    <Box>
      <Typography variant="h5">Shopping List</Typography>

      {localData.map((category, catIndex) => {
        const isVisible = categoryVisibility[category.category];
        const needIt = category.items.filter(
          (item) => !item.is_have_it && item.food_serving_id
        );
        const haveIt = category.items.filter(
          (item) => item.is_have_it && item.food_serving_id
        );

        return (
          <Box key={catIndex} mt={3}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                backgroundColor: "#01933c",
                px: 2,
                py: 1,
                color: "#fff",
                borderRadius: "4px",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {category.category}
              </Typography>
              <CustomButton
                onClick={() =>
                  setCategoryVisibility((prev) => ({
                    ...prev,
                    [category.category]: !prev[category.category],
                  }))
                }
                sx={{
                  color: "#fff",
                  minWidth: "auto",
                  padding: 0,
                }}
              >
                {categoryVisibility[category.category] ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon aria-hidden={false}/>
                )}
              </CustomButton>
            </Box>

            {isVisible && (
              <Grid container spacing={2} mt={1}>
                {/* NEED IT */}
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined">
                    <Box p={1} sx={{ backgroundColor: "#e6f5ec" }}>
                      <Typography fontWeight="bold" color="#01933c">
                        NEED IT
                      </Typography>
                    </Box>
                    <Divider />
                    {needIt.length === 0 ? (
                      <Box p={2}>
                        <Typography variant="body2" color="text.secondary">
                          All items have it
                        </Typography>
                      </Box>
                    ) : (
                      needIt.map((item, idx) => {
                        const originalIndex = category.items.findIndex(
                          (i) => i.food_serving_id === item.food_serving_id
                        );
                        return (
                          <Box
                            key={item.food_serving_id}
                            px={2}
                            py={1}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box display="flex" alignItems="center" gap={1}>
                              <Checkbox
                                checked={false}
                                onChange={() =>
                                  handleToggle(catIndex, originalIndex)
                                }
                                sx={{
                                  color: "#01933c",
                                  "&.Mui-checked": { color: "#01933c" },
                                }}
                              />
                              <Typography>{item.food?.name}</Typography>
                            </Box>
                            <Typography variant="body2">
                              {item.total_quantity} {item.unit || ""}
                            </Typography>
                          </Box>
                        );
                      })
                    )}
                  </Paper>
                </Grid>

                {/* HAVE IT */}
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined">
                    <Box p={1} sx={{ backgroundColor: "#e6f5ec" }}>
                      <Typography fontWeight="bold" color="#01933c">
                        HAVE IT
                      </Typography>
                    </Box>
                    <Divider />
                    {haveIt.length === 0 ? (
                      <Box p={2}>
                        <Typography variant="body2" color="text.secondary">
                          No items yet
                        </Typography>
                      </Box>
                    ) : (
                      haveIt.map((item, idx) => {
                        const originalIndex = category.items.findIndex(
                          (i) => i.food_serving_id === item.food_serving_id
                        );
                        return (
                          <Box
                            key={item.food_serving_id}
                            px={2}
                            py={1}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box display="flex" alignItems="center" gap={1}>
                              <Checkbox
                                checked={true}
                                onChange={() =>
                                  handleToggle(catIndex, originalIndex)
                                }
                                sx={{
                                  color: "#01933c",
                                  "&.Mui-checked": { color: "#01933c" },
                                }}
                              />
                              <Typography>{item.food?.name}</Typography>
                            </Box>
                            <Typography variant="body2">
                              {item.total_quantity} {item.unit || ""}
                            </Typography>
                          </Box>
                        );
                      })
                    )}
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default ShoppingList;
