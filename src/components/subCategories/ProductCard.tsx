import { setCategorie, setSubCategorie } from '@/store';
import {
    AspectRatio,
    Box,
    Skeleton,
    Stack,
    Text,
} from '@chakra-ui/react'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

export const ProductCard = (props: any) => {
    const { product, categorieId } = props;
    const { locale } = useRouter();
    const router = useRouter();
    const dispatch = useDispatch();

    return (
        <Stack border={'3px solid rgba(0, 0, 0, 0.05)'} borderRadius={'4px'} cursor={"pointer"}>
            <Box position="relative" className="group" >
                <AspectRatio ratio={1} className="productCard">
                    <Image
                        src={product.image}
                        alt={product.subcategory.en}
                        draggable="false"
                        width={100}
                        height={100}
                        unoptimized
                        onClick={() => {
                            router.push(`/allproducts?id=${categorieId}&subCatId=${product.id}`);
                            dispatch(setSubCategorie(product.subcategory[locale]));
                        }}
                    />
                </AspectRatio>
            </Box>
            <Stack textAlign={'center'} py={{ base: "6", md: "8", lg: "6" }} m={0}>
                <Text>{product.subcategory[locale]}</Text>
            </Stack>
        </Stack>
    )
}