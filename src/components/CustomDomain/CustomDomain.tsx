import { ExternalLinkIcon, WarningTwoIcon } from "@chakra-ui/icons";
import firebaseConfig from "./../../firebase/firebaseConfig.json";
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Spinner,
  Text,
  Divider,
  FormErrorMessage,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Link,
  ModalFooter,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import fetcher from "../../lib/fetcher";
import useSWR, { mutate } from "swr";
import LoadingDots from "./loading-dots";
import { MdVerified } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/client";
import { toast } from "react-hot-toast";

function CustomDomain() {
  const [customDomain, setCustomDomain] = useState("");
  const [domainGitBranch, setDomainGitBranch] = useState("");
  const [isLoadingDomain, setIsLoadingDomain] = useState(false);
  const [recordType, setRecordType] = useState("CNAME");
  const [underLine, setUnderLine] = useState(false);
  const [settigDoc, setSettigDoc] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  type Inputs = {
    customDomain: string;
  };

  const validationSchema = Yup.object().shape({
    customDomain: Yup.string()
      .required("Domain must be requied")
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        "Domain is not valid"
      )
      .lowercase()
      .nullable(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<Inputs>({
    resolver: yupResolver<any>(validationSchema),
  });

  useEffect(() => {
    const settingStoreRef = collection(db, "storeSetting");
    onSnapshot(settingStoreRef, (settingSnap: any) => {
      settingSnap.docs.map((value: any) => {
        setCustomDomain(value.data().customDomain);
        setValue("customDomain", value.data().customDomain);
        setDomainGitBranch(value.data().gitBranch);
      });
    });
  }, []);

  const settingStoreRef = collection(db, "storeSetting");
  onSnapshot(settingStoreRef, (settingSnap: any) => {
    settingSnap.docs.map((value: any) => {
      const dataref: any = doc(db, "storeSetting", value.id);
      setSettigDoc(dataref);
    });
  });

  const domain: string = getValues("customDomain") || "";

  const removeDomain = async () => {
    try {
      setIsLoadingDomain(true);
      await fetch(`/api/remove-domain/${domain.toLowerCase()}`, {
        method: "DELETE",
      }).then(async (response) => {
        const settingStoreRef: any = doc(collection(db, "storeSetting"));
        await updateDoc(settigDoc, {
          customDomain: "",
        }).then(() => {
          toast.success("Remove Domain Domain");
          setIsLoadingDomain(false);
        });
      });
      await revalidateDomains();
    } catch (error) {
      console.log(error);
    }
  };

  const { data: domainList, mutate: revalidateDomains } = useSWR(
    `/api/get-domain`,
    fetcher
  );

  const {
    data: domainInfo,
    isValidating,
    error,
  } = useSWR(`/api/check-domain/${domain.toLowerCase()}`, fetcher, {
    revalidateOnMount: true,
    refreshInterval: 5000,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://vindyy.com/api/firebaseproject/authdomain/update",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              projectId: firebaseConfig.projectId,
              domains: domain,
            }),
          }
        );
        // Handle the response
        const data = await response.json();
        console.log(data); // Do something with the response data
      } catch (error) {
        console.error(error);
      }
    };

    if (domainInfo?.configured) {
      fetchData();
    }
  }, [domainInfo?.configured]);

  const handleCustomDomain = async (values: Inputs) => {
    const domain: string = getValues("customDomain") || "";
    try {
      await axios
        .post(`/api/domain/${domain.toLowerCase()}`, {
          name: domain.toLowerCase(),
          gitBranch: domainGitBranch,
          projectId: firebaseConfig.projectId
        })
        .then(async (response: any) => {
          const settingStoreRef = doc(collection(db, "storeSetting"));
          setIsLoadingDomain(true);
          if (settigDoc === undefined) {
            await setDoc(settingStoreRef, {
              customDomain: getValues("customDomain"),
            }).then(() => {
              toast.success("Added Domain successfully");
              setIsLoadingDomain(false);
            });
          } else {
            await updateDoc(settigDoc, {
              customDomain: getValues("customDomain"),
            }).then(() => {
              toast.success("Updated Domain successfully");
              setIsLoadingDomain(false);
            });
          }
          createCommit();
        });
      await revalidateDomains();
    } catch (error) {
      console.log(error);
    }
  };

  const createCommit = async () => {
    try {
      await axios
        .post(`/api/git-commit/git-commit`, { gitBranch: domainGitBranch })
        .then(async (response) => {
          console.log("res============>", response);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Heading size={"sm"} mb={5}>
        Manage Custom Domain
      </Heading>
      {customDomain ? (
        <>
          <Flex
            flexDirection={"column"}
            border={"1px"}
            padding={"1rem"}
            borderColor={"#C5C6C8"}
            mb={5}
          >
            <Flex
              alignItems={"center"}
              justifyContent={"space-between"}
              flexDirection={{ base: "column", md: "row" }}
            >
              <Flex alignItems={"center"}>
                <Text fontWeight={"bold"} fontSize={{ sm: "sm", md: "xl" }}>
                  {customDomain.toLowerCase()}
                </Text>
                <Button
                  variant={"ghost"}
                  as={"a"}
                  size={"xl"}
                  href={`https://${customDomain}`}
                  target="_blank"
                >
                  <ExternalLinkIcon />
                </Button>
                <Button rounded={50} fontSize={"sm"} py={0} height={7}>
                  Preview
                </Button>
              </Flex>
              <Flex gap={4} mt={{ base: 4, md: 0 }}>
                <Button
                  onClick={() => {
                    mutate(`/api/check-domain/${domain.toLowerCase()}`);
                  }}
                  disabled={isValidating}
                  variant={"ghost"}
                  border={"1px"}
                >
                  {isValidating ? <LoadingDots /> : "Refresh"}
                </Button>
                <Button
                  onClick={() => onOpen()}
                  variant={"ghost"}
                  border={"1px"}
                >
                  {isLoadingDomain ? <Spinner /> : "Remove"}
                </Button>
              </Flex>
            </Flex>
            {domainInfo?.configured == true ? (
              <Text
                my={4}
                display={"flex"}
                alignItems={"center"}
                gap={3}
                color={"blue"}
              >
                <MdVerified />
                Valid Configuration
              </Text>
            ) : (
              <>
                <Text
                  my={4}
                  display={"flex"}
                  alignItems={"center"}
                  gap={3}
                  color={"red"}
                >
                  <RxCrossCircled />
                  Invalid Configuration
                </Text>
                <Divider />
                <Flex gap={4} mt={5}>
                  <Button
                    px={0}
                    fontSize={{ base: 12, md: 16 }}
                    borderBottom={underLine == true ? "2px" : "none"}
                    variant={"ghost"}
                    onClick={() => {
                      setRecordType("CNAME");
                      setUnderLine(true);
                    }}
                  >
                    CNAME Record (subdomains)
                  </Button>
                  <Button
                    variant={"ghost"}
                    fontSize={{ base: 12, md: 16 }}
                    borderBottom={underLine == false ? "2px" : "none"}
                    onClick={() => {
                      setRecordType("A");
                      setUnderLine(false);
                    }}
                  >
                    A Record (apex domain)
                  </Button>
                </Flex>
                <Flex flexDirection={"column"} mt={4}>
                  <Text mb={3}>
                    Set the following record on your DNS provider to continue:
                  </Text>
                  <Flex justifyContent={"flex-start"} gap={10}>
                    <Flex flexDirection={"column"}>
                      <Text>Type</Text>
                      <Text>{recordType}</Text>
                    </Flex>
                    <Flex flexDirection={"column"}>
                      <Text>Name</Text>
                      <Text>{recordType == "CNAME" ? "www" : "@"}</Text>
                    </Flex>
                    <Flex flexDirection={"column"}>
                      <Text>Value</Text>
                      <Text>
                        {recordType == "CNAME"
                          ? `cname.platformize.co`
                          : `76.76.21.21`}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex justifyContent={"flex-end"} gap={2}>
                  <Link
                    href="https://vindyy.com/blog"
                    target="_blank"
                    color={"blue"}
                  >
                    How to Add DNS?
                  </Link>
                </Flex>
              </>
            )}
            <Modal
              isCentered
              onClose={onClose}
              isOpen={isOpen}
              motionPreset="slideInBottom"
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader fontWeight={"normal"}>
                  Please Confirm to Remove
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text color={"red"} textAlign={"center"}>
                    <WarningTwoIcon marginRight={2} />
                    Remove at your own risk
                  </Text>
                </ModalBody>
                <ModalFooter justifyContent={"center"}>
                  <Flex gap={4} mb={4}>
                    <Button
                      onClick={() => {
                        removeDomain();
                        onClose();
                      }}
                    >
                      Confirm
                    </Button>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                      Cancel
                    </Button>
                  </Flex>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Flex>
        </>
      ) : (
        <form
          id="create-store-form"
          onSubmit={handleSubmit(handleCustomDomain)}
        >
          <Grid
            templateColumns={{ base: "repeat(1, 2fr)", md: "repeat(2, 1fr)" }}
            gap={6}
            mb={0}
          >
            <FormControl isInvalid={!!errors.customDomain}>
              <FormLabel fontSize={15}>Add Custom Domain</FormLabel>
              <Input
                placeholder="Add Custom Domain"
                _focus={{ borderColor: "grey" }}
                ms={0.5}
                {...register("customDomain")}
                width={"95%"}
                type="text"
                autoComplete="off"
              />
              <FormErrorMessage>
                {errors.customDomain && errors.customDomain?.message}
              </FormErrorMessage>
            </FormControl>
          </Grid>
          <Button variant="primary" type="submit" mt={5} mb={7}>
            {isLoadingDomain ? <Spinner /> : "Add Domain"}
          </Button>
        </form>
      )}
    </>
  );
}

export default CustomDomain;
