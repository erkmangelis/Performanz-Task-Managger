import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const SimpleModalExample = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="Simple Modal"
        open={open}
        onCancel={handleCancel}
        footer={null}
      >
        <p>This is a simple modal</p>
      </Modal>
    </div>
  );
};

export default SimpleModalExample;
