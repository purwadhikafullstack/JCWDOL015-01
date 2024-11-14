'use client';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Applicant } from '@prisma/client';

export type Job = {
  id: number;
  admin_id: number;
  title: string;
  description: string;
  banner: string;
  category: string;
  location: string;
  salary: number;
  tags: string;
  expiry_date: Date;
  published: boolean;
  requires_test: boolean;
  remote_option: boolean;
  applicantCount: number;
  created_at: Date;
  updated_at: Date;
};

export type JobWithApplicants = Job & {
  applicants: Applicant[];
};

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: 'admin_id',
    header: 'Admin ID',
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'banner',
    header: 'Banners',
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'salary',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Salary
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
  },
  {
    accessorKey: 'expiry_date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Expiry Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'published',
    header: 'Published',
  },
  {
    accessorKey: 'requires_test',
    header: 'Requires Test',
  },
  {
    accessorKey: 'remote_option',
    header: 'Remote Option',
  },
  {
    accessorKey: 'applicantCount',
    header: 'Applicant Count',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const job = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/dashboard/job-postings/${job.id}`}>
              <DropdownMenuItem>View Job</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
