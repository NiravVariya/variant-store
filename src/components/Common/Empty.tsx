import { WarningTwoIcon } from "@chakra-ui/icons";
import { Box, Card, Text } from "@chakra-ui/react";

interface Props {
  children?: React.ReactNode;
}

const EmptyPage = ({ children }: Props) => {
  return (
    <Card>
      <Box textAlign="center" py={10} px={6}>
        <WarningTwoIcon boxSize={"50px"} color={"orange.300"} mb={12} />
        <Text color={"muted"}>{children}</Text>
      </Box>
    </Card>
  );
};

export default EmptyPage;
