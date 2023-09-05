import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import store, { setUserDetails } from "@/store";
import { useRouter } from "next/router";
import { checkIfUserCanAccessThisRoute } from "./helper";
import { db } from "@/firebase/client";
import { Flex, Spinner } from "@chakra-ui/react";

function WithAuth(Component: any, accessLevel: string) {
  const ComponentWithAuth = () => {
    const reduxData = useSelector((state: any) => state.icon);

    const userDetails = reduxData.userDetails;
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      if (!userDetails.changed && !userDetails.id) {
        // authenticate user
        const userAuth = getAuth();
        // subscribe to user auth state changed event
        const unSubscribeFunc = onAuthStateChanged(userAuth, (user) => {
          if (user) {
            (async () => {
              const docRef = collection(db, "storeUsers");
              onSnapshot(docRef, (userSnapshot) => {
                userSnapshot.docs.map((item: any) => {
                  if (item.data().id === user.uid) {
                    const user = item.data();
                    store.dispatch(
                      setUserDetails(user as any)
                    );
                  }
                });
              });
            })();
            return;
          }
          store.dispatch(setUserDetails({} as any));
          // unsubscribe to user auth state change event on onmount
          return () => unSubscribeFunc();
        });
      }
    }, []);

    useEffect(() => {
      if (userDetails.changed) {
        const [isGranted, redirectTo]: any = checkIfUserCanAccessThisRoute(
          accessLevel,
          userDetails
        );
        if (isGranted) {
          setIsLoading(false);
          return;
        }
        router.replace(redirectTo);
      }
    }, [userDetails]);

    return isLoading ? (
      <Flex justifyContent={"center"} alignItems={"center"} height={"100vh"} >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="#2B9CB1"
          size="xl"
        />
      </Flex>
    ) : (
      <Component />
    );
  };

  return ComponentWithAuth;
}

export default WithAuth;