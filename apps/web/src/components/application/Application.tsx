'use client';

import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/store/hooks';
import { IJob } from '@/types/job';
import { displayJob } from '@/lib/job';
import Image from 'next/image';
import { submission } from '@/lib/application';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  cv: Yup.mixed()
    .required('CV is required')
    .test('fileFormat', 'Only PDF and DOCX files are allowed', (value) => {
      return (
        value &&
        ((value as File).type === 'application/pdf' ||
          (value as File).type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      );
    })
    .test('fileSize', 'File is too large, max size is 5MB', (value) => {
      return value && (value as File).size <= 5 * 1024 * 1024;
    }),
  salary: Yup.number()
    .required('Salary expectation is required')
    .positive('Salary must be a positive number'),
});

const ApplyJobForm = () => {
  const [job, setJob] = useState<IJob | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  const profile = useAppSelector((state) => state.user.profile);

  useEffect(() => {
    if (jobId) {
      (async () => {
        setLoading(true);
        const { result, ok } = await displayJob(Number(jobId));
        if (ok) setJob(result.job);
        setLoading(false);
      })();
    }
  }, [jobId]);

  const sendingData = async (values: { salary: number; cv: File | null }) => {
    if (!file || !profile || !job) {
      toast.error('You need to log in to apply for this job');
      return;
    }

    const formData = new FormData();
    formData.append('userId', profile.id.toString());
    formData.append('jobId', job.id.toString());
    formData.append('resume', file);
    formData.append('expectedSalary', values.salary.toString());

    const { result, ok } = await submission(formData);
    if (ok) {
      toast.success(result.message);
      return;
    }
    toast.error(result.message);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-red-500">
        Job not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 my-36">
      <div className="flex justify-between items-start mb-6 gap-4">
        {/*Job Details Section*/}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">{job.title}</h1>
          <p className="text-gray-600 text-lg mb-2">
            <span className="font-semibold">Description:</span>{' '}
            {job.description}
          </p>
          <p className="text-gray-600 text-lg mb-2">
            <span className="font-semibold">Location:</span> {job.location}{' '}
            {job.remoteOption ? '(Remote)' : ''}
          </p>
          <p className="text-gray-600 text-lg mb-2">
            <span className="font-semibold">Salary:</span>{' '}
            {job.salary ? `$${job.salary}` : 'Not specified'}
          </p>
          <p className="text-gray-600 text-lg">
            <span className="font-semibold">Tags:</span> {job.tags || 'None'}
          </p>
        </div>

        {/* Company Details Section */}
        <div className="flex-shrink-0 text-center ml-6">
          <Image
            src={job.admin.companyLogo || '/default-logo.png'}
            alt={job.admin.companyName}
            width={96}
            height={96}
            className="rounded-full object-cover mx-auto mb-3"
          />

          <p className="text-xl font-semibold text-gray-800">
            {job.admin.companyName}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <Formik
        initialValues={{ salary: 0, cv: null }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          await sendingData({ ...values, cv: file });
        }}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-6">
            {/* CV Upload */}
            <div>
              <label
                htmlFor="cv"
                className="block text-sm font-medium text-gray-700"
              >
                Upload CV (PDF, DOCX)
              </label>
              <input
                type="file"
                id="cv"
                name="cv"
                accept=".pdf,.docx"
                className="mt-2 block w-full border-gray-300 rounded-md shadow-sm file:bg-blue-500 file:text-white file:border-none file:px-4 file:py-2 file:rounded file:cursor-pointer"
                onChange={(e) => {
                  const selectedFile = e.target.files
                    ? e.target.files[0]
                    : null;
                  setFile(selectedFile);
                  setFieldValue('cv', selectedFile);
                }}
              />
              <ErrorMessage
                name="cv"
                component="div"
                className="text-red-500 text-sm mt-2"
              />
            </div>

            {/* Salary Expectation */}
            <div>
              <label
                htmlFor="salary"
                className="block text-sm font-medium text-gray-700"
              >
                Expected Salary
              </label>
              <Field
                type="number"
                id="salary"
                name="salary"
                className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your expected salary"
              />
              <ErrorMessage
                name="salary"
                component="div"
                className="text-red-500 text-sm mt-2"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Apply Now
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ApplyJobForm;
