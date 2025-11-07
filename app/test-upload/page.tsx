import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';

export default async function TestUploadPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Image Upload
          </h1>
          <p className="text-gray-600 mb-8">
            Upload an image to test Cloudinary integration
          </p>

          <ImageUpload />

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="font-medium text-blue-900 mb-2">How it works:</h2>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Select a JPG or PNG image (max 10MB)</li>
              <li>Preview the image before uploading</li>
              <li>Click Upload to send to Cloudinary</li>
              <li>Images are automatically optimized and converted to WebP</li>
              <li>Multiple sizes are generated (thumbnail, medium, large)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
