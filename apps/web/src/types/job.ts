export interface IFilters {
  title: string;
  location: string;
  remoteOption: boolean;
  tags: string;
}

export interface IJob {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: number;
  remoteOption: boolean;
}
