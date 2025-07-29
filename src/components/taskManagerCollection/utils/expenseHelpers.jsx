export const handleFileUpload = async (e, callbacks) => {
    const {
    setUploading,
    setUploadProgress,
    onFieldChange,
    supabase
  } = callbacks;

  const file = e.target.files[0];
  if (!file) return;

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
      filePath = `receipts/temp_uploads/${crypto.randomUUID()}.${fileExt}`; // Changed from user.id

      // 4. UPLOAD (Same as before)
      const { error: uploadError } = await supabase.storage
        .from("expense-receipts")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          onProgress: (progress) => {
            setUploadProgress(
              Math.round((progress.loaded / progress.total) * 100)
            );
          },
        });

      if (uploadError) throw uploadError;

      // 5. PUBLIC URL (Unchanged)
      const publicUrl = `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/object/public/expense-receipts/${filePath}`;

      onFieldChange({ target: { name: "receiptUrl", value: publicUrl } });
    } catch (error) {
      console.error("Upload error:", error);

      // 6. CLEANUP (Now checks for RLS errors specifically)
      if (filePath && !error.message.includes("row-level security")) {
        await supabase.storage.from("expense-receipts").remove([filePath]);
      }

      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
