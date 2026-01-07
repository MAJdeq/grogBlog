import type { UserState } from "@/stores/AuthStore";
type Blog = {
  id: string;
  title: string;
  authorId: string;
  content: string;
  bannerUrl: string;
  createdAt?: string;
};
export function canEditBlog(user: UserState, blog: Blog) {
  if (user.isAdmin) return true;                // Admin can edit anything
  if (user.isAuthor && blog.authorId === user.user.userId) return true; // Authors can edit their own
  return false;
}

export function canAddBlog(user: UserState) {
  if (user.isAdmin || user.isAuthor) return true;                // Admin can edit anything
  return false;
}

export function canDeleteBlog(user: UserState, blog: Blog) {
  if (user.isAdmin) return true;
  if (user.isAuthor && blog.authorId === user.user.userId) return true;
  return false;
}
