import React, { useState, useRef } from "react";

export default function DropBox() {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    const csvFormData = new FormData();
    csvFormData.append("file", file, file.name);

    setUploading(true);
    setUploadStatus("idle");
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/user/upload_document",
        {
          method: "POST",
          body: csvFormData,
        },
      );
      console.log(response);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setUploadStatus("success");
      setSelectedFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  const validateAndProcessFile = (files: FileList) => {
    setError("");

    if (files.length === 0) {
      return;
    }

    if (files.length > 1) {
      setError("Please load no more than 1 files.");
      return;
    }

    const file = files[0];

    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      setSelectedFile(file);
      uploadFile(file);
    } else {
      setError("Invalid file type. Please load a .csv file.");
      setSelectedFile(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    //extracting the files
    const files = e.dataTransfer.files;
    validateAndProcessFile(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      validateAndProcessFile(files);
    }
  };

  const onContainerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className="h-full w-full">
        {/* div-ul de dropbox efectic */}
        <div
          onClick={onContainerClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`h-full w-full border border-dashed rounded-lg
          ${isDragging ? "bg-[#e8f5e9]" : "bg-black/10"}
          cursor-pointer
          transition-colors
          duration-200
          `}
        >
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />

          {isDragging ? (
            <p style={{ color: "#4CAF50" }}>Lasă fișierul CSV aici!</p>
          ) : (
            <p>
              Trage și lasă fișierul tău .csv aici, sau dă click pentru a căuta
            </p>
          )}
        </div>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {selectedFile && (
          <p style={{ color: "green", marginTop: "10px" }}>
            Acceptat: <strong>{selectedFile.name}</strong>
          </p>
        )}
      </div>
      {uploading && (
        <p style={{ color: "gray", marginTop: "10px" }}>Uploading...</p>
      )}
      {uploadStatus === "success" && (
        <p style={{ color: "green", marginTop: "10px" }}>
          File uploaded successfully!
        </p>
      )}
    </>
  );
}
