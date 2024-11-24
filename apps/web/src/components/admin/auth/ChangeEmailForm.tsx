'use client';
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '@/components/authContext/Provider';

// Validation schema for changing email
const ChangeEmailSchema = yup.object().shape({
  oldEmail: yup.string().email('Invalid email address').required('Old email is required'),
  newEmail: yup.string().email('Invalid email address').required('New email is required'),
});

export default function ChangeEmailForm() {
  const { onChangingAdminEmail } = useAuth();

  return (
    <Formik
      initialValues={{ oldEmail: '', newEmail: '' }}
      validationSchema={ChangeEmailSchema}
      onSubmit={(values, action) => {
        onChangingAdminEmail(values);
        action.resetForm();
      }}
    >
      {() => {
        return (
          <Form>
            <div className="min-w-[30vw]">
              <div className="mt-10">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Old Email
                </label>
                <div className="mt-2">
                  <Field
                    name="oldEmail"
                    type="email"
                    className="block w-full rounded-md border-0 p-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage
                    name="oldEmail"
                    component={'div'}
                    className="text-sm text-red-500"
                  />
                </div>
              </div>
              <div className="mt-10">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  New Email
                </label>
                <div className="mt-2">
                  <Field
                    name="newEmail"
                    type="email"
                    className="block w-full rounded-md border-0 p-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage
                    name="newEmail"
                    component={'div'}
                    className="text-sm text-red-500"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full mt-6 p-1.5 text-sm font-medium rounded-md bg-orange-500"
                >
                  Change Email
                </button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
