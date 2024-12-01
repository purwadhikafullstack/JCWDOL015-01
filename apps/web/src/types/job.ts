export interface IFilters {
  title?: string;
  location: string;
  remote_option: boolean;
  tags: string;
}

export interface IJob {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: number;
  remote_option: boolean;
}
