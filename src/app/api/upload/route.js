import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json(); // expects base64 files or URLs
    const { files } = body;

    const uploads = await Promise.all(
      files.map((file) =>
        cloudinary.uploader.upload(file, {
          folder: 'my_folder',
        })
      )
    );

    return Response.json({
      success: true,
      urls: uploads.map((res) => res.secure_url),
    });
  } catch (err) {
    console.error('[UPLOAD_ERROR]', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
    });
  }
}
