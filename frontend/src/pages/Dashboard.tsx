import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export const Dashboard = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [currentPage, setCurrentPage] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [cursors, setCursors] = useState([null]);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (cursor: string | null, limit: number) => {
    const url = cursor 
      ? `${apiUrl}/users/getUsers?cursor=${cursor}&limit=${limit}`
      : `${apiUrl}/users/getUsers?limit=${limit}`;
    
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`${apiUrl}/users/updateRole`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, role: newRole })
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      // Update the local state
      setUsers(users.map((user: User) => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

    } catch (error) {
      console.error('Error updating role:', error);
      setError('Failed to update user role');
    }
  };

  const loadUsers = async (cursor: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUsers(cursor, 5);
      setUsers(result.users || []);
      setHasNext(!!result.nextCursor);
      return result.nextCursor;
    } catch (error) {
      console.error('Failed to load users:', error);
      setError(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(null);
  }, []);

  const goNext = async () => {
    if (!hasNext || loading) return;
    
    const currentCursor = cursors[currentPage];
    
    try {
      const result = await fetchUsers(currentCursor, 5);
      
      const newCursors = [...cursors];
      if (currentPage === cursors.length - 1) {
        newCursors.push(result.nextCursor);
        setCursors(newCursors);
      }
      
      setUsers(result.users || []);
      setCurrentPage(currentPage + 1);
      setHasNext(!!result.nextCursor);
    } catch (error) {
      console.error('Error going next:', error);
      setError('Failed to load next page');
    }
  };

  const goPrevious = async () => {
    if (currentPage === 0 || loading) return;
    
    const previousCursor = cursors[currentPage - 1];
    await loadUsers(previousCursor);
    setCurrentPage(currentPage - 1);
    setHasNext(true);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        Users
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="border rounded-lg overflow-hidden mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'SUPERADMIN' 
                        ? 'bg-orange-100 text-orange-800' 
                        : user.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role || 'USER'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger 
                        asChild 
                        disabled={user.role === 'SUPERADMIN' || user.role === 'ADMIN'}
                      >
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={user.role === 'SUPERADMIN' || user.role === 'ADMIN'}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => updateUserRole(user.id, 'USER')}
                        >
                          Set as User
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => updateUserRole(user.id, 'ADMIN')}
                        >
                          Set as Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => updateUserRole(user.id, 'AUTHOR')}
                        >
                          Set as Author
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          disabled={currentPage === 0 || loading}
          onClick={goPrevious}
        >
          <MoveLeft className="mr-2" />
          Previous
        </Button>
        
        <span className="text-sm text-gray-600">
          Page {currentPage + 1}
        </span>
        
        <Button 
          disabled={!hasNext || loading}
          onClick={goNext}
        >
          Next
          <MoveRight className="ml-2" />
        </Button>
      </div>
    </>
  );
};