'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppSelector } from '@/app/store/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { setAdminProfile } from '@/app/store/slices/adminSlice';
import { useAuth } from '../authContext/Provider';

export default function AdminDashboardSchema() {
  const dispatch = useDispatch();
  const profile = useAppSelector((state) => state.admin.profile);
  const { onChangingAdminProfile, onChangingCompanyLogo } = useAuth();

  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);


  if (!profile) {
    return (
      <div className="p-6 text-center text-gray-600">Loading admin data...</div>
    );
  }

  const initialValues = {
    companyName: profile.companyName || '',
    companyDescription: profile.companyDescription || '',
    phoneNumber: profile.phoneNumber || '',

  };


  const validationSchema = Yup.object({
    companyName: Yup.string().required('Company Name is required'),
    companyDescription: Yup.string().required('Company Description is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
  });

  const handleSubmit = (values: typeof initialValues) => {
    dispatch(
      setAdminProfile({
        ...profile,
        ...values,
      }),
    );
    onChangingAdminProfile(values);
    setEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCompanyLogoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
    }
  };

  const uploadCompanyLogo = async () => {
    const formData = new FormData();
    if (file) {
      formData.append('companyLogo', file);
    }
    onChangingCompanyLogo(formData);

  };

  const renderPersonalInformation = () => (
    <div className="bg-white shadow-md rounded-lg p-6 flex space-x-6">
      {/* Left side: Profile Picture */}
      <div className="flex-shrink-0 w-32 h-32 m-20 bg-gray-200 rounded-full overflow-hidden">
        <Image
          src={profile.companyLogo || '/default-profile.jpg'}
          alt="Profile Picture"
          width={128}
          height={128}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side: Personal Information */}
      <div className="flex-1 space-y-4">
        {editing ? (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <Field
                    type="text"
                    name="companyName"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="companyName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Description
                  </label>
                  <Field
                    type="text"
                    name="companyDescription"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="companyDescription"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <Field
                    type="text"
                    name="phoneNumber"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="font-medium w-32 text-gray-700">Name:</span>
                <span className="text-gray-500">
                  {profile.companyName || 'Not provided'}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium w-32 text-gray-700">Email:</span>
                <span className="text-gray-500">
                  {profile.email || 'Not provided'}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium w-32 text-gray-700">Company Description:</span>
                <span className="text-gray-500">
                  {profile.companyDescription || 'Not provided'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 mt-4"
            >
              Edit Information
            </button>
          </div>
        )}

        <div className="space-x-4 mt-4">
          <Link
            href={'/admin/change-password'}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Change Password
          </Link>
          <Link
            href={'/admin/change-email'}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Change Email
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Change Profile Picture
          </button>
        </div>

        {/* Profile Picture Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
              <h3 className="text-lg font-semibold mb-4">
                Upload Company Logo
              </h3>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleCompanyLogoChange}
                className="mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={uploadCompanyLogo}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderJob = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">job</h2>
      {profile.job && profile.job.length > 0 ? (
        <ul className="list-disc pl-5">
          {profile.job.map((sub: any, idx: number) => (
            <li key={idx}>
              {sub.type} - Ends on {sub.endDate}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No job available.</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen md:w-[1080px] sm:w-max p-6">
      <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center w-full">
        Admin Dashboard
      </h1>
      <div className="flex md:justify-center sm:justify-normal space-x-10 mb-6">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'personal'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Company Information
        </button>
        <button
          onClick={() => setActiveTab('job')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'job'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Jobs
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'personal' && renderPersonalInformation()}
      {activeTab === 'job' && renderJob()}
    </div>
  );
}
