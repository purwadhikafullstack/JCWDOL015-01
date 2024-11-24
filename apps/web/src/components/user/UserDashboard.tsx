'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppSelector } from '@/app/store/hooks';
import { setProfile } from '@/app/store/slices/userSlice';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../authContext/Provider';
import { toast } from 'react-toastify';

export default function UserDashboardSchema() {
  const dispatch = useDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const { onChangingProfile, onChangingProfilePicture } = useAuth();

  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);


  if (!profile) {
    return (
      <div className="p-6 text-center text-gray-600">Loading user data...</div>
    );
  }

  const initialValues = {
    name: profile.name || '',
    birthDate: profile.birthDate || '',
    gender: profile.gender || '',
    education: profile.education || '',
    address: profile.address || '',
  };

  const formattedBirthDate = profile.birthDate
    ? new Date(profile.birthDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : 'Not provided';

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    birthDate: Yup.date().required('Birth Date is required'),
    gender: Yup.string().required('Gender is required'),
    education: Yup.string().required('Education is required'),
    address: Yup.string().required('Address is required'),
  });

  const handleSubmit = (values: typeof initialValues) => {
    dispatch(
      setProfile({
        ...profile,
        ...values,
      }),
    );
    onChangingProfile(values);
    setEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleProfilePicChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile); // Store the selected file in state
    }
  };

  const uploadProfilePic = async () => {
    const formData = new FormData();
    if (file) {
      formData.append('profilePicture', file);
    }
    onChangingProfilePicture(formData);

  };

  const renderPersonalInformation = () => (
    <div className="bg-white shadow-md rounded-lg p-6 flex space-x-6">
      {/* Left side: Profile Picture */}
      <div className="flex-shrink-0 w-32 h-32 m-20 bg-gray-200 rounded-full overflow-hidden">
        <Image
          src={profile.profilePicture || '/default-profile.jpg'}
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
                    Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Birth Date
                  </label>
                  <Field
                    type="date"
                    name="birthDate"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="birthDate"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <Field
                    as="select"
                    name="gender"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Education
                  </label>
                  <Field
                    type="text"
                    name="education"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="education"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <Field
                    type="text"
                    name="address"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="address"
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
                  {profile.name || 'Not provided'}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium w-32 text-gray-700">Email:</span>
                <span className="text-gray-500">
                  {profile.email || 'Not provided'}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium w-32 text-gray-700">
                  Birth Date:
                </span>
                <span className="text-gray-500">
                  {formattedBirthDate}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium w-32 text-gray-700">Gender:</span>
                <span className="text-gray-500">
                  {profile.gender || 'Not provided'}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium w-32 text-gray-700">
                  Education:
                </span>
                <span className="text-gray-500">
                  {profile.education || 'Not provided'}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium w-32 text-gray-700">Address:</span>
                <span className="text-gray-500">
                  {profile.address || 'Not provided'}
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
            href={'/user/change-password'}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Change Password
          </Link>
          <Link
            href={'/user/change-email'}
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
                Upload New Profile Picture
              </h3>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleProfilePicChange}
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
                  onClick={uploadProfilePic}
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

  const renderSubscriptions = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Subscriptions</h2>
      {profile.subscriptions && profile.subscriptions.length > 0 ? (
        <ul className="list-disc pl-5">
          {profile.subscriptions.map((sub: any, idx: number) => (
            <li key={idx}>
              {sub.type} - Ends on {sub.endDate}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No subscriptions available.</p>
      )}
    </div>
  );

  const renderApplications = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Applications</h2>
      {profile.applications && profile.applications.length > 0 ? (
        <ul className="list-disc pl-5">
          {profile.applications.map((app: any, idx: number) => (
            <li key={idx}>{app.title}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No applications available.</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen md:w-[1080px] sm:w-max p-6">
      <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center w-full">
        User Dashboard
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
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'subscriptions'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Subscriptions
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'applications'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Applications
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'personal' && renderPersonalInformation()}
      {activeTab === 'subscriptions' && renderSubscriptions()}
      {activeTab === 'applications' && renderApplications()}
    </div>
  );
}
