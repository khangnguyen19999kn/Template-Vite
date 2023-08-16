export type TBlogs = {
  id?: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  imgPosing: File | null;
};
export type TDataTableBlogs = {
  [key: string]: string | Date | File | null;
};
