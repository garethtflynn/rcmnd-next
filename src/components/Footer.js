import React from "react";

function Footer(props) {
  const footerYear = new Date().getFullYear();
  return (
    <div className="bg-[#110A02] text-[#FBF8F4] flex justify-center text-sm py-2">
      <p>© {footerYear} rcmnd. All Rights Reserved.</p>
    </div>
  );
}

export default Footer;
