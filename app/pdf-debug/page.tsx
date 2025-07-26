'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function PdfDebugPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null);
  const [bucketExists, setBucketExists] = useState<boolean | null>(null);

  // 检查用户登录状态
  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('User check result:', { user, error });
      
      if (user && !error) {
        setUserEmail(user.email || null);
        return user.email || null;
      } else {
        setError('Please login first');
        return null;
      }
    } catch (err) {
      console.error('User check error:', err);
      setError('Failed to check user status');
      return null;
    }
  };

  // 检查 bucket 是否存在
  const checkBucket = async () => {
    try {
      const { data } = await supabase.storage.listBuckets();
      console.log('Buckets:', data);
      
      const pdfBucket = data?.find(bucket => bucket.name === 'pdf');
      setBucketExists(!!pdfBucket);
      
      if (!pdfBucket) {
        setError('PDF bucket does not exist. Please create it in Supabase dashboard.');
      }
      
      return !!pdfBucket;
    } catch (err) {
      console.error('Bucket check error:', err);
      setError('Failed to check bucket status');
      return false;
    }
  };

  // 检查 bucket 内容
  const listBucketContents = async () => {
    try {
      const { data } = await supabase.storage
        .from('pdf')
        .list('', {
          limit: 100,
          offset: 0,
        });
      
      console.log('Bucket contents:', data);
      return data;
    } catch (err) {
      console.error('List bucket error:', err);
      return null;
    }
  };

  useEffect(() => {
    checkUser();
    checkBucket();
  }, []);

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

    const bucketExists = await checkBucket();
    if (!bucketExists) return;

    try {
      setUploading(true);
      setError(null);
      setDebugInfo(null);

      // 使用用户邮箱作为文件名
      const fileName = `${email}.pdf`;
      
      console.log('Starting upload with:', {
        fileName,
        fileSize: file.size,
        fileType: file.type,
        userEmail: email
      });

      const { data, error } = await supabase.storage
        .from('pdf')
        .upload(fileName, file, {
          upsert: true, // 如果文件已存在则覆盖
          contentType: 'application/pdf'
        });

      console.log('Upload result:', { data, error });

      if (error) {
        throw error;
      }

      // 获取公共URL
      const { data: urlData } = supabase.storage
        .from('pdf')
        .getPublicUrl(fileName);

      setUploadedFile(urlData.publicUrl);
      
      // 获取调试信息
      const bucketContents = await listBucketContents();
      setDebugInfo({
        uploadResult: data,
        publicUrl: urlData.publicUrl,
        bucketContents,
        fileInfo: {
          name: file.name,
          size: file.size,
          type: file.type
        }
      });

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
            PDF Upload Debug
          </h1>
          <p className="text-lg text-gray-600">
            Debug PDF upload to Supabase Storage
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className={`p-3 rounded ${userEmail ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`font-medium ${userEmail ? 'text-green-800' : 'text-red-800'}`}>
                User Status: {userEmail ? 'Logged In' : 'Not Logged In'}
              </p>
              {userEmail && <p className="text-sm text-green-600">{userEmail}</p>}
            </div>
            
            <div className={`p-3 rounded ${bucketExists ? 'bg-green-50 border border-green-200' : bucketExists === false ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              <p className={`font-medium ${bucketExists ? 'text-green-800' : bucketExists === false ? 'text-red-800' : 'text-yellow-800'}`}>
                PDF Bucket: {bucketExists ? 'Exists' : bucketExists === false ? 'Missing' : 'Checking...'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploading || !userEmail || !bucketExists}
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
                <p className="text-red-800 font-medium">Error:</p>
                <p className="text-red-700">{error}</p>
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

        {debugInfo && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Troubleshooting Steps</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>1. Check Supabase Dashboard:</strong> Ensure the "pdf" bucket exists in Storage section</p>
            <p><strong>2. Check RLS Policies:</strong> Verify bucket permissions allow authenticated uploads</p>
            <p><strong>3. Check Console:</strong> Open browser console to see detailed error messages</p>
            <p><strong>4. Check Network:</strong> Look for failed network requests in browser dev tools</p>
            <p><strong>5. Environment Variables:</strong> Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set</p>
          </div>
        </div>
      </div>
    </div>
  );
} 