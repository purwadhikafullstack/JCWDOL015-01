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
import {
  createAdminToken,
  createToken,
  deleteAdminToken,
  deleteToken,
} from '@/lib/token';
import {
  clearAdminProfile,
  setAdminProfile,
} from '@/app/store/slices/adminSlice';

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
  const onLogin = async (data: ILogin, action: FormikHelpers<ILogin>) => {
    try {
      const { result, ok } = await loginUser(data);
      if (result?.user?.isBlocked === true) {
        toast.error('Your account is blocked');
        router.push('/user/blocked');
        return;
      }

      if (result?.user?.isVerified === false) {
        router.push('/');
        dispatch(setProfile(result.user));
        console.log(result.user);
        return;
      }

      if (ok && result.token) {
        toast.success('Login successful');
        dispatch(setProfile(result.user));
        createToken(result.token);
        setToken(result.token);
        action.resetForm();
        router.back();
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error('Login failed, please try again');
    }
  };

  const onVerified = async () => {
    try {
      const { result } = await isVerified();
      if (result.data.isVerified === true) {
        return setVerified(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onLogout = async () => {
    await deleteToken();
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
    try {
      const { result, ok } = await checkEmail(data);
      if (ok) {
        toast.success(
          'An Email has been sent to you. Please check and complete the process.',
        );
        action.resetForm();
        router.push('/user/login');
        return;
      }
      toast.error(result.message);
    } catch (error) {
      console.log(error);
    }
  };

  const onResetPassword = async (
    data: IReset,
    action: FormikHelpers<IReset>,
  ) => {
    try {
      const resetToken = Array.isArray(params?.token)
        ? params.token[0]
        : params?.token;
      const { result, ok } = await resetPassword(data, resetToken);
      if (ok) {
        toast.success(
          'Reset password successful. Please login with your new password.',
        );
        action.resetForm();
        router.push('/');
        return;
      }
      toast.error(result.message);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangingProfile = async (data: IChangeProfile) => {
    try {
      const { result, ok } = await changeProfile(data, token);

      if (ok) {
        toast.success('Profile updated');
        dispatch(setProfile(result.updatedUser));
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangingEmail = async (data: IChangeEmail) => {
    try {
      const { result, ok } = await changeEmail(data, token);
      if (ok) {
        toast.success('Email updated');
        dispatch(clearProfile());
        setToken('');
        router.push('/');
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangingPassword = async (
    data: IChangePassword,
    action: FormikHelpers<IChangePassword>,
  ) => {
    try {
      const { result, ok } = await changePassword(data, token);
      if (ok) {
        toast.success('Password updated');
        action.resetForm();
        setToken('');
        dispatch(clearProfile());
        router.push('/');
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangingProfilePicture = async (formData: FormData) => {
    try {
      const { result, ok } = await changeProfilePicture(formData, token);
      if (ok) {
        toast.success('Profile picture updated');
        dispatch(setProfile(result.updatedUser));
        router.push('/');
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSavingLocation = async (data: ILocation) => {
    try {
      const { result, ok } = await saveLocation(data, token);
      if (ok) {
        toast.success('Location saved');
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onAdminLogin = async (
    data: ILoginAdmin,
    action: FormikHelpers<ILoginAdmin>,
  ) => {
    try {
      const { result, ok } = await loginAdmin(data);
      if (result?.admin?.isBlocked === true) {
        toast.error('Your account is blocked');
        router.push('/admin/blocked');
        return;
      }

      if (ok && result.token) {
        toast.success('Login successful');
        dispatch(setAdminProfile(result.admin));
        createAdminToken(result.token);
        setAdminToken(result.token);
        action.resetForm();
        router.back();
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error('Login failed, please try again');
    }
  };

  const onAdminLogout = async () => {
    await deleteAdminToken();
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
    try {
      const { result, ok } = await checkAdminEmail(data);
      if (ok) {
        toast.success(
          'An Email has been sent to you. Please check and complete the process.',
        );
        action.resetForm();
        router.push('/admin/login');
        return;
      }
      toast.error(result.message);
    } catch (error) {
      console.log(error);
    }
  };

  const onResetAdminPassword = async (
    data: IResetAdmin,
    action: FormikHelpers<IResetAdmin>,
  ) => {
    try {
      const resetToken = Array.isArray(params?.token)
        ? params.token[0]
        : params?.token;
      const { result, ok } = await resetAdminPassword(data, resetToken);
      if (ok) {
        toast.success(
          'Reset password successful. Please login with your new password.',
        );
        action.resetForm();
        router.push('/');
        return;
      }
      toast.error(result.message);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangingAdminProfile = async (data: IChangeAdminProfile) => {
    try {
      const { result, ok } = await changeAdminProfile(data, adminToken);

      if (ok) {
        toast.success('Profile updated');
        dispatch(setAdminProfile(result.updatedadmin));
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangingAdminEmail = async (data: IChangeAdminEmail) => {
    try {
      const { result, ok } = await changeAdminEmail(data, adminToken);
      if (ok) {
        toast.success('Email updated');
        dispatch(clearAdminProfile());
        setAdminToken('');
        router.push('/');
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangingAdminPassword = async (
    data: IChangeAdminPassword,
    action: FormikHelpers<IChangeAdminPassword>,
  ) => {
    try {
      const { result, ok } = await changeAdminPassword(data, adminToken);
      if (ok) {
        toast.success('Password updated');
        action.resetForm();
        setAdminToken('');
        dispatch(clearAdminProfile());
        router.push('/');
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangingCompanyLogo = async (formData: FormData) => {
    try {
      const { result, ok } = await changeCompanyLogo(formData, adminToken);
      if (ok) {
        toast.success('Company Logo updated');
        dispatch(setAdminProfile(result.updatedAdmin));
        router.push('/admin');
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        onLogin,
        onVerified,
        verified,
        onLogout,
        onCheckEmail,
        onResetPassword,
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
