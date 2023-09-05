import useTranslation from '@/hooks/useTranslation';
import { Center, Container, Heading, SimpleGrid, Stack } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import Image from 'next/image';

export const TopBrands = () => {
  const { t } = useTranslation();
  const reduxData = useSelector((state: any) => state.icon);
  
  return (
    <Container
      py={{ base: '12', md: '16' }}
      display={reduxData.storeSetData.brandLogos ? "block" : "none"}
    >
      <Stack spacing="8">
        <Heading
          size={'md'}
          fontWeight="medium"
          textAlign="start"
          borderBottom={'2px solid #6e6e6e'}
          pb={15}
        >
          {t('Home.TopBrands')}
        </Heading>
        <SimpleGrid
          gap={{ base: '4', md: '8' }}
          columns={{ base: 2, md: 3, lg: 5 }}
        >
          {reduxData.storeSetData &&
            reduxData.storeSetData.brandLogos &&
            reduxData.storeSetData.brandLogos.map((data: any, index: number) => (
              <Center
                key={index}
                border={"1px dotted"}
                boxShadow={'md'}
                className="brandImg"
                // style={{ width: "100%", paddingBottom: "80%" }}
              >
                <Image
                  alt="Image Alt"
                  src={data}
                  width={120}
                  height={140}
                  unoptimized
                  // fill
                  // style={{ objectFit: "contain" }}
                />
              </Center>
            ))}
        </SimpleGrid>
      </Stack>
    </Container>
  )
}