import { useAdminStore } from "../stores/AuthStore";
import { Button } from "../components/ui/button";

export const BlogsPage = () => {
  const { authorized } = useAdminStore();
  return (
    <div className="text-center">
      {authorized && (
        <Button> Add Blog </Button>
      )}
    </div>
  );
};
