import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";

const invoices = [
  { number: "#401844", amount: 69, date: "04/01/2025" },
  { number: "#399214", amount: 69, date: "03/01/2025" },
  { number: "#396236", amount: 69, date: "02/01/2025" },
  { number: "#395621", amount: 69, date: "02/01/2025" },
  { number: "#393419", amount: 69, date: "01/01/2025" },
];

const InvoiceSection = () => {
  const [open, setOpen] = useState(false);

  const handleDownload = (invoice) => {
    const doc = new jsPDF();
  
    // Add Title
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 105, 20, null, null, "center");
  
    // Draw a border box for invoice details
    doc.setLineWidth(0.5);
    doc.rect(20, 30, 170, 80); // x, y, width, height
  
    // Invoice Number
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice Number: ${invoice.number}`, 30, 50);
  
    // Amount
    doc.text(`Amount: $${invoice.amount}`, 30, 70);
  
    // Date
    doc.text(`Date: ${invoice.date}`, 30, 90);
  
    // Footer
    doc.setFontSize(12);
    doc.setTextColor(150);
    doc.text("Thank you for your business!", 105, 130, null, null, "center");
  
    // Save PDF
    doc.save(`Invoice-${invoice.number}.pdf`);
  };

  return (
    <Box p={2}>
      <Typography variant="h6">
        Next Invoice: <strong>$69</strong> on <strong>05/01/2025</strong>
      </Typography>

      <Box mt={3} border={"1px solid black"} borderRadius={"10px"} p={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">INVOICE HISTORY</Typography>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List>
            {invoices.map((invoice, index) => (
              <React.Fragment key={index}>
                <ListItem
                  secondaryAction={
                    <IconButton onClick={() => handleDownload(invoice)}>
                      <DownloadIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`Invoice ${invoice.number} for $${invoice.amount} on ${invoice.date}`}
                  />
                </ListItem>
                {index < invoices.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Collapse>
      </Box>
    </Box>
  );
};

export default InvoiceSection;
