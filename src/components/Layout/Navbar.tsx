import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Logo } from "./Logo";
import { Sidebar } from "./Sidebar";
import { ToggleButton } from "./ToggleButton";

export const Navbar = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  return (
    <Box
      width="full"
      py="4"
      px={{ base: "4", md: "8" }}
      bg="bg-surface"
      boxShadow={useColorModeValue("sm", "sm-dark")}
    >
      <Flex justify="space-between" alignItems={'center'}>
        <Logo width={150} />
        <ToggleButton
          isOpen={isOpen}
          aria-label="Open Menu"
          onClick={onToggle}
        />
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          isFullHeight
          preserveScrollBarGap
          // Only disabled for showcase
          trapFocus={false}
        >
          <DrawerOverlay />
          <DrawerContent>
            <Sidebar onclose={onClose}/>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
};
