export type TProduct = {
  id: string;
  name: string;
  type: string;
  brand: string;
  concentration: string;
  priceFor10ml: number;
  priceForFull: number;
  img: string[]; // Update the type to string[]
  quantitySold: number;
  introduce: string;
  note: string;
  ingredient: string;
};
