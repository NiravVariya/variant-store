import { setVariantCombinationList, setVariantList } from "@/store";
import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, CloseButton, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Spinner, Stack, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import { storage } from "@/firebase/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaRegHandPointRight } from "react-icons/fa";
import { useDispatch } from "react-redux";
import randomstring from "randomstring";

function AddVarients(props: any) {
    const [varientList, setVarientList] = useState<any>([]);
    const [imageView, setImageView] = useState<any>([]);
    const [variantCombination, setVariantCombination] = useState<any>([])
    const [fileArray, setFileArray] = useState<any[]>([]);
    const [imageIndex, setImageIndex] = useState<number>();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const dispatch = useDispatch();
    const hiddenFileInput = React.useRef(null);
    const [imageArray, setimageArray] = useState([])
    const [isImageUploading, setIsImageUploading] = useState(false)

    useEffect(() => {
        dispatch(setVariantList(varientList))
        dispatch(setVariantCombinationList(variantCombination))
    }, [varientList, variantCombination])

    const generateCombinationNames = (variants: any, variantCombinationData: any) => {
        const combinations = [];
        if (variants.length == 1) {
            for (const { name } of variants[0]?.subVarientList) {
                let findIndex =
                    variantCombinationData.findIndex((res: any) => res.label == name)
                combinations.push({
                    varientCombination: {
                        [variants[0]?.varientName]: name,
                        USDPrice: findIndex !== -1 ?
                            variantCombinationData[findIndex].varientCombination.USDPrice :
                            props.USDPrice,
                        AEDPrice: findIndex !== -1 ?
                            variantCombinationData[findIndex].varientCombination.AEDPrice :
                            props.AEDPrice,
                        Images: ""
                    },
                    label: name
                });
            }
            return combinations;
        }

        for (const { name: firstName } of variants[0]?.subVarientList) {
            for (const { name: secondName } of variants[1]?.subVarientList) {
                let findIndex =
                    variantCombinationData.findIndex((res: any) =>
                        res.label == `${firstName}/${secondName}`)

                combinations.push({
                    varientCombination: {
                        [variants[0]?.varientName]: firstName,
                        [variants[1]?.varientName]: secondName,
                        USDPrice: findIndex !== -1 ?
                            variantCombinationData[findIndex].varientCombination.USDPrice :
                            props.USDPrice,
                        AEDPrice: findIndex !== -1 ?
                            variantCombinationData[findIndex].varientCombination.AEDPrice :
                            props.AEDPrice,
                        Images: ""
                    }, label: `${firstName}/${secondName}`,
                });
            }
        }

        return combinations;
    };

    const isVariantValid = (variant: any) => {
        if (!variant.varientName) {
            return false;
        }
        for (const subVariant of variant.subVarientList) {
            if (!subVariant.name) {
                return false;
            }
        }
        return true;
    };

    const handleSetIsDone = (index: number) => {
        let copyVariant = structuredClone(varientList);
        if (isVariantValid(copyVariant[index])) {
            copyVariant[index].isDone = true;
            setVarientList(copyVariant);
            const combinationNames = generateCombinationNames(varientList, variantCombination)
            setVariantCombination(combinationNames);
        } else {
            toast.error("Fill all varient values")
        }
    };

    const addVarient = () => {
        let varientObject: any = {
            varientName: "",
            subVarientList: [],
            isDone: false
        }
        let copyvariant = structuredClone(varientList);
        copyvariant.push(varientObject);
        setVarientList(copyvariant);
    };

    const handleSubVariantNameChange = (index: number, subIndex: number, value: any) => {
        let copyVariant = structuredClone(varientList);
        copyVariant[index].subVarientList[subIndex].name = value;
        setVarientList(copyVariant);
    };

    const handleAddUsdPrice = (index: number, value: number) => {
        let copyCombination = structuredClone(variantCombination);
        copyCombination[index].varientCombination.USDPrice = value
        setVariantCombination(copyCombination);
    }

    const handleAddAedPrice = (index: number, value: number) => {
        let copyCombination = structuredClone(variantCombination);
        copyCombination[index].varientCombination.AEDPrice = value
        setVariantCombination(copyCombination);
    }

    const removeVariantName = (index: number) => {
        let copyVariant = structuredClone(varientList);
        copyVariant.splice(index, 1);
        setVarientList(copyVariant);
    };

    const removeCombination = (index: number) => {
        let copyCombination = structuredClone(variantCombination);
        copyCombination.splice(index, 1);
        setVariantCombination(copyCombination);
    };

    const removeSubVariantName = (index: number, subIndex: number) => {
        let copyVariant = structuredClone(varientList);
        copyVariant[index].subVarientList.splice(subIndex, 1);
        setVarientList(copyVariant);
    };

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    useEffect(() => {
        const imagefunction = () => {
            let imageArray = []
            for (let i = 0; i < fileArray?.length; i++) {
                const newObject = URL.createObjectURL(fileArray[i]);
                imageArray.push(newObject);
                setImageView(imageArray);
            }
        }
        imagefunction()
    }, [fileArray])

    const handleAddImages = async (index: number, value: number) => {
        let copyCombination = structuredClone(variantCombination);
        copyCombination[index].varientCombination.Images = imageArray
        setVariantCombination(copyCombination);
        onClose();
    }

    const handleDeleteImage = async (id: number) => {
        let newArra = Array.from(fileArray);
        let filterArray = newArra.filter((res: any, ind: number) => ind !== id);
        const newArrayImg = imageView.filter(
            (_: any, index: number) => index !== id
        );
        setFileArray(filterArray);
        setImageView(newArrayImg);
        setimageArray(newArrayImg);
    };

    const handleImageVariant = (index: number) => {
        const images = variantCombination[index].varientCombination.Images;
        setImageView(images);
    }

    return (
        <Box
            bg={"bg-surface"}
            p={6}
            mt={4}
        >
            <Text>Variants</Text>
            {
                varientList.map((variant: any, index: number) => {
                    return (<>
                        {
                            variant.isDone == false ? (<>
                                <Flex alignItems={"center"} gap={5} key={index}>
                                    <Select
                                        required={variant.varientName.required}
                                        size="lg"
                                        ms={0.5}
                                        mt={4}
                                        value={variant.varientName}
                                        onChange={(e) => {
                                            let copyVariant = structuredClone(varientList)
                                            copyVariant[index].varientName = e.target.value;
                                            copyVariant[index].subVarientList.push({ name: "" });
                                            setVarientList(copyVariant);
                                        }}
                                    >
                                        <option selected disabled value="">
                                            Select Variant
                                        </option>
                                        <option>size</option>
                                        <option>color</option>
                                    </Select>
                                    <Button
                                        variant={"ghost"}
                                        onClick={() => removeVariantName(index)}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </Flex>

                                {variant.subVarientList.map((subVariant: any, subIndex: number) => (
                                    <Flex key={subIndex} alignItems={"center"} gap={5}>
                                        <Input
                                            required={subVariant.name.required}
                                            mt={3}
                                            placeholder="Add value"
                                            type="text"
                                            value={subVariant.name}
                                            onChange={(e) =>
                                                handleSubVariantNameChange(index, subIndex, e.target.value)
                                            }
                                        />
                                        <Button
                                            variant={"ghost"}
                                            onClick={() => removeSubVariantName(index, subIndex)}
                                        >
                                            <DeleteIcon />
                                        </Button>
                                    </Flex>
                                ))}
                                <Flex justifyContent={"flex-end"}>
                                    <Text
                                        mt={2}
                                        fontSize={"sm"}
                                        cursor={"pointer"}
                                        onClick={() => {
                                            let copyVariant = structuredClone(varientList);
                                            copyVariant[index].subVarientList.push({ name: "" });
                                            setVarientList(copyVariant);
                                        }}
                                    >
                                        Click to add another value
                                    </Text>
                                </Flex>

                                <Flex justifyContent={"flex-end"}>
                                    <Button
                                        mt={3}
                                        onClick={() => handleSetIsDone(index)}
                                    >
                                        Done
                                    </Button>
                                </Flex>
                            </>) : (<>
                                <Flex flexDirection={"column"} mt={3}>
                                    <Flex alignItems={"center"} gap={4}>
                                        <FaRegHandPointRight />
                                        <Text fontSize={"lg"} fontWeight={"bold"}>{variant.varientName}</Text>
                                    </Flex>
                                    <Flex alignItems={"center"} justifyContent={"space-between"} ml={8}>
                                        <Flex gap={3}>
                                            {variant.subVarientList.map((subVariant: any, subIndex: number) => (
                                                <Stack key={subIndex} bg={"#EDF2F7"} borderRadius={"35%"} px={5}>
                                                    <Text>{subVariant.name}</Text>
                                                </Stack>
                                            ))}
                                        </Flex>
                                        <Button
                                            onClick={() => {
                                                let copyVariant = structuredClone(varientList);
                                                copyVariant[index].isDone = false;
                                                setVarientList(copyVariant);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </Flex>
                                </Flex>
                            </>)
                        }
                    </>)
                })
            }
            <Button
                mt={3}
                variant={"ghost"}
                onClick={() => addVarient()}
                display={varientList.length >= 2 ? "none" : "block"}
            >
                + Add options like size or color
            </Button>

            <TableContainer mt={5}>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>No.</Th>
                            <Th align="center">Variant</Th>
                            <Th align="left">Price in USD</Th>
                            <Th align="left">Price in {props.secondCurrency ? props.secondCurrency : "AED"}</Th>
                            <Th>Add Images</Th>
                            <Th align="center">Delete</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            variantCombination != 0 && (<>
                                {
                                    variantCombination.map((data: any, index: number) => {
                                        const varientName = data.label
                                        return (
                                            <Tr key={index}>
                                                <Td>{index + 1}</Td>
                                                <Td>{varientName}</Td>
                                                <Td>
                                                    <Input
                                                        mt={3}
                                                        placeholder="Add Price"
                                                        type="number"
                                                        value={data?.varientCombination?.USDPrice
                                                            ?? props.USDPrice}
                                                        onChange={(e) =>
                                                            handleAddUsdPrice(index,
                                                                Number(e.target.value))
                                                        }
                                                    />
                                                </Td>
                                                <Td>
                                                    <Input
                                                        mt={3}
                                                        placeholder="Add Price"
                                                        type="number"
                                                        value={data?.varientCombination?.AEDPrice
                                                            || props.AEDPrice}
                                                        onChange={(e) =>
                                                            handleAddAedPrice(index,
                                                                Number(e.target.value))
                                                        }
                                                    />
                                                </Td>
                                                <Td>
                                                    <Button onClick={() => {
                                                        onOpen();
                                                        handleImageVariant(index);
                                                        setImageIndex(index);
                                                    }}
                                                    >
                                                        Add Images
                                                    </Button>
                                                </Td>
                                                <Td>
                                                    <Button variant={"ghost"} onClick={() => removeCombination(index)}>
                                                        <DeleteIcon />
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        )
                                    })}
                            </>)
                        }
                        <>
                            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                                <ModalContent border={"1px"}>
                                    <ModalHeader>Upload Images</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <Button
                                            size="md"
                                            variant="primary"
                                            onClick={handleClick}
                                            width={"-webkit-fit-content"}>
                                            Add Images
                                            <input
                                                ref={hiddenFileInput}
                                                onChange={async (e) => {
                                                    const files: any = e.target.files;
                                                    setFileArray(files);
                                                    setIsImageUploading(true);
                                                    let filepreview: any = [];
                                                    for (const file of files) {
                                                        const storageRef = ref(
                                                            storage,
                                                            `/ProductImage/${randomstring.generate()}`
                                                        );
                                                        await uploadBytes(storageRef, file);
                                                        const url = await getDownloadURL(storageRef);
                                                        filepreview.push(url);
                                                    }
                                                    setimageArray(filepreview)
                                                    setIsImageUploading(false);
                                                }}
                                                type="file"
                                                hidden
                                                accept=".jpg, .jpeg, .png"
                                                id="fileButton"
                                                data-testid="file-upload-input"
                                                multiple
                                            />
                                        </Button>
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
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button onClick={
                                            () => {
                                                handleAddImages(imageIndex, imageView);
                                            }
                                        }>
                                            {isImageUploading == true ? <Spinner /> : "Done"}
                                        </Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </>
                    </Tbody>
                </Table>
            </TableContainer>
        </Box >
    )
}

export default AddVarients;