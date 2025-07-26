'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PdfTestPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // 检查用户登录状态
  const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user && !error) {
      setUserEmail(user.email || null);
      return user.email || null;
    } else {
      setError('Please login first');
      return null;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    // 验证文件大小
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError('File size must be less than 50MB');
      return;
    }

    const email = await checkUser();
    if (!email) return;

    try {
      setUploading(true);
      setError(null);

      // 使用用户邮箱作为文件名
      const fileName = `${email}.pdf`;
      
      const { data, error } = await supabase.storage
        .from('pdf')
        .upload(fileName, file, {
          upsert: true, // 如果文件已存在则覆盖
          contentType: 'application/pdf'
        });

      if (error) {
        throw error;
      }

      // 获取公共URL
      const { data: urlData } = supabase.storage
        .from('pdf')
        .getPublicUrl(fileName);

      setUploadedFile(urlData.publicUrl);
      console.log('PDF uploaded successfully:', data.path);
      console.log('PDF public URL:', urlData.publicUrl);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            PDF Upload Test
          </h1>
          <p className="text-lg text-gray-600">
            Test PDF upload to Supabase Storage
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload PDF</h2>
          
          {userEmail ? (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800">
                <strong>Logged in as:</strong> {userEmail}
              </p>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800">
                <strong>Not logged in.</strong> Please login to upload files.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploading || !userEmail}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {uploading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Uploading...
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {uploadedFile && (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 mb-2">
                  <strong>Upload successful!</strong>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  File URL: {uploadedFile}
                </p>
                <a
                  href={uploadedFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View PDF
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Instructions</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>1. Login:</strong> Make sure you're logged in with your Google account</p>
            <p><strong>2. Select PDF:</strong> Choose a PDF file (max 50MB)</p>
            <p><strong>3. Upload:</strong> The file will be saved as "{userEmail || 'your-email'}.pdf"</p>
            <p><strong>4. Access:</strong> The file will be available at the generated URL</p>
          </div>
        </div>
      </div>
    </div>
  );
} 