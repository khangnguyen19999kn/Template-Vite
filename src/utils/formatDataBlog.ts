import { TBlogs } from "@/constant/Types/blog";

export const formatDataBlogs = (dataFormat: TBlogs[]) => {
  const formattedData: TBlogs[] = dataFormat
    ? dataFormat.map((blog: TBlogs) => ({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        author: blog.author,
        date: blog.date,
        imgPosing: blog.imgPosing,
      }))
    : [];
  return formattedData;
};
