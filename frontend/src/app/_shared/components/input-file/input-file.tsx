import { useState, useRef } from "react";
import { toast } from "react-toastify";
import styles from "./input-file.module.scss";

interface InputFileProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  label?: string;
}

export const InputFile = ({
  onFileChange,
  accept = ".csv",
  label,
}: InputFileProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file: File) => {
    // Validate file extension
    const extension = file.name.split(".").pop()?.toLowerCase();
    const acceptedExtensions = accept
      .split(",")
      .map((ext) => ext.trim().replace(".", "").toLowerCase());

    if (
      acceptedExtensions.length > 0 &&
      !acceptedExtensions.includes(extension || "")
    ) {
      setHasError(true);
      toast.error(`Tipo di file non supportato. Caricare un file ${accept}`);

      // Reset error state after animation
      setTimeout(() => setHasError(false), 2000);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    setHasError(false);
    setSelectedFile(file);
    onFileChange(file);
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.inputFile} ${isDragging ? styles.dragging : ""} ${
          selectedFile ? styles.hasFile : ""
        } ${hasError ? styles.error : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={
          selectedFile
            ? `File selezionato: ${selectedFile.name}`
            : "Carica un file"
        }
        aria-controls="file-input"
      >
        {selectedFile && (
          <button
            type="button"
            className={styles.removeButton}
            onClick={handleRemoveFile}
            title="Rimuovi file"
            aria-label="Rimuovi file"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        <input
          id="file-input"
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className={styles.hiddenInput}
        />
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            {selectedFile ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17L4 12" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            )}
          </div>
          <div className={styles.textWrapper}>
            {selectedFile ? (
              <>
                <span className={styles.fileName}>{selectedFile.name}</span>
                <span className={styles.subtitle}>
                  Clicca o trascina per cambiare file
                </span>
              </>
            ) : (
              <>
                <span className={styles.title}>Carica un file</span>
                <span className={styles.subtitle}>
                  Trascina qui o clicca per selezionare (.csv)
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
