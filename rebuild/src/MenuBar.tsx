import { useState } from "react";
import SideMenu from "./SideMenu";
import TopMenu from "./TopMenu";

interface MenuBarProps {
  customTagCount: number;
}

function MenuBar(props: MenuBarProps) {
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

export default MenuBar;
