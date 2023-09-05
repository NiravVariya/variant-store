import { db, storage } from "@/firebase/client";
import { Box, Button, CloseButton, Divider, Flex, FormControl, FormHelperText, Input, Select, Spinner, Stack, Text, Textarea } from "@chakra-ui/react"
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import randomstring from "randomstring";
import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import WithAuth from "@/auth/withAuth";
import USER_TYPE from "@/auth/constans";
import AddVarients from "@/components/Admin/AddVarients";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

type Inputs = {
    Category: string;
    SubCategory: string;
    ProductName: string;
    ProductPrice: number;
    Description: string;
};

function Addproduct(props: any) {
    const router = useRouter();
    const [Categories, setCategories] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [fileArray, setFileArray] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [categorieId, setCategorieId] = useState("");
    const [storeDocId, setStoreDocId] = useState("")
    const [secondCurrency, setSecondCurrency] = useState("")
    const [subCategorieId, setSubCategorieId] = useState("");
    const hiddenFileInput = React.useRef(null);
    let filepreview: any = [];
    let imageView: any = [];
    const [productData, setProductData] = useState({
        ProductName: { en: "", ar: "" },
        ProductPrice: { USD: 0, AED: 0 },
        Description: { en: "", ar: "" },
        AvgRating: 0,
    });
    const [productError, setProductError] = useState({
        ProductName: { en: "", ar: "" },
        Category: "",
        SubCategory: "",
        ProductPrice: { USD: "", AED: "" },
        Description: { en: "", ar: "" },
        AvgRating: 0,
        Images: "",
    });

    for (let i = 0; i < fileArray?.length; i++) {
        const newObject = URL.createObjectURL(fileArray[i]);
        imageView.push(newObject);
    }

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const reduxData = useSelector((state: any) => state.icon);
    let variantCombinationData = reduxData.variantCombinationList;
    let variantData = reduxData.variantList;

    const onProductSubmit: SubmitHandler<Inputs> = async (e: any) => {
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
        }
        else if (productData.Description.en == "") {
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
        } else if (categorieId == "") {
            setProductError({
                ...productError,
                Category: "Please select a category",
            });
        } else if (subCategorieId == "") {
            setProductError({
                ...productError,
                SubCategory: "Please select a sub category",
            });
        }
        else if (productData.ProductPrice.USD == 0) {
            setProductError({
                ...productError,
                ProductPrice: { USD: "Please enter product price", AED: "" },
            });
        } else if (productData.ProductPrice.AED == 0) {
            setProductError({
                ...productError,
                ProductPrice: { USD: "", AED: "Please enter product price" },
            });
        } else if (fileArray.length == 0) {
            setProductError({
                ...productError,
                Images: "Please enter at least one image for the product",
            });
        } else if (variantCombinationData.length == 0) {
            toast.error("Please add product variants")
        } else {
            setIsLoading(true);

            for (const file of fileArray) {
                const storageRef = ref(
                    storage,
                    `/ProductImage/${randomstring.generate()}`
                );
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                filepreview.push(url);
            }

            const newproductRef: any = doc(collection(db, "storeProducts"));
            await setDoc(newproductRef, {
                ...productData,
                ProductImage: filepreview,
                mainImage: filepreview[0],
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
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            }).then(() => {
                console.log("product Added successfully");
                setIsLoading(false);
                router.push("/admin/products");
            });
        }
    };

    const fetchAllService = async () => {
        const categoryQuery = collection(db, "Categories");
        await onSnapshot(categoryQuery, (categorySnapshot) => {
            const categoryarr: any = [];
            categorySnapshot.docs.map((category) => {
                categoryarr.push({ ...category.data(), id: category.id });
            });
            setCategories(categoryarr);
        });
    };

    const fetchSubcategory = (item: any) => {
        let id = Categories[item].id;

        const refquery = collection(db, "Categories", id, "Subcategory");
        onSnapshot(refquery, (querydata) => {
            setSubCategory(
                querydata.docs.map((docvalue) => ({
                    ...docvalue.data(),
                    id: docvalue.id,
                }))
            );
        });
    };

    const handleDeleteImage = (id: number) => {
        let newArra = Array.from(fileArray);
        let filterArray = newArra.filter((res: any, ind: number) => ind !== id);
        const newArrayImg = imageView.filter(
            (_: any, index: number) => index !== id
        );
        setFileArray(filterArray);
        imageView = newArrayImg;
    };

    useEffect(() => {
        fetchAllService();
    }, [props]);

    const settingStoreRef = collection(db, "storeSetting");
    onSnapshot(settingStoreRef, (settingSnap) => {
        settingSnap.docs.map((value) => {
            const dataref: any = doc(db, "storeSetting", value.id);
            setStoreDocId(dataref.id);
        });
    });

    useEffect(() => {
        if (storeDocId) {
            const newdocRef = collection(db, "storeSetting", storeDocId, "Currencies");
            onSnapshot(newdocRef, (querydata: any) => {
                setSecondCurrency(querydata.docs[0]?.data().mainCurrency)
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
                            p={6}
                        >
                            <Flex flexDirection={"column"}>
                                <FormControl>
                                    <Text mb="8px">Product Name:</Text>
                                    <Input
                                        ms={0.5}
                                        value={productData.ProductName.en}
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
                                        value={productData.ProductName.ar}
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
                                        ms={0.5}
                                        onChange={(e) => {
                                            setProductData({
                                                ...productData,
                                                Description: { en: e.target.value, ar: "" },
                                            });
                                            setProductError({
                                                ...productError,
                                                Description: { en: "", ar: "" },
                                            });
                                        }}
                                        placeholder="Description"
                                        borderColor={productError.Description.en ? "red" : "inherit"}
                                        size="lg"
                                        value={productData.Description.en}
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
                                        borderColor={productError.Description.ar ? "red" : "inherit"}
                                        size="lg"
                                        value={productData.Description.ar}
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
                            p={6}
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
                                                onChange={(e) => {
                                                    const files: any = e.target.files;
                                                    setFileArray(files);
                                                    setProductError({
                                                        ...productError,
                                                        Images: "",
                                                    });
                                                }}
                                                type="file"
                                                hidden
                                                accept=".jpg, .jpeg, .png"
                                                id="fileButton"
                                                data-testid="file-upload-input"
                                                multiple
                                            />
                                        </Button>
                                        <Text textAlign={"center"} mt={3}>Accepts PNG, JPG, JPEG, SVG</Text>
                                    </Flex>
                                    {/* </FormControl> */}
                                    <Flex gap="2" display={"flex"} flexDirection={"row"}>
                                        {imageView
                                            ? imageView.map((value: any, index: any) => (
                                                <Box key={index} paddingTop="5">
                                                    <CloseButton
                                                        size="sm"
                                                        position={"absolute"}
                                                        zIndex={1}
                                                        onClick={() => handleDeleteImage(index)}
                                                        bg={"#fff"}
                                                        borderRadius={0}
                                                    />
                                                    <Image
                                                        src={value}
                                                        alt="preview of seleted image"
                                                        width={100}
                                                        height={100}
                                                        style={{
                                                            borderRadius: "10px",
                                                            height: 100,
                                                        }}
                                                    />
                                                </Box>
                                            ))
                                            : ""}
                                    </Flex>
                                </Flex>
                                <FormHelperText style={{ color: "red" }}>
                                    {productError.Images ? productError.Images : ""}
                                </FormHelperText>
                            </FormControl>
                        </Box>
                        <AddVarients
                            secondCurrency={secondCurrency}
                            USDPrice={productData.ProductPrice.USD}
                            AEDPrice={productData.ProductPrice.AED}
                        />
                    </Box>
                    <Box width={{ base: "auto", md: "38%" }}>
                        <Box
                            bg={"bg-surface"}
                            p={6}
                            display={"flex"}
                            flexDirection={"column"}
                            height={"-webkit-fit-content"}
                            gap={4}
                        >
                            <Stack>
                                <FormControl>
                                    <Select
                                        size="lg"
                                        ms={0.5}
                                        borderColor={productError.Category ? "red" : "inherit"}
                                        onChange={(e: any) => {
                                            const val = e.target.value;
                                            setCategorieId(Categories[val].id);
                                            // setProductData({
                                            //   ...productData,
                                            //   Category: Categories[val].category.en,
                                            // });
                                            setProductError({
                                                ...productError,
                                                Category: "",
                                            });
                                            fetchSubcategory(val);
                                        }}
                                    >
                                        <option selected disabled value="">
                                            Select Category
                                        </option>
                                        {Categories &&
                                            Categories.map((value, index) => (
                                                <option value={index} key={index}>
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
                                        // value={productData.SubCategory}
                                        borderColor={productError.SubCategory ? "red" : "inherit"}
                                        {...register("SubCategory")}
                                        onChange={(e) => {
                                            const val: any = e.target.value;
                                            setSubCategorieId(subCategory[val].id);
                                            // setProductData({
                                            //   ...productData,
                                            //   SubCategory: e.target.value,
                                            // });
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
                                                <option value={index} key={index}>
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
                            p={6}
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
                                    value={productData.ProductPrice.USD}
                                    {...register("ProductPrice")}
                                    onChange={(e) => {
                                        setProductData({
                                            ...productData,
                                            ProductPrice: { USD: Number(e.target.value), AED: 0 },
                                        });
                                        setProductError({
                                            ...productError,
                                            ProductPrice: { USD: "", AED: "" },
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
                                    value={productData.ProductPrice.AED}
                                    {...register("ProductPrice")}
                                    onChange={(e) => {
                                        setProductData({
                                            ...productData,
                                            ProductPrice: {
                                                USD: productData.ProductPrice.USD,
                                                AED: Number(e.target.value)
                                            },
                                        });
                                        setProductError({
                                            ...productError,
                                            ProductPrice: { USD: "", AED: "" },
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
export default WithAuth(Addproduct, USER_TYPE.Admin);