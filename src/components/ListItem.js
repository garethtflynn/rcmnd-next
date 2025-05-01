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
      className="place-content-center bg-[#000000] hover:bg-[#4C4138]"
    >
      <p
        onClick={handleNavToList}
        className="text-[#D7CDBF] text-base p-2 cursor-pointer border text-center"
      >
        {title}
      </p>
    </div>
  );
}
