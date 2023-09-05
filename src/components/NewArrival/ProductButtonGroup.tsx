import {
  ButtonGroup,
  Icon,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import { FiEye, FiHeart, FiShoppingCart } from "react-icons/fi";

const options = [
  {
    icon: FiHeart,
    label: "Add to favourite",
    href: "/wishlist"
  },
  // {
  //   icon: FiShoppingCart,
  //   label: "Add to cart",
  //   href: "/productcheckout",
  // },
  // {
  //   icon: FiEye,
  //   label: 'View details',
  // },
];

export const ProductButtonGroup = (props: any) => {

  // const iconColor = useColorModeValue("gray.600", "gray.400");
  return (
    <ButtonGroup
      variant=""
      colorScheme="blue"
      width="full"
      size="sm"
      spacing="1"
    >
      {options.map((option) => {
        return (
          <IconButton
            key={option.label}
            rounded="sm"
            sx={{ color: option.label == "Add to favourite" && props.isWhishList ? "red" : "" }}
            _focus={{ boxShadow: "none" }}
            _focusVisible={{ boxShadow: "outline" }}
            width="full"
            aria-label={option.label}
            icon={<Icon as={option.label == "Add to favourite" && props.isWhishList ? FaHeart : option.icon} boxSize="5" />}
            onClick={option.label === "Add to cart" ? props.handleClick : props.addWishList}
          />
        )
      })}
    </ButtonGroup>
  );
};
