import {
  ButtonGroup,
  Icon,
  IconButton,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const options = [
  {
    icon: FiEdit,
    label: "edit",
  },
  {
    icon: MdDelete,
    label: "delete",
  },
];

export const CategoriesButtonGroup = (props: any) => {
  const iconColor = useColorModeValue("gray.600", "gray.400");
  return (
    <ButtonGroup
      variant="ghost"
      colorScheme="blue"
      width="full"
      size="sm"
      spacing="1"
    >
      {options.map((option) => (
        <Tooltip hasArrow label={option.label} bg="#319795" key={option.label}>
          <IconButton
            
            rounded="sm"
            sx={{ ":not(:hover)": { color: iconColor } }}
            _focus={{ boxShadow: "none" }}
            _focusVisible={{ boxShadow: "outline" }}
            width="full"
            aria-label={option.label}
            icon={<Icon as={option.icon} boxSize="5" />}
            onClick={
              option.label == "edit" ? props.handleClick : props.handleDelete
            }
          />
        </Tooltip>
      ))}
    </ButtonGroup>
  );
};
