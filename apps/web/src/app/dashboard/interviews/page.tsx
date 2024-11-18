'use client';

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CreateSchedule from '@/components/CreateSchedule';
import { Event } from 'cypress/types/jquery';
import InterviewDetailModal from '@/components/InterviewDetailModal';

type Event = {
  title: string;
  date: string;
  id: number
}
function page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);

  const handleEventClick = (info : any) => {
    events.forEach(event => {
      if (event.id === Number(info.event.id)) {
        setSelectedEvent(event);
      }
    })
  };
  useEffect(() => {
    if (selectedEvent) {
      console.log(selectedEvent);
    }
  }, [selectedEvent]);

  const handleEditEvent = (updatedEvent: Event) => {
    // Update event using fetch
    fetch(`http://localhost:8000/api/interviews/${updatedEvent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Event updated successfully:', data);
      fetchInterviews();
    })
    .catch((error) => {
      console.error('Error updating event:', error);
    })
    setSelectedEvent(undefined); // Tutup modal setelah mengedit
  };

  const handleDeleteEvent = (eventId: number) => {
    // Delete event using fetch
    fetch(`http://localhost:8000/api/interviews/${eventId}`, {
      method: 'DELETE',
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Event deleted successfully:', data);
      fetchInterviews();
    })
    .catch((error) => {
      console.error('Error deleting event:', error);
    })
    setSelectedEvent(undefined); // Tutup modal setelah menghapus
  };

  const fetchInterviews = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/interviews');
      const data = await response.json();
      const interviews = data.map((interview: any) => ({
        title: `Interview with ${interview.applicant.user.name}`,
        date: new Date(interview.date_time).toISOString().slice(0, 16),
        id: interview.id
      }));
      setEvents(interviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-4">
          <CreateSchedule onSubmit={fetchInterviews} />
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events.map(event => ({...event, id: event.id?.toString()}))}
          eventClick={handleEventClick}
        />
      </div>
      {selectedEvent && (
        <InterviewDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(undefined)}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </DashboardLayout>
  );
}

export default page;
