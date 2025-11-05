import React, { useMemo, useState } from "react";
import { type Accept, useDropzone } from "react-dropzone";
import { FormBase, FormControlProps } from "@/components/form/form-base.tsx";
import { useFieldContext } from "@/components/form/use-forms.tsx";
import { cn } from "@/lib/utils.ts";

type Props = FormControlProps & {
  accept?: Accept;
  multiple?: boolean;
  className?: string;
  previewUrl?: string;
};

export function FormImageUpload({
  label,
  description,
  accept,
  multiple = false,
  className,
  previewUrl,
}: Props) {
  const field = useFieldContext<File | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const error = field.state.meta.errors?.[0];

  const [selectedFile, setSelectedFile] = useState<File | null>(
    field.state.value instanceof File ? field.state.value : null,
  );

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      field.handleChange(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ?? { "image/*": [] },
    multiple,
  });

  const previewText = useMemo(() => {
    if (isDragActive) return "Přetáhněte soubor sem…";
    if (selectedFile) return `Vybraný soubor: ${selectedFile.name}`;
    if (!selectedFile && previewUrl)
      return "Aktuálně nastavený obrázek (ponecháte-li beze změny):";
    return "Přetáhněte obrázek sem, nebo klikněte pro výběr";
  }, [isDragActive, selectedFile, previewUrl]);

  return (
    <FormBase label={label} description={description}>
      <div className={cn("space-y-2", className)}>
        <div
          {...getRootProps()}
          className={cn(
            "cursor-pointer rounded-md border-2 border-dashed p-4 text-center transition-colors",
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400",
            isInvalid ? "border-destructive" : "",
          )}
          aria-invalid={isInvalid}
        >
          <input
            {...getInputProps({
              id: field.name,
              name: field.name,
              onBlur: field.handleBlur,
            })}
          />
          <p className="text-sm">{previewText}</p>

          {!selectedFile && previewUrl ? (
            <div className="mx-auto mt-3 size-[200px] overflow-hidden rounded-lg">
              <img
                src={previewUrl}
                alt="Náhled"
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
        </div>

        {error ? (
          <p className="text-destructive text-sm font-medium">{error}</p>
        ) : null}
      </div>
    </FormBase>
  );
}
