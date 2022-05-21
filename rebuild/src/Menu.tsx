import { useState } from "react";
import SideMenu from "./SideMenu";
import TopMenu from "./TopMenu";

interface MenuProps {
  customTagCount: number;
}

function Menu(props: MenuProps) {
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);

  return (
    <>
      <TopMenu onSideMenuOpen={() => setSideMenuOpen(true)} />
      <SideMenu
        isOpen={isSideMenuOpen}
        customTagCount={props.customTagCount}
        onClose={() => setSideMenuOpen(false)}
      />
    </>
  );
}

export default Menu;
