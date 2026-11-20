import { useRef, useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { uploadImages } from "@/store/slice/AdminSlice/uploadSlice";
import { errMessage } from "../lib/format";
import { cn } from "@/lib/utils";

const MAX_MB = 5;

/**
 * Image uploader with live previews. Files are uploaded to the backend immediately and
 * only the returned URLs are stored in form state.
 *  - single mode: value is a string URL, onChange(url|"")
 *  - multiple mode: value is string[], onChange(urls)
 */
export function ImageUpload({
  value,
  onChange,
  multiple = false,
  max = 8,
  error,
}) {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.adminUpload.uploading);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const urls = multiple ? value || [] : value ? [value] : [];

  const handleFiles = async (fileList) => {
    let files = Array.from(fileList || []).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (files.length === 0) return toast.error("Please choose an image file.");
    if (files.some((f) => f.size > MAX_MB * 1024 * 1024))
      return toast.error(`Each image must be under ${MAX_MB} MB.`);
    if (!multiple) files = files.slice(0, 1);
    if (multiple && urls.length + files.length > max)
      return toast.error(`You can add up to ${max} images.`);

    try {
      const { urls: uploaded } = await dispatch(uploadImages(files)).unwrap();
      onChange(multiple ? [...urls, ...uploaded] : uploaded[0]);
    } catch (err) {
      toast.error(errMessage(err, "Upload failed"));
    }
  };

  const remove = (url) =>
    onChange(multiple ? urls.filter((u) => u !== url) : "");

  return (
    <div className="space-y-2">
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((url, i) => (
            <div
              key={url}
              className="group relative h-24 w-24 overflow-hidden rounded-xl border bg-muted"
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
              {multiple && i === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                  Cover
                </span>
              )}
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => remove(url)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-90 hover:bg-destructive"
              >
                <FiX className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {(multiple ? urls.length < max : urls.length === 0) && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
          }
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center text-sm transition-colors",
            dragging
              ? "border-primary bg-accent"
              : "border-input hover:border-primary/60 hover:bg-accent/50",
            error && "border-destructive",
          )}
        >
          <FiUploadCloud className="h-6 w-6 text-primary" />
          <p className="font-medium">
            {isLoading ? "Uploading…" : "Click to upload or drag & drop"}
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WEBP or GIF · up to {MAX_MB} MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            hidden
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}
    </div>
  );
}
