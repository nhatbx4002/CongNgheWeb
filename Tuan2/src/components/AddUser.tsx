//@ts-nocheck

import { useState } from "react";
import { Modal } from "./Modals";

export function AddUser({ onAdd }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn primary" onClick={() => setOpen(true)}>Thêm người dùng</button>
      <Modal
        open={open}
        mode="add"
        initial={null}
        onClose={() => setOpen(false)}
        onSave={(data) => {
          onAdd(data);
          setOpen(false);
        }}
      />
    </>
  );
}
