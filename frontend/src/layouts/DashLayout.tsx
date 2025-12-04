import { Outlet } from "react-router-dom";
export const DashLayout = () => {
  return (
    <div className="mt-10 p-4 sm:p-6 md:p-10 bg-background rounded-lg">
      <Outlet />
    </div>
  );
};
