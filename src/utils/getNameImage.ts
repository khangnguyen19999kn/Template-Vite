export const getNameImage = (name: string) => {
  const result = name.split("/").slice(-1)[0].replace(".jpg", "");
  return result;
};
