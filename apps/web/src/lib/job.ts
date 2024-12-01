import axios from 'axios';

const link = process.env.NEXT_PUBLIC_API_URL;

export const getJobs = async () => {
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

export const jobApplication = async (userId: number, jobId: string) => {
  try {
    const res = await axios.post(`${link}/jobs/${jobId}/apply`, {
      headers: {
        'Content-Type': 'application/json',
      },
      userId,
      jobId,
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const displayJob = async (jobId: number) => {
  try {
    const res = await axios.get(`${link}/jobs/${jobId}/application`, {
      headers: {
        'Content-Type': 'application/json',
      },
      
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
}


