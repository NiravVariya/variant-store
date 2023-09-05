import useAuth from "@/hooks/useAuth";
import { signOut } from "@/services/auth_service";
import { useRouter } from "next/router";
import { createContext, useContext } from "react";

const UserContext = createContext(null);

export const useUserContext = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUserContext must be used within a UserContext");
  }
  return userContext;
};

const unauthRoutes = ["/auth"];

interface Props {
  children?: React.ReactNode;
  // any props that come into the component
}

export const UserContextComp = ({ children }: Props) => {
  const router = useRouter();
  const { user, loading, error } = useAuth();
  const isAdmin = user?.isAdmin;

  const logout = async () => {
    if (user) {
      await signOut();
    }
  };

  const isUserNotAuthenticated = () => {
    return (
      !loading &&
      !user &&
      !unauthRoutes.some((route) => router.pathname.includes(route))
    );
  };

  // if (isUserNotAuthenticated()) {
  //   router.push("/auth/login");
  //   return null;
  // }

  return (
    <UserContext.Provider
      value={{
        user,
        error,
        loading,
        logout,
        isAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
