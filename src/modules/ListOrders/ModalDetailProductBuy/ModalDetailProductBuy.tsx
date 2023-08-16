import { Modal } from "@mantine/core";
import React from "react";

import CartItem from "@/components/CartItem/CartItem";
import { TOrderBuy } from "@/constant/Types/order";

interface IModalDetailProductBuyProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  itemBuy: TOrderBuy[];
}

export default function ModalDetailProductBuy({
  itemBuy,
  opened,
  onClose,
  title,
}: IModalDetailProductBuyProps) {
  const showItemBuy = itemBuy.map(item => {
    return (
      <div key={item.id}>
        <CartItem canEdit={false} item={item} />
      </div>
    );
  });

  return (
    <div>
      <Modal
        opened={opened}
        onClose={() => {
          onClose();
        }}
        title={title}
        size={"auto"}
      >
        <div>{showItemBuy}</div>
      </Modal>
    </div>
  );
}
