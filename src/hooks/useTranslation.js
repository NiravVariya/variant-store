import { useRouter } from "next/router";
import { useSelector } from "react-redux";

function useTranslation() {
  const { locale } = useRouter();
  const { en, ar } = useSelector((state) => state.icon);

  const t = (key) => {
    if (locale == "ar") {
      return ar[key];
    }
    if (locale == "en" || !locale) {
      return en[key];
    }
  };
  return { t };
}
export default useTranslation;
