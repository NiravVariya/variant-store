import { db } from '@/firebase/client'
import useTranslation from '@/hooks/useTranslation'
import { setCart } from '@/store'
import {
  Center,
  Flex,
  FormControl,
  FormControlProps,
  FormLabel,
  IconButton,
  IconButtonProps,
  Text,
  useControllableState,
  UseControllableStateProps,
} from '@chakra-ui/react'
import { doc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { useDispatch } from 'react-redux'

interface QuantityPickerProps extends UseControllableStateProps<number> {
  max?: number
  min?: number
  rootProps?: FormControlProps
  cartDocId?: any
  userDocid?: any
  carts?: any
  index?: number
}

export const QuantityPicker = (props: QuantityPickerProps) => {
  const { min = 1, max, rootProps, cartDocId, userDocid, carts, index, ...rest } = props
  const [MinusButtonDisabled, setMinusButtonDisabled] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [UID, setUID] = useState("");
  const [value, setValue] = useControllableState(rest)

  useEffect(() => {
    setUID(localStorage.getItem("userId"))
  }, [])

  const handleDecrement = () => {
    setMinusButtonDisabled(true)
    setValue(value === min ? value : value - 1); updateQty(value - 1, '')
  }

  const handleIncrement = () => {
    setButtonDisabled(true)
    setValue(value === max ? value : value + 1); updateQty(value + 1, "increment")
  }

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const updateQty = async (dataValue: any, type: string) => {
    let updatedCartIs = structuredClone(carts)

    if (UID) {
      if (type == 'increment') {
        updatedCartIs.products[index].variantInfo.ChooseQty = dataValue
        updatedCartIs.AEDTotal += updatedCartIs.products[index].variantInfo.selectedVariantPrice.AEDPrice
        updatedCartIs.AEDSubTotal += updatedCartIs.products[index].variantInfo.selectedVariantPrice.AEDPrice
        updatedCartIs.USDTotal += updatedCartIs.products[index].variantInfo.selectedVariantPrice.USDPrice
        updatedCartIs.USDSubTotal += updatedCartIs.products[index].variantInfo.selectedVariantPrice.USDPrice
      } else {
        updatedCartIs.AEDTotal -= updatedCartIs.products[index].variantInfo.selectedVariantPrice.AEDPrice
        updatedCartIs.AEDSubTotal -= updatedCartIs.products[index].variantInfo.selectedVariantPrice.AEDPrice
        updatedCartIs.USDTotal -= updatedCartIs.products[index].variantInfo.selectedVariantPrice.USDPrice
        updatedCartIs.USDSubTotal -= updatedCartIs.products[index].variantInfo.selectedVariantPrice.USDPrice
        if (dataValue == 0) {
          updatedCartIs = updatedCartIs.products.filter((res: any, ind: number) => ind !== index)
        } else {
          updatedCartIs.products[index].variantInfo.ChooseQty = dataValue
        }
      }
      const newRef = doc(db, "storeUsers", userDocid, "cart", cartDocId)
      await updateDoc(newRef, {
        ...updatedCartIs
      }).then(() => {
        toast.success(t("ShoppingCart.QtyToastMsg"));

        setButtonDisabled(false)
        setMinusButtonDisabled(false)
      })
    }
    else {
      if (type == 'increment') {
        updatedCartIs.products[index].variantInfo.ChooseQty = dataValue
        updatedCartIs.AEDTotal += updatedCartIs.products[index].variantInfo.selectedVariantPrice.AEDPrice
        updatedCartIs.AEDSubTotal += updatedCartIs.products[index].variantInfo.selectedVariantPrice.AEDPrice
        updatedCartIs.USDTotal += updatedCartIs.products[index].variantInfo.selectedVariantPrice.USDPrice
        updatedCartIs.USDSubTotal += updatedCartIs.products[index].variantInfo.selectedVariantPrice.USDPrice
      } else {
        updatedCartIs.AEDTotal -= updatedCartIs.products[index].variantInfo.selectedVariantPrice.AEDPrice
        updatedCartIs.AEDSubTotal -= updatedCartIs.products[index].variantInfo.selectedVariantPrice.AEDPrice
        updatedCartIs.USDTotal -= updatedCartIs.products[index].variantInfo.selectedVariantPrice.USDPrice
        updatedCartIs.USDSubTotal -= updatedCartIs.products[index].variantInfo.selectedVariantPrice.USDPrice

        if (dataValue == 0) {
          updatedCartIs = updatedCartIs.products.filter((res: any, ind: number) => ind !== index)
        } else {
          updatedCartIs.products[index].variantInfo.ChooseQty = dataValue
        }
      }
      localStorage.setItem("cartData", JSON.stringify(updatedCartIs));
      dispatch(setCart({...updatedCartIs}));
      toast.success(t("ShoppingCart.QtyToastMsg"));

      setTimeout(() => {
        setButtonDisabled(false);
        setMinusButtonDisabled(false);
      }, 1500);
    }
  }

  return (
    <FormControl {...rootProps} width={{ base: "200px", md: "200px", lg: "150px", xl: "200px" }}>
      <FormLabel fontSize="sm" fontWeight="medium" textAlign={"center"}>
        {t("ShoppingCart.Quantity")}
      </FormLabel>
      <Flex
        borderRadius="base"
        px="2"
        py="0.4375rem"
        justifyContent="space-evenly"
      >
        <QuantityPickerButton
          onClick={handleDecrement}
          icon={<FiMinus />}
          isDisabled={value === min || MinusButtonDisabled}
          aria-label="Decrement"
        />
        <Center minW="2">
          <Text as="span" fontWeight="semibold" userSelect="none">
            {value}
          </Text>
        </Center>
        <QuantityPickerButton
          onClick={handleIncrement}
          icon={<FiPlus />}
          isDisabled={value === max || buttonDisabled}
          aria-label="Increment"
        />
      </Flex>
    </FormControl>
  )
}

const QuantityPickerButton = (props: IconButtonProps) => (
  <IconButton
    size="sm"
    fontSize="md"
    _focus={{ boxShadow: 'none' }}
    _focusVisible={{ boxShadow: 'outline' }}
    {...props}
  />
)
