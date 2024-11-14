// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/sign-in", // Path to your login page
  },
});

export const config = {
  matcher: ['/homeFeed', '/createPost', '/profilePage'],
};
