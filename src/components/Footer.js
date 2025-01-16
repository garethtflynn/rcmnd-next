import React from "react";

function Footer(props) {
  const footerYear = new Date().getFullYear();
  return (
    <footer className="bg-[#110A02] text-[#ECE2D8] flex justify-center text-xs py-2 h-fit w-full ">
      <p>©{footerYear} rcmnd. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
