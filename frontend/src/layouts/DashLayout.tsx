import { Outlet } from "react-router-dom";
export const DashLayout = () => {
  return (
    <div className="mt-10 p-20 bg-background rounded-lg">
      <Outlet />
    </div>
  );
};
