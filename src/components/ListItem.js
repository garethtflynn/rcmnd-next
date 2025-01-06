

export default function ListItem({
  id,
  title,
  link,
  description,
  image,

}) {
  return (
    <div id={id}>
      <p className="text-[#FBF8F4]">{title}</p>
    </div>
  );
}