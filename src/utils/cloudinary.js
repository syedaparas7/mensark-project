// utils/cloudinary.js (used in your AdminDashboard)
export default async function uploadFileOnCloudinary(files) {
  const base64Files = await Promise.all(
    files.map((file) => toBase64(file))
  );

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: JSON.stringify({ files: base64Files }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Upload failed');
  return data.urls;
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}
