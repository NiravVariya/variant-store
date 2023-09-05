import useTranslation from '@/hooks/useTranslation';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HiChevronRight } from 'react-icons/hi'

type ProductBreadcrumbProps = {
  data: Array<{ label: string; slug: string }>
}

export const ProductBreadcrumb = (props: ProductBreadcrumbProps) => {
  const { data } = props
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Breadcrumb
      fontSize="sm"
      fontWeight="medium"
      color={mode('gray.600', 'gray.400')}
      separator={<Box as={HiChevronRight} color={mode('gray.400', 'gray.600')} />}
    >
      {/* {data.map((breadcrumb, index) => ( */}
      <BreadcrumbItem
      // key={breadcrumb.slug} isCurrentPage={index === data.length - 1}
      >
        <BreadcrumbLink as={Link} href={"/"}>{t("AllProducts.Home")}</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem
      // key={breadcrumb.slug} isCurrentPage={index === data.length - 1}
      >
        <BreadcrumbLink as={Link} href={router.pathname}>{router.pathname == "/allproducts" ? t("AllProducts.AllProducts") : t("AllProducts.Mostselling")}</BreadcrumbLink>
      </BreadcrumbItem>
      {/* // ))} */}
    </Breadcrumb>
  )
}
