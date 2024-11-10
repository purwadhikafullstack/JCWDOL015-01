"use client";
import React from 'react';

const JobApplicationInfo = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Job Application Information</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Link to Job Application</h2>
        <p className="text-gray-700">
          Jika preselection test diaktifkan, pelamar harus menyelesaikan tes sebelum melanjutkan ke tahap lamaran.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Test Results</h2>
        <p className="text-gray-700">
          Hasil test akan ditampilkan pada daftar pelamar, dan dapat digunakan oleh perusahaan untuk menilai pelamar.
        </p>
      </section>
    </div>
  );
};

export default JobApplicationInfo;
