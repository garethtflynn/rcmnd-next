import UserPostsHomePage from "@/components/UserPostsHomePage";
import Footer from "@/components/Footer";

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
