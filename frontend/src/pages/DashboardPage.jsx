import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { createLead, getLeads } from "../services/api";

function getPriorityColor(priority) {
  if (priority === "High") return "error";
  if (priority === "Medium") return "warning";
  return "default";
}

export default function DashboardPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeads = async () => {
    try {
      setError("");
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      console.error(err);
      setError("Could not load leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const totalLeads = leads.length;
  const highPriorityLeads = leads.filter((lead) => lead.priority === "High").length;
  const newLeads = leads.filter((lead) => lead.status === "New").length;

  return (
    <Box sx={{ minHeight: "100vh", background: "#f7f8fb", py: 5 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1f2937" }}>
            Daize Command
          </Typography>
          <Typography sx={{ color: "#6b7280", mt: 0.5 }}>
            Lead dashboard for Daize Reception
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography sx={{ color: "#6b7280" }}>Total Leads</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {totalLeads}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography sx={{ color: "#6b7280" }}>New Leads</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {newLeads}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography sx={{ color: "#6b7280" }}>High Priority</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {highPriorityLeads}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Incoming Leads
          </Typography>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {!loading && leads.length === 0 && (
            <Alert severity="info">No leads yet. Submit a test lead from the intake page.</Alert>
          )}

          <Stack spacing={2}>
            {leads.map((lead) => (
              <Card key={lead.id} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {lead.customer_name}
                      </Typography>

                      <Typography sx={{ color: "#6b7280" }}>
                        {lead.service_requested} • {lead.location || "No location"}
                      </Typography>

                      <Typography sx={{ mt: 1 }}>
                        {lead.message}
                      </Typography>

                      <Typography sx={{ mt: 1, color: "#374151" }}>
                        <strong>AI Summary:</strong> {lead.summary}
                      </Typography>

                      <Typography sx={{ mt: 1, color: "#374151" }}>
                        <strong>Recommended Action:</strong> {lead.recommended_action}
                      </Typography>
                    </Box>

                    <Stack spacing={1} alignItems={{ xs: "flex-start", sm: "flex-end" }}>
                      <Chip
                        label={lead.priority}
                        color={getPriorityColor(lead.priority)}
                        sx={{ fontWeight: 700 }}
                      />
                      <Chip label={lead.status} variant="outlined" />
                      <Typography sx={{ fontWeight: 700 }}>
                        ${lead.estimated_value_min} - ${lead.estimated_value_max}
                      </Typography>
                      <Typography sx={{ color: "#6b7280" }}>
                        Score: {lead.lead_score}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}