'use client';
import { clearProfile } from '@/app/store/slices/userSlice';
import Wrapper from '@/components/wrapper';
import { deleteCookie } from '@/lib/cookie';
import { verifyUser } from '@/lib/user';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export default function Verify() {
  const params = useParams();
  const token = Array.isArray(params?.token) ? params.token[0] : params?.token;
  const router = useRouter();
  const dispatch = useDispatch();

  const onVerify = async () => {
    if (!token) return;

    const { result, ok } = await verifyUser(token);
    if (ok) {
      toast.success('Verification successful');
      toast.success('Please login to continue');
      await deleteCookie('token');
      await deleteCookie('userLocation');
      dispatch(clearProfile());
      router.push('/');
    }
  };

  useEffect(() => {
    onVerify();
  });
  return (
    <Wrapper>
      <div className="my-20 font-extrabold text-5xl">
        Verification in progress...
      </div>
    </Wrapper>
  );
}
