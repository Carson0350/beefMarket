import cloudinary from './cloudinary';

export interface UploadResult {
  urls: {
    original: string;
    large: string;
    medium: string;
    thumbnail: string;
  };
  publicId: string;
}

export async function uploadImage(buffer: Buffer): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
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
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error('Upload failed: no result'));
            return;
          }

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

          resolve({
            urls,
            publicId: result.public_id,
          });
        }
      )
      .end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
