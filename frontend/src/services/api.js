import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const createLead = async (leadData) => {
  const response = await axios.post(`${API_BASE_URL}/leads`, leadData);
  return response.data;
};

export const getLeads = async () => {
  const response = await axios.get(`${API_BASE_URL}/leads`);
  return response.data;
};