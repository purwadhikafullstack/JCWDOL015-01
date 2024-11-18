// components/InterviewDetailModal.js
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Applicant, Job } from '@prisma/client';
import { on } from 'events';

interface InterviewDetailModalProps {
  event: any;
  onClose: () => void;
  onEdit: (event: any) => void;
  onDelete: (eventId: number) => void;
}
type ApplicantWithUser = Applicant & {
  user: {
    name: string;
  };
};

const InterviewDetailModal: React.FC<InterviewDetailModalProps> = ({
  event,
  onClose,
  onEdit,
  onDelete
}) => {
  const [formData, setFormData] = useState({
    id: 0,
    date_time: '',
    location: '',
    applicant: {
      id: 0,
      user: {
        name: '',
      },
    },
    job_posting_id: null
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [applicants, setApplicants] = useState<ApplicantWithUser[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<number | null>(
    null,
  );

  useEffect(() => {
    fetch(`http://localhost:8000/api/interviews/${event.id}`)
      .then((response) => response.json())
      .then((data) => {
        // Convert to a Date object
        const date = new Date(data.date_time);

        // Format the date manually
        const formattedDate = date.toISOString().slice(0, 16);
        data.date_time = formattedDate;
        data.job_posting_id = data.applicant.job_posting_id
        setFormData(data);
        setSelectedJob(data.job_posting_id);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEdit(formData); // Pass updated event back to parent
  };

  const handleDelete = () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      return;
    }
    onDelete(event.id); // Call the onDelete function with the event ID
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
      setSelectedApplicant(formData.applicant.id);
    };
    if (selectedJob) {
        fetchApplicants();
    }
  }, [selectedJob]);

  useEffect(() => {
    if (selectedApplicant) {
    
    }
  }, [selectedApplicant]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button>Detail Interview</Button>
      </DialogTrigger>
      <DialogContent aria-describedby="modal-content">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
          <DialogDescription>{event.title}</DialogDescription>
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
                onChange={(e) => setSelectedApplicant(parseInt(e.target.value))}
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
            <Button type="button" variant={"destructive"} onClick={handleDelete}>Delete</Button>
            <Button type="submit">Submit</Button>
            <Button type="button" variant={"secondary"} onClick={onClose}>Close</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewDetailModal;
