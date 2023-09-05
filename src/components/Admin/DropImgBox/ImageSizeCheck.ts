import { toast } from "react-hot-toast";

export const getImagesWidtHeight = async (
  file: File,
  defaultWidth: number,
  defaultHeight: number,
  callback: any
) => {
  const reader = new FileReader();
  reader && reader.readAsDataURL(file);

  reader.onload = (event) => {
    const img: any = new Image();
    img.src = event.target.result;

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      console.log(`Width: ${width}, Height: ${height}`);
      if (width >= defaultWidth && height >= defaultHeight) {
        callback(true);
      } else {
        toast.error(`Recommended Size: ${defaultWidth + "x" + defaultHeight}`);
        callback(false);
      }
    };
  };
};
