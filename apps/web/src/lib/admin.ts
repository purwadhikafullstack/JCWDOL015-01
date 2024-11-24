import { IChangeAdminEmail, IChangeAdminPassword, IChangeAdminProfile, ICheckAdminEmail, ILoginAdmin, IRegAdmin, IResetAdmin } from '@/types/admin';
import axios from 'axios';

const link = process.env.NEXT_PUBLIC_API_URL;

export const registerAdmin = async (data: IRegAdmin) => {
  try {
    const res = await axios.post(`${link}/admin/`, data, {
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
    return { result: res.data, ok: true };
  } catch (error: any) {
    return { result: error.response?.data || 'Connection error', ok: false };
  }
};

export const checkAdminEmail = async (data: ICheckAdminEmail) => {
  try {
    const res = await axios.post(
      `${link}/admin/check-email`,
      {
        email: data.email, // Directly pass the email
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const resetAdminPassword = async (data: IResetAdmin, token: string) => {
  try {
    const res = await axios.post(`${link}/admin/reset-password`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const changeAdminProfile = async (data: IChangeAdminProfile, token: string) => {
  try {
    const res = await axios.post(`${link}/admin/update-profile`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const changeAdminPassword = async (data: IChangeAdminPassword, token: string) => {
  try {
    const res = await axios.post(`${link}/admin/change-password`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const changeAdminEmail = async (data: IChangeAdminEmail, token: string) => {
  try {
    const res = await axios.post(`${link}/admin/change-email`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const changeCompanyLogo = async (
  formData: FormData,
  token: string,
) => {
  try {
  
    const res = await axios.post(`${link}/admin/change-company-logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure correct content type for file uploads
        Authorization: `Bearer ${token}`,
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};