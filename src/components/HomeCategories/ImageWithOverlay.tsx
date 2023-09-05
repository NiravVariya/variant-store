import {
  Box,
  BoxProps,
  Stack,
  Text,
} from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/router'

type ImageWithOverlayProps = BoxProps & {
  title: string
  description?: string
  url?: string
  alt?: string
  src: string
  spacing?: string
  currentData?: any
}

export const ImageWithOverlay = (props: ImageWithOverlayProps) => {
  const {
    title,
    description,
    currentData,
    url,
    src,
    alt,
    spacing = '8',
    objectPosition = 'top',
    ...rest
  } = props

  const router = useRouter();

  return (
    <Box
      borderRadius="xl"
      overflow="hidden"
      position="relative"
      width="full"
      cursor={"pointer"}
      {...rest}
      onClick={() => {
        router.push(`/allproducts?id=${currentData.catId}&subCatId=${currentData.subCatId}`);
      }}
    >
      <Stack className='homeCateImg'>
        <Image
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "objectPosition" }}
          width={100}
          height={100}
          unoptimized
        />
      </Stack>
      <Box
        position="absolute"
        inset="0"
        bgGradient="linear(to-t, blackAlpha.300 20%, blackAlpha.700)"
        px={{ base: '6', md: '10' }}
        py={{ base: '6', md: '10' }}
        boxSize="full"
        display={"flex"}
        justifyContent={"center"}
      >
        <Stack spacing={spacing} alignItems={"center"} justifyContent={"center"}>
          <Stack spacing="4">
            <Text
              textAlign={"center"}
              fontSize={"xl"}
              color="white"
              textTransform={"capitalize"}
              fontWeight="extrabold"
            >
              {title}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}
