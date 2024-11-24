'use client';
import { registerUser } from '@/lib/user';
import { IRegister } from '@/types/user';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { GoogleSignInButton } from './AuthButton';

const RegisterSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email Required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password Required'),
});

export default function RegisterForm() {
  const router = useRouter();

  const onRegister = async (
    data: IRegister,
    action: FormikHelpers<IRegister>,
  ) => {
    try {
      const { result, ok } = await registerUser(data);
      if (!ok) throw result.msg;
      toast.success('Registration successful');
      action.resetForm();
      router.back();
    } catch (error: any) {
      action.resetForm();
      console.error(error);
      toast.error(error as string);
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={RegisterSchema}
      onSubmit={(values, action) => {
        onRegister(values, action);
      }}
    >
      {() => {
        return (
          <Form>
            <div className="min-w-[90%] sm:min-w-[50%] lg:min-w-[30%] mx-auto my-32 p-5 bg-white shadow-md rounded-lg">
              <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center">
                Register
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600 text-center">
                Welcome, future workers! Please fill in the form below to
                register.
              </p>
              <div className="mt-5">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Email:
                </label>
                <Field
                  name="email"
                  type="email"
                  className="block w-full rounded-lg border-2 border-gray-300 p-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Password:
                </label>
                <Field
                  name="password"
                  type="password"
                  className="block w-full rounded-lg border-2 border-gray-300 p-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center items-center font-semibold h-14 px-6 mt-6 text-xl text-white transition-all duration-300 bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Register
              </button>
              <div className="flex items-center my-6 min-w-[480px]">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-4 text-sm text-gray-600">or</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>
              <GoogleSignInButton />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
