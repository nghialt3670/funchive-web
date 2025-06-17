export interface ResponseBody<T> {
  code: string;
  message: string;
  data: T;
}

export interface ResponsePage<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
}
