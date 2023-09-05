import useTranslation from "@/hooks/useTranslation";
import { Button, HStack } from "@chakra-ui/react";

export type FilterActionButtonsProps = {
  onClickCancel?: VoidFunction;
  isCancelDisabled?: boolean;
  onClickApply?: VoidFunction;
};

export const FilterActionButtons = (props: FilterActionButtonsProps) => {
  const { onClickApply, onClickCancel, isCancelDisabled } = props;
  const { t } = useTranslation();
  return (
    <HStack spacing="2" justify="space-between">
      <Button
        size="sm"
        variant="ghost"
        onClick={onClickCancel}
        isDisabled={isCancelDisabled}
      >
        {t("AllProducts.Cancel")}
      </Button>
      <Button
        size="sm"
        colorScheme="blue"
        onClick={onClickApply}
        bgColor={"primaryColor"}
        _hover={{ bgColor: "#384878" }}
      >
        {t("AllProducts.Save")}
      </Button>
    </HStack>
  );
};
