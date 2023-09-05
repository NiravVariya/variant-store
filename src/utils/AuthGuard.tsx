import Loader from "../components/Common/Loader";
import { useUserContext } from "../context/UserContext";

interface Props {
  children?: React.ReactNode;
  // any props that come into the component
}
const AuthGuard = ({ children }: Props) => {
  const { loading } = useUserContext();
  if (loading) return <Loader maxW="8xl" />;

  return children;
};

export default AuthGuard;
