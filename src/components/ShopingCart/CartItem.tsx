import { CloseButton, Flex } from '@chakra-ui/react'
import { PriceTag } from './PriceTag'
import { CartProductMeta } from './CartProductMeta'
import { QuantityPicker } from './QuantityPicker'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import useTranslation from '@/hooks/useTranslation'

type CartItemProps = {
  isGiftWrapping?: boolean
  ProductName: any
  mainImage: string
  Description: any
  ProductPrice: any
  quantity: number
  price: number
  currency: string
  ChooseQty: number
  id: string
  variantInfo: any
  userDocid: string
  cartDocId: string
  index: any
  cardData: any
  isDisable: any
  onChangeQuantity?: (quantity: number) => void
  onClickGiftWrapping?: () => void
  onClickDelete?: () => void
  onDelete?: (id: string) => void
}

export const CartItem = (props: CartItemProps) => {
  const {
    isGiftWrapping,
    ProductName,
    Description,
    ProductPrice,
    mainImage,
    variantInfo,
    userDocid,
    cartDocId,
    ChooseQty,
    index,
    cardData,
    onDelete,
    isDisable
  } = props
  const { locale } = useRouter();
  const reduxData = useSelector((state: any) => state.icon);
  const currencyData = localStorage.getItem("currency");
  const currencyPrice = !currencyData ? "USDPrice" : currencyData == "USD" ? "USDPrice" : "AEDPrice";
  const { t } = useTranslation();

  return (
    <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: "start", md: "center" }}>
      <CloseButton
        _hover={{ background: "transparent" }}
        aria-label={`Delete ${name} from cart`}
        isDisabled={isDisable == true ? true : false}
        onClick={() => onDelete(index)}
        display={{ base: "flex", md: "none" }}
        justifyContent={'end'}
        width="100%"
        position={"absolute"}
        right="25px"
      />
      <CartProductMeta
        name={ProductName && ProductName[locale]}
        description={Description && Description[locale]}
        image={variantInfo.img == "" ? mainImage : variantInfo.img}
        size={variantInfo.selectedSize}
        color={variantInfo.selectedColor}
        isGiftWrapping={isGiftWrapping}
      />


      {/* Desktop */}
      <Flex justify="space-between" display={{ base: 'none', md: 'flex' }}>
        <QuantityPicker
          defaultValue={variantInfo.ChooseQty}
          max={10}
          carts={cardData}
          userDocid={userDocid}
          cartDocId={cartDocId}
          index={index}
        />
        <PriceTag
          // price={ProductPrice[!currencyData ? "USD" : currencyData == "USD" ? "USD" : "AED"]}
          price={variantInfo.selectedVariantPrice[currencyPrice]}
          currency={reduxData.currency == "USD" ? "USD" : reduxData.currency}
        />
        <CloseButton
          isDisabled={isDisable == true ? true : false}
          aria-label={`Delete ${name} from cart`}
          onClick={() => onDelete(index)}
        />
      </Flex>

      {/* Mobile */}
      <Flex
        mt="4"
        align="center"
        width="full"
        justify="space-between"
        display={{ base: 'flex', md: 'none' }}
      >
        <QuantityPicker
          defaultValue={variantInfo.ChooseQty}
          max={10}
          carts={cardData}
          userDocid={userDocid}
          cartDocId={cartDocId}
          index={index}
        />
        <PriceTag
          price={variantInfo.selectedVariantPrice[currencyPrice]}
          currency={reduxData.currency == "USD" ? "USD" : reduxData.currency}
        />
      </Flex>
    </Flex>
  )
}
