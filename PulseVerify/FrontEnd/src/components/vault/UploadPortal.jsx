import { useState } from "react";

export default function UploadPortal() {
  const [selectedFile, setSelectedFile] = useState(null);

  function handleFileChange(event) {
    const file = event.target.files[0];
    setSelectedFile(file);
  }

  return (
    <div className="p-6 bg-zinc-900  border border-zinc-800">
      
      <h2 className="text-xl font-semibold text-white mb-4">
        Upload Official Asset
      </h2>

      <label
        htmlFor="fileUpload"
        className="inline-block px-5 py-3 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition"
      >
        Browse File
      </label>

      <input
        id="fileUpload"
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedFile && (
        <p className="mt-3 text-sm text-zinc-300">
          Selected file: {selectedFile.name}
        </p>
      )}

    </div>
  );
}