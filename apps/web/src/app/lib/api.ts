import axios from 'axios';

export const getApplicantTestResults = async () => {
  const response = await axios.get('/api/applicants/test-results');
  return response.data;
};


const API_URL = '/api/interview-schedules';

export const createInterviewSchedule = async (data: {
  application_id: number;
  date_time: string;
  location: string;
  status: string;
}) => {
  return axios.post(API_URL, data);
};

export const getInterviewSchedules = async () => {
  return axios.get(API_URL);
};

export const updateInterviewSchedule = async (id: number, data: Partial<{
  date_time: string;
  location: string;
  status: string;
}>) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const deleteInterviewSchedule = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};
