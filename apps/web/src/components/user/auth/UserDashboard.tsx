// File: pages/user-dashboard.tsx
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppSelector } from "@/app/store/hooks";
import { setProfile } from "@/app/store/slices/userSlice";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const profile = useAppSelector((state) => state.user.profile);

  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal"); // Tabs: 'personal', 'subscriptions', 'applications'

  if (!profile) {
    return <div className="p-6 text-center text-gray-600">Loading user data...</div>;
  }

  const initialValues = {
    name: profile.name || "",
    birthDate: profile.birthDate || "",
    gender: profile.gender || "",
    education: profile.education || "",
    address: profile.address || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    birthDate: Yup.date().required("Birth Date is required"),
    gender: Yup.string().required("Gender is required"),
    education: Yup.string().required("Education is required"),
    address: Yup.string().required("Address is required"),
  });

  const handleSubmit = (values: typeof initialValues) => {
    dispatch(
      setProfile({
        ...profile,
        ...values,
      })
    );
    setEditing(false); // Switch back to display mode
    alert("Profile updated successfully!");
  };

  // Tab Content Render Functions
  const renderPersonalInformation = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      {editing ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <Field
                  type="text"
                  name="name"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                <Field
                  type="date"
                  name="birthDate"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="birthDate" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <Field
                  as="select"
                  name="gender"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Field>
                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Education</label>
                <Field
                  type="text"
                  name="education"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="education" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <Field
                  type="text"
                  name="address"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
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
          <div>
            <p>
              <span className="font-medium">Name:</span> {profile.name || "Not provided"}
            </p>
            <p>
              <span className="font-medium">Birth Date:</span>{" "}
              {profile.birthDate || "Not provided"}
            </p>
            <p>
              <span className="font-medium">Gender:</span> {profile.gender || "Not provided"}
            </p>
            <p>
              <span className="font-medium">Education:</span>{" "}
              {profile.education || "Not provided"}
            </p>
            <p>
              <span className="font-medium">Address:</span> {profile.address || "Not provided"}
            </p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
          >
            Edit Information
          </button>
        </div>
      )}
    </div>
  );

  const renderSubscriptions = () => (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Subscriptions</h2>
      {profile.subscriptions && profile.subscriptions.length > 0 ? (
        <ul className="list-disc pl-5">
          {profile.subscriptions.map((sub: any, idx: number) => (
            <li key={idx}>{sub.type} - Ends on {sub.endDate}</li>
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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">User Dashboard</h1>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("personal")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "personal"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "subscriptions"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Subscriptions
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "applications"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Applications
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "personal" && renderPersonalInformation()}
      {activeTab === "subscriptions" && renderSubscriptions()}
      {activeTab === "applications" && renderApplications()}
    </div>
  );
}
