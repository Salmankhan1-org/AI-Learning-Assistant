import React from "react";
import { Outlet } from "react-router-dom";

const DocumentLayout = () => {
  return (
    <div className="flex flex-col h-full w-full ">
      <Outlet />
    </div>
  );
};

export default DocumentLayout;
