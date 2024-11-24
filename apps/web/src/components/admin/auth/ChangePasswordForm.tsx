'use client';
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '@/components/authContext/Provider';

const ChangePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required('Password is required'),
  newPassword: yup.string().required('New password is required'),
  confirmNewPassword: yup.string().required('Confirm password is required'),
});

export default function ChangePasswordForm() {
  const { onChangingAdminPassword } = useAuth();
  return (
    <Formik
      initialValues={{ oldPassword: '', newPassword: '', confirmNewPassword: '' }}
      validationSchema={ChangePasswordSchema}
      onSubmit={(values, action) => {
        onChangingAdminPassword(values, action);
      }}
    >
      {() => {
        return (
          <Form>
            <div className="min-w-[30vw]">
              <div className="mt-10">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Old Password
                </label>
                <div className="mt-2">
                  <Field
                    name="oldPassword"
                    type="password"
                    className="block w-full rounded-md border-0 p-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage
                    name="oldPassword"
                    component={'div'}
                    className="text-sm text-red-500"
                  />
                </div>
              </div>
              <div className="mt-10">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  New Password
                </label>
                <div className="mt-2">
                  <Field
                    name="newPassword"
                    type="password"
                    className="block w-full rounded-md border-0 p-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component={'div'}
                    className="text-sm text-red-500"
                  />
                </div>
              </div>
              <div className="mt-10">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Confirm Password
                </label>
                <div className="mt-2">
                  <Field
                    name="confirmNewPassword"
                    type="password"
                    className="block w-full rounded-md border-0 p-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage
                    name="confirmNewPassword"
                    component={'div'}
                    className="text-sm text-red-500"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full mt-6 p-1.5 text-sm font-medium rounded-md bg-orange-500 "
                >
                  Change Password
                </button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
