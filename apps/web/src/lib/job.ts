import { IFilters } from '@/types/job';
import axios from 'axios';

const link = process.env.NEXT_PUBLIC_API_URL;

export const fetchAllJobs = async () => {
  try {
    const res = await axios.get(`${link}/jobs`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const fetchJobsByGeolocation = async (lat: number, lng: number, radius: number = 10000, limit: number = 10) => {
  try {
    const response = await axios.get(`${link}/jobs/geolocation`, {
      params: { lat, lng, radius, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs by geolocation', error);
    throw error;
  }
};

export const fetchLocations = async () => {
  try {
    const response = await axios.get(`${link}/jobs/locations`);  // This will call your backend API route
    return response.data;  // Returns an array of locations
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw new Error('Failed to fetch locations');
  }
};

// Fetch jobs by filter (based on location, remote option, and tags)
export const fetchJobsByFilter = async (filters: IFilters) => {
  try {
    const { location, remoteOption, tags } = filters;
    const response = await axios.get('/api/jobs', {
      params: { location, remoteOption, tags },
    });
    return response.data;  // Return filtered jobs
  } catch (error) {
    console.error('Error fetching jobs by filter:', error);
    throw new Error('Failed to fetch jobs');
  }
};

export const fetchJobById = async (id: number) => {
  try {
    const res = await axios.get(`${link}jobs/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const createJob = async (data: any) => {
  try {
    const res = await axios.post(`${link}jobs`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const updateJob = async (id: number, data: any) => {
  try {
    const res = await axios.put(`${link}jobs/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const deleteJob = async (id: number) => {
  try {
    const res = await axios.delete(`${link}jobs/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};
