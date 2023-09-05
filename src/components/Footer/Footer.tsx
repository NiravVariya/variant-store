import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Flex,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Logo } from "./Logo";
import Frame106 from "./assets/Frame106.png";
import Frame107 from "./assets/Frame107.png";
import Frame109 from "./assets/Frame109.png";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/client";
import useTranslation from "@/hooks/useTranslation";
import { useRouter } from "next/router";

export const Footer = () => {

  const [storeData, setStoreData] = useState([])
  const [storeDocId, setStoreDocId] = useState("")
  const { t } = useTranslation();
  const { locale } = useRouter();

  const settingStoreRef = collection(db, "storeSetting");
  onSnapshot(settingStoreRef, (settingSnap) => {
    settingSnap.docs.map((value) => {
      const dataref: any = doc(db, "storeSetting", value.id);
      setStoreDocId(dataref.id);
    });
  });

  const links = [
    {
      title: t('Footer.QuickLinks'),
      links: [
        { label: t('Footer.Home'), href: '/' },
        { label: t('Footer.AllCategories'), href: '/categories' },
        { label: t('Footer.Terms&Conditions'), href: '/terms' },
        { label: t('Footer.PrivacyPolicy'), href: '/privacy' },
        { label: t('Footer.ContactUs'), href: '/contactus' },
        { label: t('Footer.AboutUs'), href: '/aboutus' },
      ],
    },
  ]

  useEffect(() => {
    if (storeDocId) {
      const newdocRef = collection(db, "storeSetting", storeDocId, "SocialMediaLinks");
      onSnapshot(newdocRef, (querydata) => {
        let newArray: any = [];
        querydata.docs.map((item: any) => {
          newArray.push(item.data())
          setStoreData(newArray)
        })
      });
    }
  }, [storeDocId])

  const reduxData = useSelector((state: any) => state.icon);

  return (
    <Box bg="primaryColor" color="#fff">
      <Container as="footer" role="contentinfo">
        <Stack
          spacing={{ base: "12", md: "12" }}
          // direction={{ base: 'column-reverse', lg: 'row' }}
          py={{ base: "12", md: "16" }}
          justify="space-between"
        >
          <SimpleGrid
            columns={{ base: 2, md: 3 }}
            gap="12"
            width={{ base: "full", lg: "auto" }}
          >
            {links.map((group, idx) => (
              <Stack key={idx} spacing="4" minW={{ lg: "40" }}>
                <Text fontSize="xl" fontWeight="semibold" color="#fff" mb="7px">
                  {group.title}
                </Text>
                <Stack spacing="2" shouldWrapChildren>
                  {group.links.map((link, idx) => (
                    <Link
                      key={idx}
                      // as="a"
                      // variant="link-on-accent"
                      href={link.href}
                      // fontSize="md"
                      // fontWeight="normal"
                      color={"#fff"}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Stack>
              </Stack>
            ))}
            <Stack spacing="4" minW={{ lg: "40" }} display={reduxData.storeSetData.contactInfo ? "block" : "none"}>
              <Text fontSize="xl" fontWeight="semibold" color="#fff" mb="10px">
                {t('Footer.ContactInfo')}
              </Text>
              <Stack>
                <Text fontSize="xs" opacity={0.5} marginTop={3}>
                  {t('Footer.Address')}
                </Text>
                <Text fontSize="md" color="#fff" style={{ marginTop: "0rem" }}>
                  {reduxData.storeSetData && reduxData.storeSetData.contactInfo && reduxData.storeSetData.contactInfo.address[locale]}
                </Text>
                <Text fontSize="xs" opacity={0.5} style={{ marginTop: "1.5rem" }}>
                  {t('Footer.Email')}
                </Text>
                <Text fontSize="md" color="#fff" style={{ marginTop: "0rem" }}>
                  {reduxData.storeSetData && reduxData.storeSetData.contactInfo && reduxData.storeSetData.contactInfo.email}
                </Text>
                <Text fontSize="xs" opacity={0.5} style={{ marginTop: "1.5rem" }}>
                  {t('Footer.ContactNumber')}
                </Text>
                <Text fontSize="md" color="#fff" style={{ marginTop: "0rem" }}>
                  {reduxData.storeSetData && reduxData.storeSetData.contactInfo && reduxData.storeSetData.contactInfo.phone}
                </Text>
              </Stack>
            </Stack>
            <Stack minW={{ lg: "40" }}>
              <Text fontSize="xl" fontWeight="semibold" color="#fff" display={storeData.length === 0 ? "none" : "block"} mb="15px">
                {t('Footer.FollowUs')}
              </Text>
              {storeData && storeData.map((link, idx) => (
                <Stack spacing="2" shouldWrapChildren key={idx} marginBottom={10}>
                  <a
                    key={idx}
                    href={link.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.title[locale]}
                  </a>
                </Stack>
              ))}
            </Stack>
          </SimpleGrid>
        </Stack>
        <Stack
          pb="12"
          justify="space-between"
          direction={{ base: "column", md: "row" }}
          align={{ base: "start", md: "center" }}
        >
          <HStack
            justify={{ base: "space-between", sm: "start" }}
            width={{ base: "full", sm: "auto" }}
            spacing="8"
          >
            <Text fontSize="sm" color="#fff">
              &copy; {new Date().getFullYear()} {reduxData && reduxData.storeSetData.copyRightLine && reduxData.storeSetData.copyRightLine[locale]}
            </Text>
          </HStack>
          <Flex gap={2}>
            <Image src={Frame106} alt="" />
            <Image src={Frame107} alt="" />
            <Image src={Frame109} alt="" />
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}
