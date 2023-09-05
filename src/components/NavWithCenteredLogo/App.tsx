import { Stack } from "@chakra-ui/react";
import { MobileBottomNav } from "./MobileBottomNav";
import { NavHeader } from "./NavHeader";
import MobileNavHeader from "./MobileNavHeader";
import { TopBanner } from "./TopBanner";

export const App = () => (
  <>
    {/* <TopBanner /> */}
    <Stack position={"sticky"} top={0} zIndex={100000}>
      <NavHeader.Desktop />
      {/* <NavMenu.Desktop /> */}
    </Stack>
    <MobileNavHeader />
    {/* <NavMenu.Mobile /> */}
    <MobileBottomNav />
  </>
);
