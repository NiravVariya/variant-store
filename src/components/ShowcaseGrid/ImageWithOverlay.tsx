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
  categoryID: string
}

export const ImageWithOverlay = (props: ImageWithOverlayProps) => {
  const {
    title,
    description,
    url,
    src,
    alt,
    categoryID,
    spacing = '8',
    objectPosition = 'top',
    ...rest
  } = props

  const router = useRouter();

  return (
    <Box borderRadius="xl"
      overflow="hidden"
      position="relative"
      width="full"
      {...rest}
      cursor={"pointer"}
      onClick={() => {
        router.push(`/allproducts?id=${props.categoryID}`);
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
      </Box>
    </Box>
  )
}
