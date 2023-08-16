import { Image, Text } from "@mantine/core";

import { TOrderBuy } from "@/constant/Types/order";

import style from "./CartItemStyle.module.scss";

interface ICartItemProps {
  item: TOrderBuy;
  canEdit?: boolean;
}

export default function CartItem({ item, canEdit }: ICartItemProps) {
  const { name, img, size, price, quantity } = item;
  const priceWithoutCommaAndSymbol = parseInt(price.replace(/,|đ/g, ""), 10);
  return (
    <div>
      <div className={style.containerCartItem}>
        <button
          style={{ visibility: canEdit ? "visible" : "hidden" }}
          className={style.buttonRemoveItem}
        >
          X
        </button>

        <div className={style.wrapperCartItem}>
          <Image
            src={img}
            width={150}
            height={150}
            // className={classes.imgCartItem}
            alt="img Cart item"
          />
          <div className={style.wrapperInfoCart}>
            <Text className="mb-3 mobile:mb-1">{name}</Text>
            <Text className="mb-3 mobile:mb-1">Size: {size}</Text>
            <Text className="hidden mobile:block">{price} VNĐ</Text>
            {/* <QuantityItem id={id} /> */}
          </div>
          <div className={style.wrapperQuantity}>
            <Text>Số lượng đặt</Text>
            <Text className={style.textQuantity}>{quantity}</Text>
          </div>
          <div className={style.wrapperTotalPrice}>
            <Text>Tổng tiền</Text>
            <Text className={style.textPrice}>
              {(priceWithoutCommaAndSymbol * quantity).toLocaleString()} VNĐ
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
