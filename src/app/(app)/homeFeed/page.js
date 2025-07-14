import UserPostsHomePage from "@/components/posts/UserPostsHomePage";
import Footer from "@/components/common/Footer";

export default function HomeFeed(props) {
  return (
    <>
      <div className="bg-[#000000] min-h-screen">
        <UserPostsHomePage />
      </div>
      <Footer />
    </>
  );
}
