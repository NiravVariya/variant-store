import { Box, Popover } from '@chakra-ui/react'
import { PriceRangePicker } from './PriceRangePicker'
import { FormatPrice } from './PriceTag'
import { FilterPopoverButton, FilterPopoverContent } from './FilterPopover'
import { useFilterState } from './useFilterState'
import { priceFilter } from './_data'
import { useDispatch } from 'react-redux'
import { setRange } from '@/store'
import useTranslation from '@/hooks/useTranslation'

export const PriceFilterPopover = (props: any) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const state: any = useFilterState({
    defaultValue: priceFilter.defaultValue,
    onSubmit: (data: any) => {
      dispatch(setRange(data))
      props.setclearButton(true)
    },
  })

  return (
    <Popover placement="bottom-start">
      <FilterPopoverButton label={t("AllProducts.Price")} />

      <FilterPopoverContent
        isCancelDisabled={!state.canCancel}
        onClickApply={state.onSubmit}
        onClickCancel={state.onReset}
      >
        <Box px="2" pt="2">
          <PriceRangePicker
            step={10}
            min={priceFilter.min}
            max={priceFilter.max}
            value={state.value}
            onChange={state.onChange}
          />
          <Box as="output" mt="2" fontSize="sm">
            {state.value?.map((v: any) => FormatPrice(v)).join(' — ')}
          </Box>
        </Box>
      </FilterPopoverContent>
    </Popover>
  )
}
