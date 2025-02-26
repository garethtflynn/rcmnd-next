export default function ListItem({
  id,
  title,
  link,
  description,
  image,
  navToListCallback,
}) {
  const handleNavToList = () => {
    if (navToListCallback) {
      navToListCallback(id);
    }
    // console.log(`going to list ${id}`);
  };
  return (
    <div
      key={id}
      className="place-content-center bg-[#110A02] hover:bg-[#4C4138]"
    >
      <p
        onClick={handleNavToList}
        className="text-[#FBF8F4] text-base p-2 cursor-pointer border text-center"
      >
        {title}
      </p>
    </div>
  );
}
