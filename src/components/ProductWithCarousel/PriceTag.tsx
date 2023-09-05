import { HStack, StackProps, Text, TextProps, useColorModeValue as mode } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { useSelector } from 'react-redux'

interface PriceTagProps {
  currency: string
  price: number
  salePrice?: number
  rootProps?: StackProps
  priceProps?: TextProps
  salePriceProps?: TextProps
}

export type FormatPriceOptions = { locale?: string; currency?: string }

export function FormatPrice(value: number, opts: { locale?: string; currency?: string } = {}) {
  const reduxData = useSelector((state: any) => state.icon);
  const { locale = 'en-US', currency = reduxData.currency == "USD" ? 'USD' : reduxData.currency } = opts
  const formatter = new Intl.NumberFormat(locale, {
    currency: currency ? currency : "USD",
    style: 'currency',
    maximumFractionDigits: 2,
  })
  return formatter.format(value)
}

export const PriceTag = (props: PriceTagProps) => {
  const { price, currency, salePrice, rootProps, priceProps, salePriceProps } = props
  return (
    <HStack spacing="1" {...rootProps}>
      <Price isOnSale={!!salePrice} textProps={priceProps}>
        {FormatPrice(price, { currency })}
      </Price>
      {salePrice && (
        <SalePrice {...salePriceProps}>{FormatPrice(salePrice, { currency })}</SalePrice>
      )}
    </HStack>
  )
}

interface PriceProps {
  children?: ReactNode
  isOnSale?: boolean
  textProps?: TextProps
}

const Price = (props: PriceProps) => {
  const { isOnSale, children, textProps } = props
  const defaultColor = mode('gray.700', 'gray.400')
  const onSaleColor = mode('gray.400', 'gray.700')
  const color = isOnSale ? onSaleColor : defaultColor
  return (
    <Text
      as="span"
      fontWeight="medium"
      color={color}
      textDecoration={isOnSale ? 'line-through' : 'none'}
      {...textProps}
    >
      {children}
    </Text>
  )
}

const SalePrice = (props: TextProps) => (
  <Text as="span" fontWeight="semibold" color={mode('gray.800', 'gray.100')} {...props} />
)
