import React, { useState } from "react";

export default function Message({
  msg,
  children,
  onDeleteForMe,
  onDeleteForEveryone,
}) {
  const [menu, setMenu] = useState({ show: false, x: 0, y: 0 });

  const openMenu = (e) => {
    e.preventDefault();
    setMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const closeMenu = () => setMenu({ ...menu, show: false });

  return (
    <div onContextMenu={openMenu} style={{ position: "relative" }}>
      {children}

      {menu.show && (
        <div
          className="context-menu"
          style={{
            position: "fixed",
            top: menu.y,
            left: menu.x,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "6px 10px",
            zIndex: 9999,
          }}
          onMouseLeave={closeMenu}
        >
          <p onClick={() => onDeleteForMe(msg._id)}>Delete for me</p>
          <p onClick={() => onDeleteForEveryone(msg._id)}>Delete for everyone</p>
        </div>
      )}
    </div>
  );
}
