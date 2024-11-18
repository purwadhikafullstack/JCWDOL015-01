'use client';

import { useAuth } from '@/components/authContext/AuthContext';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { GoogleSignInButton } from './AuthButton';

const LoginSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password needs to be at least 8 characters'),
});

export default function LoginForm() {
  const { onLogin } = useAuth();

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={(values, action) => {
        onLogin(values, action);
      }}
    >
      {() => {
        return (
          <Form>
            <div className=" min-w-[30vw]">
              <div className="mt-10">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Email
                </label>
                <div className="mt-2">
                  <Field
                    name="email"
                    type="text"
                    className="block w-full rounded-md border-0 p-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage
                    name="email"
                    component={'div'}
                    className="text-sm text-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <Field
                    name="password"
                    type="password"
                    className="block w-full rounded-md border-0 p-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage
                    name="password"
                    component={'div'}
                    className="text-sm text-red-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-6 p-1.5 text-sm font-medium rounded-md bg-orange-500 "
              >
                Login
              </button>
              <p>or</p>
              <GoogleSignInButton />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
