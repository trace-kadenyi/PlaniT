import { supabase } from "../../../globalUtils/supabaseClient";

// handle file upload
export const handleFileUpload = async (e, callbacks) => {
  const { setUploading, setUploadProgress, onFieldChange } = callbacks;

  const file = e.target.files[0];
  if (!file) return;

  // 🔑allow re-selecting the same file
  e.target.value = "";

  // 1. VALIDATION (Keep all security checks)
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];
  if (!validTypes.includes(file.type)) {
    alert("Only JPEG, PNG, WEBP, or PDF files allowed");
    return;
  }

  // 2. FILE SIZE CHECK (Keep this)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    alert("File must be smaller than 5MB");
    return;
  }

  setUploading(true);
  setUploadProgress(0);

  let filePath = "";
  try {
    // 3. MODIFIED UPLOAD PATH (Temporary public folder)
    const fileExt = file.name.split(".").pop();
    filePath = `receipts/temp_uploads/${crypto.randomUUID()}.${fileExt}`;

    // Create a progress tracker
    let lastProgressUpdate = Date.now();
    const progressTracker = (progress) => {
      const now = Date.now();
      // Throttle updates to prevent UI overload
      if (
        now - lastProgressUpdate > 100 ||
        progress.loaded === progress.total
      ) {
        setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
        lastProgressUpdate = now;
      }
    };

    // 4. UPLOAD
    const { error: uploadError } = await supabase.storage
      .from("planit-receipts")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        onProgress: progressTracker,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("planit-receipts")
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    onFieldChange({ target: { name: "receiptUrl", value: publicUrl } });

    setUploadProgress(100);
  } catch (error) {
    console.error("Upload error:", error);

    if (filePath) {
      await supabase.storage.from("planit-receipts").remove([filePath]);
    }

    alert(`Upload failed: ${error.message}`);
  } finally {
    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
    }, 500);
  }
};

// handle remove receipt
export const handleRemoveReceipt = async ({ form, onFieldChange }) => {
  if (!form.receiptUrl) return;

  try {
    const url = new URL(form.receiptUrl);

    const filePath = url.pathname.split("/planit-receipts/")[1];

    if (!filePath) {
      throw new Error("Invalid receipt URL");
    }

    const { error } = await supabase.storage
      .from("planit-receipts")
      .remove([filePath]);

    // Always clear the form field
    onFieldChange({ target: { name: "receiptUrl", value: "" } });

    if (error) throw error;
  } catch (error) {
    console.error("Failed to delete receipt:", error);
    alert(`Couldn't remove receipt: ${error.message}`);
  }
};
