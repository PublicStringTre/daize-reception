import { useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { createLead, getLeads } from "../services/api";

const services = [
  "Emergency service",
  "Repair",
  "Installation",
  "Inspection",
  "Consultation",
  "Other",
];

export default function IntakePage() {
  const [formData, setFormData] = useState({
    business_id: "demo-plumbing",
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    service_requested: "",
    message: "",
    location: "",
    urgency: "",
  });

  const [loading, setLoading] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSubmittedLead(null);

    try {
      const lead = await createLead(formData);
      setSubmittedLead(lead);

      setFormData({
        business_id: "demo-plumbing",
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        service_requested: "",
        message: "",
        location: "",
        urgency: "",
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f7f8fb", py: 6 }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: "#1f2937" }}>
            Daize<span style={{ color: "#9b6a3c" }}>.</span>{" "}
            <span style={{ color: "#4aa3df" }}>AI</span>
          </Typography>

          <Typography variant="h6" sx={{ mt: 1, color: "#4b5563" }}>
            Tell us what you need help with.
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
          {submittedLead && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Request received. Priority:{" "}
              <strong>{submittedLead.priority}</strong>. Recommended action:{" "}
              {submittedLead.recommended_action}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              label="Your name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              required
              label="Phone number"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Email address"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              required
              select
              label="Service needed"
              name="service_requested"
              value={formData.service_requested}
              onChange={handleChange}
              margin="normal"
            >
              {services.map((service) => (
                <MenuItem key={service} value={service}>
                  {service}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              margin="normal"
              placeholder="Example: Emergency, today, this week"
            />

            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              margin="normal"
              placeholder="Example: Orlando, FL"
            />

            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Describe the issue"
              name="message"
              value={formData.message}
              onChange={handleChange}
              margin="normal"
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.4,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
                backgroundColor: "#1f2937",
                "&:hover": {
                  backgroundColor: "#111827",
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Submit Request"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}