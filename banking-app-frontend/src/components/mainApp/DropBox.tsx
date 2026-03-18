import React, { useState, useRef } from "react";

export default function DropBox() {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const uploadData = async () => {
    const csvFormData = new FormData();
    if (!selectedFile) {
      return;
    }
    csvFormData.append("file", selectedFile, selectedFile.name);

    const response = await fetch("http://localhost:8000/user/upload_document", {
      method: "POST",
      body: csvFormData,
    });

    console.log(response);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    await uploadData();
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
      {selectedFile && <button onClick={handleUpload}>Upload</button>}
    </>
  );
}
