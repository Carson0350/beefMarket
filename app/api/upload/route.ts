import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import cloudinary from '@/lib/cloudinary';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPG and PNG are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'wagnerbeef',
            resource_type: 'image',
            transformation: [
              { quality: 'auto', fetch_format: 'auto' }, // Auto WebP conversion
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const result = uploadResult as any;

    // Generate different size URLs
    const baseUrl = result.secure_url.split('/upload/')[0] + '/upload/';
    const publicId = result.public_id;
    const format = result.format;

    const urls = {
      original: result.secure_url,
      large: `${baseUrl}w_1600,h_1200,c_limit,f_auto,q_auto/${publicId}.${format}`,
      medium: `${baseUrl}w_800,h_600,c_limit,f_auto,q_auto/${publicId}.${format}`,
      thumbnail: `${baseUrl}w_200,h_200,c_fill,f_auto,q_auto/${publicId}.${format}`,
    };

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      urls,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Upload failed', error: String(error) },
      { status: 500 }
    );
  }
}
