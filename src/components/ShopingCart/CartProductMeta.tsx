import {
  Box,
  Flex,
  HStack,
  Icon,
  Link,
  Stack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import Image from 'next/image'
import { FiGift } from 'react-icons/fi'

export type CartProductMetaProps = {
  isGiftWrapping?: boolean
  name: string
  description: string
  image: string
  size: any
  color: string
}

export const CartProductMeta = (props: CartProductMetaProps) => {
  const { isGiftWrapping = true, image, name, description, size, color } = props
  return (
    <Stack direction="row" spacing="6" width="auto">
      <Image
        width={100}
        height={100}
        style={{ height: "110px", objectFit: "cover" }}
        src={image}
        alt={name}
        draggable="false"
        loading="lazy"
      />
      <Box pt="4">
        <Stack spacing="0.5" width="150px">
          <Text fontWeight="medium">{name}</Text>
          <Text color={mode('gray.600', 'gray.400')} fontSize="sm">
            {description.split(" ").slice(0, 8).join(" ") + "..."}
          </Text>
        </Stack>
      </Box>
      <Box width="180px" display={"flex"} justifyContent={"center"} flexDirection={"column"} alignItems={"center"}>
          {size === "" ? null : (
            <Text fontSize={"sm"}>Size:{size}</Text>
          )}
          {color === "" ? null : (
            <Text fontSize={"sm"}>Color:{color}</Text>
          )}
      </Box >
    </Stack >
  )
}
