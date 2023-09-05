import { useRef, useState } from "react";

type useImage = [React.MutableRefObject<HTMLInputElement>, string, React.Dispatch<React.SetStateAction<string>>, (fileURL: string) => void];

const useImage = (defaultState?: string): useImage => {
  const [imageURL, setImageURL] = useState(defaultState || "");
  const ref = useRef();

  const onUpload = (fileURL: string) => setImageURL(fileURL);

  return [ref, imageURL, setImageURL, onUpload];
};

export default useImage;
