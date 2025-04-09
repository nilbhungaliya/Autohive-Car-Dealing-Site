import { MAX_IMAGE_SIZE } from "@/config/constants";
import { endpoints } from "@/config/endpoints";
import { api } from "@/lib/api-client";
import { convertToMb } from "@/lib/utils";
import { ChangeEvent, useRef, useState } from "react";

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
}

export const ImageUploader = (props: ImageUploaderProps) => {
  const { onUploadComplete } = props;
  const [preview, setPreview] = useState<string | null>(null); // image preview
  const [isUploading, setIsUploading] = useState(false); // upload loading state
  const [uploadComplete, setUploadComplete] = useState(false); // did upload finish?
  const [draggingOver, setDraggingOver] = useState(false); // are we dragging a file in?
  const [error, setError] = useState<string | null>(null); // any upload error?
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      setError(`File size exceeds ${convertToMb(file.size)} limit`);
      return;
    }

    setError(null);
    setIsUploading(true);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post<{ url: string }>(
        endpoints.images.singleUpload,
        { body: formData }
      );
      const { url } = response;

      onUploadComplete(url);
      setUploadComplete(true);
    } catch (error) {
      console.log("Error uploading file: ", error);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return <div></div>;
};
