import { useState } from "react";
import SideMenu from "./SideMenu";
import TopMenu from "./TopMenu";

function Menu() {
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);

  return (
    <>
      <TopMenu onSideMenuOpen={() => setSideMenuOpen(true)} />
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
      />
    </>
  );
}

export default Menu;
