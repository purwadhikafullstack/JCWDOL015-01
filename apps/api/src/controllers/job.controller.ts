import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class JobController {

  async getJobsByGeolocation(req: Request, res: Response) {
    const { lat, lng, radius = 10000, limit = 10 } = req.query;
  
    // Make sure lat and lng are provided and are valid numbers
    if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
      return res.status(400).json({ error: 'Valid latitude and longitude are required' });
    }
  
    // Convert query parameters to numbers
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radiusValue = parseInt(radius as string, 10);
    const limitValue = parseInt(limit as string, 10);
  
    try {
      // Use raw query to fetch jobs based on geolocation
      const jobs = await prisma.$queryRaw`
        SELECT *, 
               ST_Distance_Sphere(location, ST_GeomFromText('POINT(${longitude} ${latitude})')) AS distance
        FROM Job
        WHERE ST_Distance_Sphere(location, ST_GeomFromText('POINT(${longitude} ${latitude})')) <= ${radiusValue}
        ORDER BY distance ASC
        LIMIT ${limitValue};
      `;
  
      res.status(200).json(jobs);
    } catch (error) {
      console.error('Error fetching jobs by geolocation:', error);
      res.status(500).json({ error: 'Failed to fetch jobs by geolocation' });
    }
  }
  
  
  async getAllJobs(req: Request, res: Response) {
    try {
      const jobs = await prisma.job.findMany({
        include: {
          admin: true,
          applicant: true,
        },
      });
      res.status(200).json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  }

  // Fetch job locations (countries)
  async getJobLocations(req: Request, res: Response) {
    try {
      const locations = await prisma.job.findMany({
        distinct: ['location'],  // Ensure unique locations
        select: { location: true },  // Only return location field
      });

      if (!locations || locations.length === 0) {
        // throw new Error('No locations found');
      }

      res.status(200).json(locations.map(location => location.location)); // Return array of locations
    } catch (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ error: 'Failed to fetch locations' });
    }
  }

  // Fetch jobs by filters (tags, remote, location)
  async getJobsByFilter(req: Request, res: Response) {
    const { field, country, remoteOption, tags } = req.query;

    try {
      const filters: any = {};

      if (field) filters.title = { contains: field };
      if (country) filters.location = { contains: country };
      if (remoteOption !== undefined) filters.remoteOption = remoteOption === 'true';

      //if (tags) {
      //  const tagsArray = tags.split(',').map(tag => tag.trim());  // Split and clean the tags string
      //  filters.tags = { in: tagsArray };  // Use `in` to match any of the tags
      //}

      const jobs = await prisma.job.findMany({
        where: filters,
        include: {
          admin: true,
          applicant: true,
        },
      });
      res.status(200).json(jobs);
    } catch (error) {
      console.error('Error fetching jobs with filters:', error);
      res.status(500).json({ error: 'Failed to fetch jobs with filters' });
    }
  }

  // Add a new job
  async addJob(req: Request, res: Response) {
    const jobData = req.body;

    try {
      const newJob = await prisma.job.create({
        data: {
          title: jobData.title,
          description: jobData.description,
          location: jobData.location,
          salary: jobData.salary,
          category: jobData.category,
          admin: jobData.admin,
          expiry_date: jobData.expiryDate,
          tags: jobData.tags,
          remote_option: jobData.remoteOption,
          adminId: jobData.adminId,
        },
      });
      res.status(201).json(newJob);
    } catch (error) {
      console.error('Error adding job:', error);
      res.status(500).json({ error: 'Failed to add job' });
    }
  }

  // Update a job
  async updateJob(req: Request, res: Response) {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const updatedJob = await prisma.job.update({
        where: { id: Number(id) },
        data: updatedData,
      });
      res.status(200).json(updatedJob);
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({ error: 'Failed to update job' });
    }
  }

  // Delete a job
  async deleteJob(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await prisma.job.delete({
        where: { id: Number(id) },
      });
      res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({ error: 'Failed to delete job' });
    }
  }
}
