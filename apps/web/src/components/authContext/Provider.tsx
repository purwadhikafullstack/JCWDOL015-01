'use client';
import {
  changeEmail,
  changePassword,
  changeProfile,
  changeProfilePicture,
  checkEmail,
  isVerified,
  loginUser,
  resetPassword,
  saveLocation,
} from '@/lib/user';
import {
  changeCompanyLogo,
  changeAdminEmail,
  changeAdminPassword,
  changeAdminProfile,
  checkAdminEmail,
  loginAdmin,
  resetAdminPassword,
} from '@/lib/admin';
import {
  IChangeEmail,
  IChangePassword,
  IChangeProfile,
  ICheckEmail,
  ILocation,
  ILogin,
  IReset,
} from '@/types/user';
import {
  IChangeAdminEmail,
  IChangeAdminPassword,
  IChangeAdminProfile,
  ICheckAdminEmail,
  ILoginAdmin,
  IResetAdmin,
} from '@/types/admin';
import { FormikHelpers } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { createContext, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { clearProfile, setProfile } from '@/app/store/slices/userSlice';
import { createCookie, deleteCookie } from '@/lib/cookie';
import {
  clearAdminProfile,
  setAdminProfile,
} from '@/app/store/slices/adminSlice';
import { useAppSelector } from '@/app/store/hooks';
import { ok } from 'assert';

interface AuthContextType {
  token: string | null;
  onLogin: (data: ILogin, action: FormikHelpers<ILogin>) => void;
  onLogout: () => void;
  onCheckEmail: (data: ICheckEmail, action: FormikHelpers<ICheckEmail>) => void;
  onResetPassword: (data: IReset, action: FormikHelpers<IReset>) => void;
  onVerified: () => void;
  verified: boolean | null;
  onChangingProfile: (data: IChangeProfile) => void;
  onChangingEmail: (data: IChangeEmail) => void;
  onChangingPassword: (
    data: IChangePassword,
    action: FormikHelpers<IChangePassword>,
  ) => void;
  onChangingProfilePicture: (formData: FormData) => void;
  onSavingLocation: (data: ILocation) => void;

  adminToken: string | null;
  onAdminLogin: (data: ILoginAdmin, action: FormikHelpers<ILoginAdmin>) => void;
  onAdminLogout: () => void;
  onCheckAdminEmail: (
    data: ICheckAdminEmail,
    action: FormikHelpers<ICheckAdminEmail>,
  ) => void;
  onResetAdminPassword: (
    data: IResetAdmin,
    action: FormikHelpers<IResetAdmin>,
  ) => void;
  onChangingAdminProfile: (data: IChangeAdminProfile) => void;
  onChangingAdminEmail: (data: IChangeAdminEmail) => void;
  onChangingAdminPassword: (
    data: IChangeAdminPassword,
    action: FormikHelpers<IChangeAdminPassword>,
  ) => void;
  onChangingCompanyLogo: (formData: FormData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [verified, setVerified] = useState<boolean | null>(null);
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const profile = useAppSelector((state) => state.user.profile);

  const onLogin = async (data: ILogin, action: FormikHelpers<ILogin>) => {
    const { result, ok } = await loginUser(data);
    if (result?.isBlocked) {
      toast.error(result.message);
      router.push('/user/blocked');
      return;
    }

    if (result?.user?.isVerified === false) {
      dispatch(setProfile(result.user));
      createCookie('token', result.token);
      setToken(result.token);
      toast.success(result.message);
      router.push('/');
      return;
    }

    if (ok && result.token) {
      dispatch(setProfile(result.user));
      createCookie('token', result.token);
      setToken(result.token);
      toast.success(result.message);
      action.resetForm();
      router.back();
      return;
    }
    toast.error(result.message);
  };

  const onVerified = async () => {
    if (!profile) {
      toast.error('Please login to apply or save jobs');
      return router.push('/user/login');
    }
    const { result, ok } = await isVerified(profile?.email);
    if (!result && !ok) {
      setVerified(false);
      toast.error('Verification failed');
      return;
    } else if (ok && result.user.isVerified) {
      setVerified(true);
      
      return;
    }
  };

  const onLogout = async () => {
    await deleteCookie('token');
    await deleteCookie('userLocation');
    setToken('');
    dispatch(clearProfile());
    toast.success('Logout successful');
    router.push('/');
    router.refresh();
  };

  const onCheckEmail = async (
    data: ICheckEmail,
    action: FormikHelpers<ICheckEmail>,
  ) => {
    const { result, ok } = await checkEmail(data);
    if (ok) {
      toast.success(result.message);
      action.resetForm();
      router.push('/user/login');
      return;
    }
    toast.error(result.message);
  };

  const onResetPassword = async (
    data: IReset,
    action: FormikHelpers<IReset>,
  ) => {
    const resetToken = Array.isArray(params?.token)
      ? params.token[0]
      : params?.token;
    const { result, ok } = await resetPassword(data, resetToken);
    if (ok) {
      toast.success(result.message);
      action.resetForm();
      router.push('/');
      return;
    }
    toast.error(result.message);
  };

  const onChangingProfile = async (data: IChangeProfile) => {
    const { result, ok } = await changeProfile(data, token);
    if (ok) {
      toast.success(result.message);
      dispatch(setProfile(result.updatedUser));
      return;
    }
    toast.error(result.message);
  };

  const onChangingEmail = async (data: IChangeEmail) => {
    const { result, ok } = await changeEmail(data, token);
    if (ok) {
      toast.success(result.message);
      dispatch(clearProfile());
      setToken('');
      router.push('/');
      return;
    }
    toast.error(result.message);
  };

  const onChangingPassword = async (
    data: IChangePassword,
    action: FormikHelpers<IChangePassword>,
  ) => {
    const { result, ok } = await changePassword(data, token);
    if (ok) {
      toast.success(result.message);
      action.resetForm();
      setToken('');
      dispatch(clearProfile());
      router.push('/');
      return;
    }
    toast.error(result.message);
  };

  const onChangingProfilePicture = async (formData: FormData) => {
    const { result, ok } = await changeProfilePicture(formData, token);
    if (ok) {
      toast.success(result.message);
      dispatch(setProfile(result.updatedUser));
      router.push('/');
      return;
    }
    toast.error(result.message);
  };

  const onSavingLocation = async (data: ILocation) => {
    const { result, ok } = await saveLocation(data, token);
    if (ok) {
      toast.success(result.message);
      return;
    }
    toast.error(result.message);
  };

  const onAdminLogin = async (
    data: ILoginAdmin,
    action: FormikHelpers<ILoginAdmin>,
  ) => {
    const { result, ok } = await loginAdmin(data);
    if (result?.admin?.isBlocked === true) {
      toast.error(result.message);
      router.push('/admin/blocked');
      return;
    }

    if (ok && result.token) {
      toast.success(result.message);
      dispatch(setAdminProfile(result.admin));
      createCookie('adminToken', result.token);
      setAdminToken(result.token);
      action.resetForm();
      router.back();
      return;
    }
    toast.error(result.message);
  };

  const onAdminLogout = async () => {
    await deleteCookie('adminToken');
    setAdminToken('');
    dispatch(clearAdminProfile());
    toast.success('Logout successful');
    router.push('/');
    router.refresh();
  };

  const onCheckAdminEmail = async (
    data: ICheckAdminEmail,
    action: FormikHelpers<ICheckAdminEmail>,
  ) => {
    const { result, ok } = await checkAdminEmail(data);
    if (ok) {
      toast.success(result.message);
      action.resetForm();
      router.push('/admin/login');
      return;
    }
    toast.error(result.message);
  };

  const onResetAdminPassword = async (
    data: IResetAdmin,
    action: FormikHelpers<IResetAdmin>,
  ) => {
    const resetToken = Array.isArray(params?.token)
      ? params.token[0]
      : params?.token;
    const { result, ok } = await resetAdminPassword(data, resetToken);
    if (ok) {
      toast.success(result.message);
      action.resetForm();
      router.push('/');
      return;
    }
    toast.error(result.message);
  };

  const onChangingAdminProfile = async (data: IChangeAdminProfile) => {
    const { result, ok } = await changeAdminProfile(data, adminToken);
    if (ok) {
      toast.success(result.message);
      dispatch(setAdminProfile(result.updatedAdmin));
      return;
    }
    toast.error(result.message);
  };

  const onChangingAdminEmail = async (data: IChangeAdminEmail) => {
    const { result, ok } = await changeAdminEmail(data, adminToken);
    if (ok) {
      toast.success(result.message);
      dispatch(clearAdminProfile());
      setAdminToken('');
      router.push('/');
      return;
    }
    toast.error(result.message);
  };

  const onChangingAdminPassword = async (
    data: IChangeAdminPassword,
    action: FormikHelpers<IChangeAdminPassword>,
  ) => {
    const { result, ok } = await changeAdminPassword(data, adminToken);
    if (ok) {
      toast.success(result.message);
      action.resetForm();
      setAdminToken('');
      dispatch(clearAdminProfile());
      router.push('/');
      return;
    }
    toast.error(result.message);
  };

  const onChangingCompanyLogo = async (formData: FormData) => {
    const { result, ok } = await changeCompanyLogo(formData, adminToken);
    if (ok) {
      toast.success(result.message);
      dispatch(setAdminProfile(result.updatedAdmin));
      router.push('/');
      return;
    }
    toast.error(result.message);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        onLogin,
        onLogout,
        onCheckEmail,
        onResetPassword,
        onVerified,
        verified,
        onChangingProfile,
        onChangingEmail,
        onChangingPassword,
        onChangingProfilePicture,
        onSavingLocation,

        adminToken,
        onAdminLogin,
        onAdminLogout,
        onCheckAdminEmail,
        onResetAdminPassword,
        onChangingAdminProfile,
        onChangingAdminEmail,
        onChangingAdminPassword,
        onChangingCompanyLogo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
