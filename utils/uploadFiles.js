import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../config/firebase.js";
import sharp from "sharp";

export async function uploadFile(file, user_id, type) {
  let fileBuffer = await sharp(file.buffer).toBuffer();

  const fileRef = ref(storage, `files/${type}${user_id}`);

  const fileMetaData = {
    contentType: file.mimetype,
  };

  const fileUploadPromise = uploadBytesResumable(
    fileRef,
    fileBuffer,
    fileMetaData
  );

  await fileUploadPromise;

  const fileDownloadURL = await getDownloadURL(fileRef);

  return fileDownloadURL;
}
