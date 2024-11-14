import { PrismaClient } from '@prisma/client';

  const prisma = new PrismaClient();

    export interface UpdateJobInput {
        title?: string;
        description?: string;
        category?: string;
        location?: string;
        salary?: number;
        tags?: string;
        expiry_date?: Date;
        requires_test?: boolean; // Ensure this property is included
        remote_option?: boolean;
        is_published?: boolean;
        banner?: string;
    }

    export const createJobPosting = async (data: {
        title: string;
        description: string;
        category: string;
        location: string;
        salary?: number;
        tags?: string;
        expiry_date: Date;
        admin_id: number;
        banner?: string; // Add banner field for URL storage
    }) => {
        try {
            return await prisma.job.create({
                data,
            });
        } catch (error) {
            console.error('Error creating job posting:', error);
            throw new Error('Could not create job posting.');
        }
    };

    export const updateJobPosting = async (id: number, data: UpdateJobInput) => {
        try {
            return await prisma.job.update({
                where: { id },
                data,
            });
        } catch (error) {
            console.error('Error updating job posting:', error);
            throw new Error('Could not update job posting.');
        }
    };

    export const deleteJobPosting = async (id: number): Promise<void> => {
      try {
          await prisma.job.delete({
              where: { id },
          });
      } catch (error) {
          console.error('Error deleting job posting:', error);
          throw new Error('Could not delete job posting.');
      }
  };

    export const toggleJobPublishStatus = async (id: number, published: boolean) => {
      try {
        return await prisma.job.update({
          where: { id },
          data: { published },
        });
      } catch (error) {
        console.error('Error toggling publish status:', error);
        throw new Error('Could not toggle publish status.');
      }
    };

    export const getJobPostings = async (query: {
        title?: string;
        category?: string;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
        offset?: number;
        limit?: number;
    }) => {
      const { title, category, sortField, sortOrder, offset = 0, limit = 10 } = query;
      console.log(title);

      return await prisma.job.findMany({
        skip: offset,
        take: limit,
        where: {
          title: title ? { contains: title } : undefined,
          category: category ? { contains: category } : undefined,
        },
        orderBy: sortField ? { [sortField]: sortOrder ?? 'asc' } : undefined,
        include: {
          applicant: true, // Be cautious with large data sets
        },
      });
    };

    export const getTotalJobs = async (query: {
        title?: string;
        category?: string;
    }) => {
      const { title, category } = query;

      return await prisma.job.count({
        where: {
          title: title ? { contains: title } : undefined,
          category: category ? { contains: category } : undefined,
        },
      });
    };

    export const getJobPostingDetail = async (jobId: number) => {
      return await prisma.job.findUnique({
          where: { id: jobId },
          include: { 
              applicant: { 
                  include: { 
                      user: {
                          select: {
                              name: true, // Select only the name field
                          },
                      },
                      result: {
                          select: {
                              score: true, // Adjust based on your Result model structure
                          },
                      },
                  },
              },
          },
      });
  };
  

    
