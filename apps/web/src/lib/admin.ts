import { ILoginAdmin, IRegAdmin } from '@/types/admin';
import axios from 'axios';

const link = process.env.NEXT_PUBLIC_API_URL;

export const registerAdmin = async (data: IRegAdmin) => {
  try {
    const res = await axios.post(`${link}admin/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return { result: res.data, ok: true };
  } catch (error: any) {
    return { result: error.response?.data || 'Connection error', ok: false };
  }
};

export const loginAdmin = async (data: ILoginAdmin) => {
  try {
    const res = await axios.post(`${link}/admin/login`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { result: res, ok: true };
  } catch (error: any) {
    return { result: error.response?.data || 'Connection error', ok: false };
  }
};
