import { Button, DefaultMantineColor, Modal, Text } from "@mantine/core";

import style from "./ModalWarningStyle.module.scss";

interface IModalWarningProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  confirm: (id: string) => void | (() => void);
  id: string;
  colorConfirmButton: DefaultMantineColor | undefined;
  content?: string;
}

export default function ModalWarning({
  id,
  opened,
  onClose,
  title,
  confirm,
  colorConfirmButton,
  content,
}: IModalWarningProps) {
  return (
    <div>
      <Modal opened={opened} title={title} onClose={onClose}>
        <div className={style.wrapperContentModal}>
          <Text className={style.textContentModal}>{content}</Text>
          <div className={style.groupButtonSide}>
            <Button
              onClick={() => {
                confirm(id);
                onClose();
              }}
              color={colorConfirmButton}
              className={style.buttonConfirm}
            >
              Xác Nhận
            </Button>
            <Button
              onClick={() => {
                onClose();
              }}
              className={style.buttonCancel}
            >
              Hủy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
