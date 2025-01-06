import Header from "@/components/Header";
import UserListsHomePage from "@/components/UserListsHomePage";
import UserPosts from "@/components/UserPosts";

export default function HomeFeed(props) {
  return (
    <div className="bg-[#110A02] h-screen">
      <Header />
      <UserListsHomePage />
      <UserPosts />
    </div>
  );
}
