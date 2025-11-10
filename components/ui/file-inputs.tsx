"use client";

import { FileIcon, Trash2, Upload } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Button } from "./button";

interface FileInputProps {
  className?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
  accept?: string;
}

const FileInput = ({
  className,
  value,
  onChange,
  disabled,
  accept,
}: FileInputProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelection = (file: File | null) => {
    if (!disabled) onChange?.(file);
  };

  const handleDragEvents = (
    e: React.DragEvent<HTMLDivElement>,
    isOver: boolean,
  ) => {
    e.preventDefault();
    if (!disabled) setIsDragging(isOver);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (!disabled) {
      const file = e.dataTransfer.files?.[0] ?? null;
      handleFileSelection(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(e.target.files?.[0] ?? null);
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleFileSelection(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDrop={handleDrop}
        className={cn(
          "border-muted-foreground/25 hover:bg-muted/50 relative cursor-pointer rounded-md border border-dashed px-6 py-8 text-center transition-colors",
          isDragging && "border-muted-foreground/50 bg-muted/50",
          disabled && "cursor-not-allowed opacity-60",
        )}
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-1">
          <Upload className="text-muted-foreground h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            <span className="text-primary font-semibold">Click to upload</span>{" "}
            or drag and drop
          </p>
        </div>
      </div>
      {value && (
        <div className="bg-muted/50 flex items-center gap-2 rounded-md p-2">
          <div className="bg-background rounded-md p-2">
            <FileIcon className="text-muted-foreground size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{value.name}</p>
            <p className="text-muted-foreground text-xs">
              {(value.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            onClick={handleRemove}
            className="size-8 flex-none"
          >
            <Trash2 className="text-muted-foreground hover:text-destructive size-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export { FileInput };
