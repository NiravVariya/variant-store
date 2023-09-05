import { WarningIcon } from "@chakra-ui/icons";
import { Box, Card, Text } from "@chakra-ui/react";

const ErrorComponent = ({ errorMessage = "" }) => {
  return (
    <Card w="full">
      <Box textAlign="center" py={10} px={6}>
        <WarningIcon boxSize={"50px"} color={"red.500"} mb={12} />
        <Text color={"muted"}>{errorMessage}</Text>
      </Box>
    </Card>
  );
};

export default ErrorComponent;
