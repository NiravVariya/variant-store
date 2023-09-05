import useTranslation from '@/hooks/useTranslation';
import { setSortValue } from '@/store';
import { Select, useColorModeValue } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';

export const SortbySelect = (props: any) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const reduxData = useSelector((state: any) => state.icon);
  props.setSortSelectOption(reduxData.sortValue)


  const sortByOptions = {
    // defaultValue: t("AllProducts.DefaultOption"),
    options: [
      { label: t("AllProducts.BestSeller"), value: 'best-seller' },
      { label: t("AllProducts.Trending"), value: 'Trending' },
      { label: t("AllProducts.Price:LowToHigh"), value: 'low-to-high' },
      { label: t("AllProducts.Price:HighToLow"), value: 'high-to-low' },
    ],
  }
  return (
    <Select
      cursor={"pointer"}
      size="lg"
      aria-label="Sort by"
      fontSize={15.5}
      // defaultValue={sortByOptions.defaultValue}
      focusBorderColor={useColorModeValue('blue.500', 'blue.200')}
      rounded="md"
      {...props}
      value={props.sortSelectOption}
      onChange={(e: any) => {
        props.setSortSelectOption(e.target.value);
        dispatch(setSortValue(e.target.value));
        props.setclearButton(true)
      }}
    >
      <option selected disabled value="">
        {t("AllProducts.DefaultOption")}
      </option>
      {sortByOptions.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}
