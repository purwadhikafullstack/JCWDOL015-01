import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Applicant, Job } from '@prisma/client';

type ApplicantWithUser = Applicant & {
  user: {
    name: string;
  };
};

function CreateSchedule({onSubmit}: any) {
    const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [applicants, setApplicants] = useState<ApplicantWithUser[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<number | null>(
    null,
  );

  const [formData, setFormData] = React.useState({
    date_time: '',
    location: '',
    applicant: selectedApplicant,
    job_posting_id: selectedJob
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    fetch('http://localhost:8000/api/interviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Schedule created:', data);
        alert('Jadwal berhasil dibuat!');
        setFormData({
            date_time: '',
            location: '',
            applicant: selectedApplicant,
            job_posting_id: selectedJob
        });
        setOpen(false);
        onSubmit(data);
      })
      .catch((error) => {
        console.error('Error creating schedule:', error);
      });
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch(
        'http://localhost:8000/api/jobs?published=true',
      );
      const data = await response.json();
      setJobs(data.data);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchApplicants = async () => {
      const response = await fetch(
        `http://localhost:8000/api/applicants?job_posting_id=${selectedJob}`,
      );
      const data = await response.json();
      setApplicants(data);
    };
    if (selectedJob) {
        setFormData((prev) => ({ ...prev, job_posting_id: selectedJob }));
        fetchApplicants();
    }
  }, [selectedJob]);

  useEffect(() => {
    if (selectedApplicant) {
      setFormData((prev) => ({ ...prev, applicant: selectedApplicant }));
    }
  }, [selectedApplicant]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Buat Jadwal</Button>
      </DialogTrigger>
      <DialogContent aria-describedby="modal-content">
        <DialogHeader>
          <DialogTitle>Buat Jadwal Baru</DialogTitle>
          <DialogDescription>
            Isi formulir di bawah ini untuk membuat jadwal baru.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="date_time" className="block text-sm font-medium">
                Date & Time
              </label>
              <Input
                type="datetime-local"
                id="date_time"
                name="date_time"
                value={formData.date_time}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium">
                Location
              </label>
              <Input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="job" className="block text-sm font-medium">
                Job
              </label>
              <select
                id="job"
                value={selectedJob || ''}
                onChange={(e) => setSelectedJob(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a job
                </option>
                {jobs?.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="applicant" className="block text-sm font-medium">
                Applicant
              </label>
              <select
                id="applicant"
                value={selectedApplicant || ''}
                onChange={(e) =>
                  setSelectedApplicant(parseInt(e.target.value))
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select an applicant
                </option>
                {applicants.map((applicant) => (
                  <option key={applicant.id} value={applicant.id}>
                    {applicant.user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateSchedule;
