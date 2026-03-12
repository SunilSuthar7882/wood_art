"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import ShoppingList from "./ShoppingList";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { CustomButton } from "@/app/ThemeRegistry";
import { Copy, Download, FileText, Mail, Share2, X } from "lucide-react";
import { useGetfoodshoppinglistbycustomer } from "@/helpers/hooks/customer/getfoodshoppinglistbycustomer";
import { ShoppingListPDF } from "@/constants/ShoppingListPDF";
import { pdf } from "@react-pdf/renderer";
import { WhatsApp } from "@mui/icons-material";
import { padding } from "@mui/system";

const initialData = [
  {
    category: "ACCOMPANIMENTS",
    needIt: [
      { name: "jam", quantity: "3 Tbsp (45 ml)", checked: false },
      {
        name: "light olive oil mayonnaise",
        quantity: "1 Tbsp (15 ml)",
        checked: false,
      },
    ],
    haveIt: [
      { name: "apple sauce", quantity: "0.5 Cup(s) (120 ml)", checked: true },
      { name: "dijon mustard", quantity: "4 tsp (20 ml)", checked: true },
    ],
  },
  {
    category: "BEEF",
    needIt: [
      { name: "beef t-bone", quantity: "6 oz (168 grams)", checked: false },
    ],
    haveIt: [{ name: "test food", quantity: "3.5 bar", checked: true }],
  },
];

const Page = () => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const { shoppinId } = useParams();
  const {
    data: usershoppingList,
    isFetching,
    refetch,
  } = useGetfoodshoppinglistbycustomer(shoppinId, {
    enabled: false,
  });
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  // const handlePDFDownload = async (params) => {
  //   const mealPlanId = params.row.id;
  //   setIsLoading(mealPlanId);

  //   try {
  //     const paramsQuery = new URLSearchParams({
  //       plan_id: String(mealPlanId),
  //     });

  //     const response = await HttpClient.get(
  //       `${API_ENDPOINTS.GET_MEAL_BY_CUSTOMER}?${paramsQuery.toString()}`
  //     );

  //     if (response?.data) {
  //       const blob = await pdf(<PDFDocument data={response.data} />).toBlob();
  //       const blobUrl = URL.createObjectURL(blob);
  //       const downloadLink = document.createElement("a");
  //       downloadLink.href = blobUrl;
  //       downloadLink.download = "Your_requested_custom_meal_plan.pdf";
  //       document.body.appendChild(downloadLink);
  //       downloadLink.click();
  //       document.body.removeChild(downloadLink);

  //       window.open(blobUrl, "_blank");

  //       setTimeout(() => {
  //         URL.revokeObjectURL(blobUrl);
  //       }, 100);
  //     }
  //   } catch (err) {
  //     console.error("Error generating PDF", err);
  //   } finally {
  //     setIsLoading(null);
  //   }
  // };

  const handlePDFDownload = async () => {
    try {
      const res = await refetch();
      const shoppingData = res.data?.data || [];
      if (!shoppingData.length) {
        console.warn("No shopping list data found.");
        return;
      }

      // Generate PDF
      const blob = await pdf(<ShoppingListPDF data={shoppingData} />).toBlob();
      const blobUrl = URL.createObjectURL(blob);

      // Download
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = "Shopping_List.pdf";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Optional: Open in new tab
      window.open(blobUrl, "_blank");

      setTimeout(() => URL.revokeObjectURL(blobUrl), 500);
    } catch (err) {
      console.error("Error generating shopping list PDF:", err);
    }
  };

  //   const handleSharePDF = async () => {
  //   try {
  //     const res = await refetch(); // call your API hook manually
  //     const shoppingData = res.data?.data || [];

  //     if (!shoppingData.length) {
  //       console.warn("No shopping list data found.");
  //       return;
  //     }

  //     // Generate PDF blob
  //     const blob = await pdf(<ShoppingListPDF data={shoppingData} />).toBlob();
  //     const file = new File([blob], "Shopping_List.pdf", {
  //       type: "application/pdf",
  //     });

  //     // Try Web Share API with files
  //     if (navigator.canShare && navigator.canShare({ files: [file] })) {
  //       await navigator.share({
  //         title: "Shopping List",
  //         text: "Here’s my shopping list PDF",
  //         files: [file],
  //       });
  //     } else {
  //       // fallback → download
  //       const blobUrl = URL.createObjectURL(blob);
  //       const downloadLink = document.createElement("a");
  //       downloadLink.href = blobUrl;
  //       downloadLink.download = "Shopping_List.pdf";
  //       document.body.appendChild(downloadLink);
  //       downloadLink.click();
  //       document.body.removeChild(downloadLink);
  //       URL.revokeObjectURL(blobUrl);
  //     }
  //   } catch (err) {
  //     console.error("Error sharing shopping list PDF:", err);
  //   }
  // };

  const handleSharePDF = async () => {
    try {
      const res = await refetch();
      const shoppingData = res.data?.data || [];

      if (!shoppingData.length) {
        console.warn("No shopping list data found.");
        return;
      }

      // Generate PDF blob
      const blob = await pdf(<ShoppingListPDF data={shoppingData} />).toBlob();
      const blobUrl = URL.createObjectURL(blob);

      // ✅ Instead of downloading or OS share, open your custom share dialog
      setShareUrl(blobUrl); // <-- state variable
      setShareDialogOpen(true);
    } catch (err) {
      console.error("Error generating shopping list PDF:", err);
    }
  };

  return (
    <>
      <Box display={"flex"} flexDirection={"column"} gap={1} p={2}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="h5">My Plans</Typography>
          <div className="flex justify-end gap-2">
            {/* <button
              onClick={handleSharePDF}
              className="inline-flex items-center justify-center gap-2 p-2 bg-[#01933c] text-white rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap h-10"
            >
              <Share2 className="w-4 h-4" />
              <span>Share PDF</span>
            </button> */}
            <button
              onClick={handlePDFDownload}
              className="inline-flex items-center justify-center gap-2 p-2 bg-[#01933c] text-white rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap h-10"
            >
              <Download className="w-4 h-4" />
              <FileText className="w-4 h-4" />
            </button>
            <CustomButton
              variant="contained"
              sx={{ height: "40px" }}
              onClick={goBack}
            >
              Back
            </CustomButton>
          </div>
        </Box>
        <Typography
          variant="h6"
          sx={{
            backgroundColor: "#1d7e33",
            color: "#fff",
            padding: "8px 16px",
          }}
        >
          Shopping List
        </Typography>

        <ShoppingList planId={shoppinId} />
      </Box>

      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { p: 1 },
        }}
      >
        <DialogTitle className="flex justify-between items-center !py-2 !px-3">
          <span className="text-sm font-semibold">Share Shopping List</span>
          <IconButton size="small" onClick={() => setShareDialogOpen(false)}>
            <X className="w-4 h-4" />
          </IconButton>
        </DialogTitle>

        <DialogContent className="!p-3">
          <div className="flex flex-col gap-2">
            <Button
              variant="outlined"
              size="small"
              className="flex items-center justify-start gap-2 text-sm"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert("Link copied!");
              }}
            >
              <Copy className="w-4 h-4" /> Copy Link
            </Button>

            <Button
              variant="outlined"
              size="small"
              className="flex items-center justify-start gap-2 text-sm"
              onClick={() =>
                window.open(
                  `https://wa.me/?text=Check this PDF: ${shareUrl}`,
                  "_blank"
                )
              }
            >
              <WhatsApp className="w-4 h-4 text-green-600" /> WhatsApp
            </Button>

            <Button
              variant="outlined"
              size="small"
              className="flex items-center justify-start gap-2 text-sm"
              onClick={() =>
                window.open(
                  `mailto:?subject=Shopping List&body=${shareUrl}`,
                  "_blank"
                )
              }
            >
              <Mail className="w-4 h-4 text-blue-600" /> Email
            </Button>
          </div>
        </DialogContent>

        <DialogActions className="!px-3 !py-2">
          <Button size="small" onClick={() => setShareDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Page;
