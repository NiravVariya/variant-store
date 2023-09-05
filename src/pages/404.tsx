import { Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

const NotFoundPage = () => {
  const { locale } = useRouter();
  return (
    <>
      <Flex flexDir="column" as="main" alignItems="center" py={20}>
        <Heading as="h1" textAlign="center">
          404
        </Heading>
        <Text fontSize="medium" my={8}>
          Sorry, the page you are looking for was not found
        </Text>
      </Flex>
    </>
  );
};

export default NotFoundPage;
