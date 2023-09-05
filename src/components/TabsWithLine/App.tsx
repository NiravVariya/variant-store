import useTranslation from '@/hooks/useTranslation';
import { Box, Button, Container, Stack, Tab, TabList, Tabs } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export const TabsWithLine = () => {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Box as="section">
      <Container py={{ base: '4', md: '8' }}>
        <Stack spacing="16" flexWrap={"wrap"} overflow={"auto"}>
          <Tabs>
            <TabList border={"none"}>
              <Button
                variant="ghost"
                color={router.pathname === "/profile" ? "primaryColor" : "#8b8b8b"}
                _hover={{ color: "primaryColor" }}
                borderRadius={0}
                borderBottom={router.pathname === "/profile" ? "2px" : "0px"}
                onClick={() => router.push("/profile")}
              >
                {t("Profile.Tabs.Profile")}
              </Button>
              <Button
                variant="ghost"
                color={router.pathname === "/order" ? "primaryColor" : "#8b8b8b"}
                _hover={{ color: "primaryColor" }}
                borderRadius={0}
                borderBottom={router.pathname === "/order" ? "2px" : "0px"}
                onClick={() => router.push("/order")}
              >
                {t("Profile.Tabs.MyOrder")}
              </Button>
              <Button
                variant="ghost"
                color={router.pathname === "/changepassword" ? "primaryColor" : "#8b8b8b"}
                _hover={{ color: "primaryColor" }}
                borderRadius={0}
                borderBottom={router.pathname === "/changepassword" ? "2px" : "0px"}
                onClick={() => router.push("/changepassword")}

              >
                {t("Profile.Tabs.ChangePassword")}
              </Button>
              {/* <Button variant="ghost" color={router.pathname === "/notifications" ? "primaryColor" : "#8b8b8b"}
                _hover={{ color: "primaryColor" }}
                onClick={() => router.push("/notifications")}>Notifications</Button> */}
              <Button
                variant="ghost"
                color={router.pathname === "/wishlist" ? "primaryColor" : "#8b8b8b"}
                _hover={{ color: "primaryColor" }}
                borderRadius={0}
                borderBottom={router.pathname === "/wishlist" ? "2px" : "0px"}
                onClick={() => router.push("/wishlist")}
              >
                {t("Profile.Tabs.MyWishlist")}
              </Button>
              <Button
                variant="ghost"
                color={router.pathname === "/logout" ? "primaryColor" : "#8b8b8b"}
                _hover={{ color: "primaryColor" }}
                borderRadius={0}
                borderBottom={router.pathname === "/logout" ? "2px" : "0px"}
                onClick={() => router.push("/logout")}
              >
                {t("Profile.Tabs.LogOut")}
              </Button>
            </TabList>
          </Tabs>
        </Stack>
      </Container>
    </Box>
  )
}
