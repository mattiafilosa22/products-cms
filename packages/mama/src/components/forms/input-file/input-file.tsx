import { useState, useRef } from "react";
import { toast } from "react-toastify";
import styles from "./input-file.module.scss";
import { AppButton } from "../../app-button/app-button";
import IconClose from "../../../assets/icons/close.svg";
import IconCheck from "../../../assets/icons/check-mark.svg";
import IconUpload from "../../../assets/icons/upload.svg";

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

  const handleRemoveFile = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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
          <AppButton
            variant="custom"
            className={styles.removeButton}
            onClick={handleRemoveFile}
            icon={IconClose}
            size="icon"
          />
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
              <IconCheck width={24} height={24} />
            ) : (
              <IconUpload width={24} height={24} />
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
                  Trascina qui o clicca per selezionare ({accept})
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
