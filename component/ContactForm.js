import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

export default function ContactUsModal({ open, setOpen }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setOpen(false);
      } else {
        alert("❌ Failed to send. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Contact Us</DialogTitle>
      <DialogContent dividers sx={{ p: 2 }}>
        <Typography variant="body2" mb={2}>
          For plans supporting more than <b>60 customers</b>, please fill out
          the form below and our team will get back to you.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            size="small"
          />
          <TextField
            label="Your Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            fullWidth
            required
            size="small"
          />
          <TextField
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            fullWidth
            required
            multiline
            rows={4}
            size="small"
          />

          <DialogActions sx={{ px: 0 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
