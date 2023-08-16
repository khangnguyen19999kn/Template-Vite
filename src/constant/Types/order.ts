export type TOrderBuy = {
  size: string;
  price: string;
  quantity: number;
  id: string;
  name: string;
  img: string;
};
export interface IDataTableOrder {
  [key: string]:
    | string
    | number
    | string[]
    | TOrderBuy[]
    | boolean
    | { name: string; code: string };
}

export type TOrder = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  deliveryWay: string;
  city: { name: string; code: string };
  district: { name: string; code: string };
  ward: { name: string; code: string };
  address: string;
  itemBuy: TOrderBuy[];
  isVerify: boolean;
  status: boolean;
  totalPrice: string;
};
