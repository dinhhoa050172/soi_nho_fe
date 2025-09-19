import React from "react";
import { uploadFile } from "@/utils/uploadFile";

interface UploadFileImageProps {
  onUploaded: (url: string) => void;
}

const UploadFileImage: React.FC<UploadFileImageProps> = ({ onUploaded }) => {
  const [loading, setLoading] = React.useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadFile(file);
      onUploaded(url);
    } catch (err) {
      alert("Upload thất bại" + (err ? `: ${err}` : ""));
    }
    setLoading(false);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} disabled={loading} />
      {loading && <span className="text-sm text-gray-500 ml-2">Đang upload...</span>}
    </div>
  );
};

export default UploadFileImage;