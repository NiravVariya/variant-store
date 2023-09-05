import { db, storage } from "@/firebase/client";
import { Box, Button, CloseButton, Divider, Flex, FormControl, FormHelperText, Input, Select, Spinner, Stack, Text, Textarea } from "@chakra-ui/react"
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import randomstring from "randomstring";
import {
    collection,
    doc,
    getDoc,
    updateDoc,
    onSnapshot,
    serverTimestamp,
    query,
} from "firebase/firestore";
import WithAuth from "@/auth/withAuth";
import USER_TYPE from "@/auth/constans";
import { toast } from "react-hot-toast";
import EditVarients from "@/components/Admin/EditVarients";
import { useSelector } from "react-redux";

function ProductId() {
    const router = useRouter();
    const hiddenFileInput = React.useRef(null);
    let { productId } = router.query;
    const [Categories, setCategories] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [productData, setProductData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isImgLoading, setIsImgLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [categorieName, setCategorieName] = useState("");
    const [subCategorieName, setSubCategorieName] = useState("");
    const [categorieId, setCategorieId] = useState("");
    const [subCategorieId, setSubCategorieId] = useState("");
    const [storeDocId, setStoreDocId] = useState("")
    const [secondCurrency, setSecondCurrency] = useState("")
    const [fetchVariants, setFetchVariants] = useState([]);
    const [fetchVariantsCombination, setFetchVariantsCombination] = useState([]);
    const [productError, setProductError] = useState({
        ProductName: { en: "", ar: "" },
        ProductPrice: { USD: "", AED: "" },
        Description: { en: "", ar: "" },
        AvgRating: 0,
        Images: "",
    });

    const reduxData = useSelector((state) => state.icon);
    const variantCombinationData = reduxData.variantCombinationList;
    const variantData = reduxData.variantList;

    const fetchAllService = async () => {
        const categoryQuery = collection(db, "Categories");
        await onSnapshot(categoryQuery, (categorySnapshot) => {
            const categoryarr = [];
            categorySnapshot.docs.map((category) => {
                categoryarr.push({ ...category.data(), id: category.id });
            });
            setCategories(categoryarr);
        });
    };

    const fetchSubcategory = (item) => {
        const refquery = collection(db, "Categories", item, "Subcategory");
        onSnapshot(refquery, (querydata) => {
            setSubCategory(
                querydata.docs.map((docvalue) => ({
                    ...docvalue.data(),
                    id: docvalue.id,
                }))
            );
        });
    };

    const fetchProductData = () => {
        const docRef = collection(db, "storeProducts");
        const result = query(docRef);
        onSnapshot(result, (querySnapshot) => {
            querySnapshot.docs.map(async (item) => {
                if (item.id === productId) {
                    const getCategoryData = await getDoc(item.data().categorieRef);
                    const getSubCategoryData = await getDoc(item.data().subCategorieRef);
                    setCategorieName(getCategoryData.data().category.en);
                    setSubCategorieName(getSubCategoryData.data().subcategory.en);
                    setCategorieId(item.data().categorieId);
                    setSubCategorieId(item.data().subCategorieId);
                    setProductData(item.data());
                    setImages(item.data().ProductImage);
                    fetchSubcategory(item.data().categorieId);
                    setFetchVariants(item.data().variants);
                    setFetchVariantsCombination(item.data().variantCombination);
                }
            });
        });
    };

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    useEffect(() => {
        fetchAllService();
        if (productId) {
            fetchProductData();
        }
    }, [productId]);

    const handleDeleteImage = (id) => {
        const newArrayImg = images.filter((data, index) => index !== id);
        setImages(newArrayImg);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onProductSubmit = async (e) => {
        if (productData.ProductName.en == "") {
            setProductError({
                ...productError,
                ProductName: { en: "Please enter product name", ar: "" },
            });
        } else if (productData.ProductName.ar == "") {
            setProductError({
                ...productError,
                ProductName: { en: "", ar: "Please enter product name in arabic" },
            });
        } else if (productData.Description.en == "") {
            setProductError({
                ...productError,
                Description: { en: "Please enter product description", ar: "" },
            });
        } else if (productData.Description.ar == "") {
            setProductError({
                ...productError,
                Description: {
                    en: "",
                    ar: "Please enter product description in arabic",
                },
            });
        } else if (categorieName == "") {
            setProductError({
                ...productError,
                Category: "Please select a category",
            });
        } else if (subCategorieName == "") {
            setProductError({
                ...productError,
                SubCategory: "Please select a sub category",
            });
        } else if (productData.ProductPrice.USD == 0) {
            setProductError({
                ...productError,
                ProductPrice: {
                    USD: "Please enter product price in USD", AED: "",
                }
            });
        } else if (productData.ProductPrice.AED == 0) {
            setProductError({
                ...productError,
                ProductPrice: {
                    USD: "", AED: "Please enter product price in AED",
                }
            });
        } else if (images.length == 0) {
            setProductError({
                ...productError,
                Images: "Please enter at least one image for the product",
            });
        } else if (variantCombinationData.length == 0) {
            toast.error("Please add product variants")
        } else {
            setIsLoading(true);

            const updateRef = doc(db, "storeProducts", productId);
            console.log("updateRef", updateRef);

            await updateDoc(updateRef, {
                ...productData,
                ProductImage: images,
                mainImage: images[0],
                categorieId: categorieId,
                categorieRef: doc(db, "Categories", categorieId),
                subCategorieId: subCategorieId,
                variantCombination: variantCombinationData,
                variants: variantData,
                subCategorieRef: doc(
                    db,
                    "Categories",
                    categorieId,
                    "Subcategory",
                    subCategorieId
                ),
                updatedAt: serverTimestamp(),
            }).then(() => {
                toast.success("Product Update Successfully");
                setIsLoading(false);
                router.push("/admin/products");
            });
        }
    };

    const settingStoreRef = collection(db, "storeSetting");
    onSnapshot(settingStoreRef, (settingSnap) => {
        settingSnap.docs.map((value) => {
            const dataref = doc(db, "storeSetting", value.id);
            setStoreDocId(dataref.id);
        });
    });

    useEffect(() => {
        if (storeDocId) {
            const newdocRef = collection(db, "storeSetting", storeDocId, "Currencies");
            onSnapshot(newdocRef, (querydata) => {
                setSecondCurrency(querydata.docs[0].data().mainCurrency)
            });
        }
    }, [storeDocId])

    return (
        <Stack>
            <form onSubmit={handleSubmit(onProductSubmit)}>
                <Flex gap={10} flexDirection={{ base: "column", md: "row" }}>
                    <Box width={{ base: "auto", md: "60%" }}>
                        <Box
                            bg={"bg-surface"}
                            p={8}
                        >
                            <Flex flexDirection={"column"}>
                                <FormControl>
                                    <Text mb="8px">Product Name:</Text>
                                    <Input
                                        value={productData.ProductName && productData.ProductName.en}
                                        onChange={(e) => {
                                            setProductData({
                                                ...productData,
                                                ProductName: { en: e.target.value, ar: "" },
                                            });
                                            setProductError({
                                                ...productError,
                                                ProductName: { en: "", ar: "" },
                                            });
                                        }}
                                        borderColor={productError.ProductName.en ? "red" : "inherit"}
                                        placeholder="Product Name"
                                        size="lg"
                                    />
                                    <FormHelperText style={{ color: "red" }}>
                                        {productError.ProductName.en
                                            ? productError.ProductName.en
                                            : ""}
                                    </FormHelperText>
                                </FormControl>
                            </Flex>
                            <Flex flexDirection={"column"} mt={3}>
                                <FormControl>
                                    <Text mb="8px">Product Name (Arabic):</Text>
                                    <Input
                                        value={productData.ProductName && productData.ProductName.ar}
                                        onChange={(e) => {
                                            setProductData({
                                                ...productData,
                                                ProductName: {
                                                    en: productData.ProductName.en,
                                                    ar: e.target.value,
                                                },
                                            });
                                            setProductError({
                                                ...productError,
                                                ProductName: { en: "", ar: "" },
                                            });
                                        }}
                                        borderColor={productError.ProductName.ar ? "red" : "inherit"}
                                        placeholder="Product Name"
                                        size="lg"
                                    />
                                    <FormHelperText style={{ color: "red" }}>
                                        {productError.ProductName.ar
                                            ? productError.ProductName.ar
                                            : ""}
                                    </FormHelperText>
                                </FormControl>
                            </Flex>
                            <Flex flexDirection={"column"} mt={3}>
                                <FormControl>
                                    <Text mb="8px">Description :</Text>
                                    <Textarea
                                        onChange={(e) => {
                                            setProductData({
                                                ...productData,
                                                Description: {
                                                    en: e.target.value,
                                                    ar: "",
                                                },
                                            });
                                            setProductError({
                                                ...productError,
                                                Description: { en: "", ar: "" },
                                            });
                                        }}
                                        placeholder="Description"
                                        borderColor={productError.Description.en ? "red" : "inherit"}
                                        size="lg"
                                        value={productData.Description && productData.Description.en}
                                        height={200}
                                    />
                                    <FormHelperText style={{ color: "red" }}>
                                        {productError.Description.en
                                            ? productError.Description.en
                                            : ""}
                                    </FormHelperText>
                                </FormControl>
                            </Flex>
                            <Flex flexDirection={"column"} mt={3}>
                                <FormControl>
                                    <Text mb="8px">Description (Arabic):</Text>
                                    <Textarea
                                        onChange={(e) => {
                                            setProductData({
                                                ...productData,
                                                Description: {
                                                    en: productData.Description.en,
                                                    ar: e.target.value,
                                                },
                                            });
                                            setProductError({
                                                ...productError,
                                                Description: { en: "", ar: "" },
                                            });
                                        }}
                                        placeholder="Description"
                                        borderColor={productError.Description.en ? "red" : "inherit"}
                                        size="lg"
                                        value={productData.Description && productData.Description.ar}
                                        height={200}
                                    />
                                    <FormHelperText style={{ color: "red" }}>
                                        {productError.Description.ar
                                            ? productError.Description.ar
                                            : ""}
                                    </FormHelperText>
                                </FormControl>
                            </Flex>
                        </Box>
                        <Box
                            bg={"bg-surface"}
                            p={8}
                            mt={4}
                        >
                            <Text>Media</Text>
                            <FormControl>
                                <Flex border={"dotted"} borderRadius={"lg"} borderColor={'inherit'} p={50} mt={2.5} flexDirection={"column"}>
                                    <Flex alignItems={"center"} flexDirection={"column"}>
                                        <Button size="md" variant="primary" onClick={handleClick} width={"-webkit-fit-content"}>
                                            Add Images
                                            <input
                                                ref={hiddenFileInput}
                                                onChange={async (e) => {
                                                    const files = e.target.files;
                                                    console.log("files", files);
                                                    for (const file of files) {
                                                        setIsImgLoading(true);
                                                        const storageRef = ref(
                                                            storage,
                                                            `/ProductImage/${randomstring.generate()}`
                                                        );
                                                        await uploadBytes(storageRef, file);
                                                        const url = await getDownloadURL(storageRef);
                                                        images.push(url);
                                                        setIsImgLoading(false);
                                                    }
                                                    setProductError({
                                                        ...productError,
                                                        Images: "",
                                                    });
                                                }}
                                                type="file"
                                                hidden
                                                id="fileButton"
                                                data-testid="file-upload-input"
                                                multiple
                                                accept=".jpg, .jpeg, .png"
                                            />
                                        </Button>
                                        <Text textAlign={"center"} mt={3}>Accepts PNG, JPG, JPEG, SVG</Text>
                                    </Flex>
                                    {/* </FormControl> */}
                                    <Flex gap="2" display={"flex"} flexDirection={"row"}>
                                        {isImgLoading ? (
                                            <Spinner />
                                        ) : (
                                            images &&
                                            images.map((item, index) => (
                                                <>
                                                    <Box key={index} paddingTop="5" position={"relative"}>
                                                        <CloseButton
                                                            size="sm"
                                                            position={"absolute"}
                                                            zIndex={1}
                                                            onClick={() => handleDeleteImage(index)}
                                                            bg={"#fff"}
                                                            borderRadius={0}
                                                        />
                                                        <Image
                                                            src={item}
                                                            alt="preview of seleted image"
                                                            width={100}
                                                            height={100}
                                                            style={{
                                                                borderRadius: "10px",
                                                                height: 100,
                                                            }}
                                                        />
                                                    </Box>
                                                </>
                                            ))
                                        )}
                                    </Flex>
                                </Flex>
                                <FormHelperText style={{ color: "red" }}>
                                    {productError.Images ? productError.Images : ""}
                                </FormHelperText>
                            </FormControl>
                        </Box>
                        <EditVarients
                            fetchVariants={fetchVariants}
                            fetchVariantsCombination={fetchVariantsCombination}
                            USDPrice={productData.ProductPrice?.USD}
                            AEDPrice={productData.ProductPrice?.AED}
                        />
                    </Box>
                    <Box width={{ base: "auto", md: "38%" }}>
                        <Box
                            bg={"bg-surface"}
                            p={8}
                            display={"flex"}
                            flexDirection={"column"}
                            height={"-webkit-fit-content"}
                            gap={4}
                        >
                            <Stack>
                                <FormControl>
                                    <Select
                                        size="lg"
                                        borderColor={productError.Category ? "red" : "inherit"}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setCategorieName(Categories[val].category.en);
                                            setCategorieId(Categories[val].id);
                                            fetchSubcategory(Categories[val].id);
                                            setProductError({
                                                ...productError,
                                                Category: "",
                                            });
                                        }}
                                    >
                                        <option selected disabled>
                                            Select Category
                                        </option>
                                        {Categories &&
                                            Categories.map((value, index) => (
                                                <option
                                                    value={index}
                                                    key={index}
                                                    selected={
                                                        categorieName == value.category.en ? true : false
                                                    }
                                                >
                                                    {value.category.en}
                                                </option>
                                            ))}
                                    </Select>
                                    <FormHelperText style={{ color: "red" }}>
                                        {productError.Category ? productError.Category : ""}
                                    </FormHelperText>
                                </FormControl>
                            </Stack>
                            <Stack>
                                <FormControl>
                                    <Select
                                        size="lg"
                                        borderColor={productError.SubCategory ? "red" : "inherit"}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setSubCategorieName(subCategory[val].subcategory.en);
                                            setSubCategorieId(subCategory[val].id);
                                            setProductError({
                                                ...productError,
                                                SubCategory: "",
                                            });
                                        }}
                                    >
                                        <option selected disabled value="">
                                            Select Sub Category
                                        </option>
                                        {subCategory &&
                                            subCategory.map((value, index) => (
                                                <option
                                                    value={index}
                                                    key={index}
                                                    selected={
                                                        subCategorieName == value.subcategory.en
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    {value.subcategory.en}
                                                </option>
                                            ))}
                                    </Select>
                                    <FormHelperText style={{ color: "red" }}>
                                        {productError.SubCategory ? productError.SubCategory : ""}
                                    </FormHelperText>
                                </FormControl>
                            </Stack>
                        </Box>
                        <Box
                            bg={"bg-surface"}
                            p={8}
                            mt={4}
                        >
                            <FormControl>
                                <Text mb="8px">Product Price in USD:</Text>
                                <Input
                                    ms={0.5}
                                    name="ProductPrice"
                                    type="number"
                                    placeholder="Product Price"
                                    borderColor={productError.ProductPrice.USD ? "red" : "inherit"}
                                    size="lg"
                                    value={productData.ProductPrice && productData.ProductPrice.USD}
                                    // {...register("ProductPrice")}
                                    onChange={(e) => {
                                        setProductData({
                                            ...productData,
                                            ProductPrice: {
                                                USD: Number(e.target.value),
                                                AED: ""
                                            }
                                        });
                                        setProductError({
                                            ...productError,
                                            ProductPrice: "",
                                        });
                                    }}
                                />
                                <FormHelperText style={{ color: "red" }}>
                                    {productError.ProductPrice.USD ? productError.ProductPrice.USD : ""}
                                </FormHelperText>
                            </FormControl>
                            <FormControl mt={3}>
                                <Text mb="8px">Product Price in {secondCurrency ? secondCurrency : "AED"}:</Text>
                                <Input
                                    ms={0.5}
                                    name="ProductPrice"
                                    type="number"
                                    placeholder="Product Price"
                                    borderColor={productError.ProductPrice.AED ? "red" : "inherit"}
                                    size="lg"
                                    value={productData.ProductPrice && productData.ProductPrice.AED}
                                    // {...register("ProductPrice")}
                                    onChange={(e) => {
                                        setProductData({
                                            ...productData,
                                            ProductPrice: {
                                                USD: productData.ProductPrice.USD,
                                                AED: Number(e.target.value),
                                            }
                                        });
                                        setProductError({
                                            ...productError,
                                            ProductPrice: "",
                                        });
                                    }}
                                />
                                <FormHelperText style={{ color: "red" }}>
                                    {productError.ProductPrice.AED ? productError.ProductPrice.AED : ""}
                                </FormHelperText>
                            </FormControl>
                        </Box>
                    </Box>
                </Flex>
                <Divider py={4} />
                <Flex justifyContent={"flex-end"} mt={2}>
                    <Button variant="primary" type="submit">
                        {isLoading ? <Spinner /> : "Save"}
                    </Button>
                </Flex>
            </form>
        </Stack >
    )
}
export default WithAuth(ProductId, USER_TYPE.Admin);