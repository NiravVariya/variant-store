import { CircularProgress, Container, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Loader = ({ maxW = "container.lg", py = 20 }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowText(true), 3000);
  }, []);

  return (
    <Container maxW={maxW} py={py}>
      <Flex
        flexDir="column"
        width={"full"}
        height={"max"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <CircularProgress isIndeterminate color="accent" />
        {showText && (
          <Text fontSize="xs" fontWeight={"bold"} mt={2}>
            Just a moment...
          </Text>
        )}
      </Flex>
    </Container>
  );
};

export default Loader;
