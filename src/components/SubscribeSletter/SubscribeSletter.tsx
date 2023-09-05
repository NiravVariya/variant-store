import {
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

export const SubscribeSletter = () => (
  <Stack
    spacing={{ base: "8", md: "10" }}
    align="center"
    mx="auto"
    py={{ base: "16", md: "24" }}
    bg={"rgba(210, 165, 23, 0.1)"}
  >
    <Stack spacing={{ base: "4", md: "5" }} textAlign="center">
      <Heading size={{ base: "sm", md: "md" }} color="#D2A517">
        Let’s Keep in Touch
      </Heading>
      <Text fontSize={{ base: "sm" }} color="#D2A517" mt={0}>
        Join our list and 20% Save Our First Product
      </Text>
    </Stack>
    <Stack
      direction={{ base: "column", md: "row" }}
      width="full"
      maxW={{ md: "lg" }}
      spacing="4"
    >
      <FormControl flex="1">
        <Input type="email" size="lg" placeholder="Enter your email" className="email_placeholder"/>
      </FormControl>
      <Button variant="primary" size="lg">
        Subscribe
      </Button>
    </Stack>
    <Flex color="#D2A517" textAlign={"center"} mt={1}>
      By subscribing, you accept the &nbsp;
      <Text fontWeight={700}> Privacy Policy </Text>
    </Flex>
  </Stack>
);
