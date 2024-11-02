'use client';
import { registerUser } from '@/lib/user';
import { IRegister } from '@/types/user';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import * as yup from 'yup';

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
      console.log(error);
      toast.error(error as string);
    }
  };
  return (
    <Formik
      initialValues={{ email: '', password: '',}}
      validationSchema={RegisterSchema}
      onSubmit={(values, action) => {
        onRegister(values, action);
      }}
    >
      {() => {
        return (
          <Form>
            <div className=" min-w-[30vw] m-10">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Register
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Welcome, future workers. Please fill in the form below to register.
              </p>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900 mt-5">
                  Email:
                </label>
                <div className="mb-2">
                  <Field
                    name="email"
                    type="text"
                    className="block w-full rounded-md border-0 p-1.5 text-black dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  Password:
                </label>
                <div className="mb-2">
                  <Field
                    name="password"
                    type="password"
                    className="block w-full rounded-md border-0 p-1.5 text-black dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                Register
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
