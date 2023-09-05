import { Box, BoxProps } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export const TopBanner = (props: BoxProps) => {
  const reduxData = useSelector((state: any) => state.icon);
  const { locale } = useRouter();

  return (
    <Box
      bg="primaryColor"
      color="white"
      textAlign="center"
      py="2"
      fontSize="sm"
      fontWeight="medium"
      {...props}
      display={reduxData.storeSetData.offerHeading ? "block" : "none"}
    >
      {reduxData.storeSetData && reduxData.storeSetData.offerHeading && reduxData.storeSetData.offerHeading[locale]}
    </Box>
  )
}
