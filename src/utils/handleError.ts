import toast from "react-hot-toast";

const handleError = (err: Error) => {
  toast.error(err?.message ?? "Something went wrong!");
};

export default handleError;
