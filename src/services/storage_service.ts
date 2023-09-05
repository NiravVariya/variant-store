import { storage } from "@/firebase/client";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";

export async function addFile(
  path: any,
  file: any,
  metadata: any,
  uploading: any,
  progressCallback: any,
  callback: any
) {
  const storageRef = ref(storage, path);
  const uploadTask = metadata
    ? uploadBytesResumable(storageRef, file, metadata)
    : uploadBytesResumable(storageRef, file);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      uploading(true);
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressCallback(progress);
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          throw error;
        case "storage/canceled":
          throw error;
        case "storage/unknown":
          throw error;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        
        uploading(false);
        progressCallback(0);
        callback(downloadURL);
      });
    }
  );
}
