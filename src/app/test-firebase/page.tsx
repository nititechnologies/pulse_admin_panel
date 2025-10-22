// Simple Firebase test page
'use client';

import { useState } from 'react';
import { testFirebaseConnection } from '@/lib/testFirebase';
import { addArticle } from '@/lib/articles';

export default function FirebaseTest() {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const success = await testFirebaseConnection();
      setTestResult(success ? '✅ Firebase connection successful!' : '❌ Firebase connection failed!');
    } catch (error) {
      setTestResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testArticleUpload = async () => {
    setLoading(true);
    try {
      const testArticle = {
        title: 'Test Article',
        summary: 'This is a test article',
        content: 'Test content for Firebase upload',
        journalistName: 'Test Author',
        category: 'Technology',
        region: 'World',
        source: 'Test Source',
        imageUrl: 'https://via.placeholder.com/400x300',
        readTime: 5,
        tags: ['test', 'firebase'],
        publishedAt: new Date().toISOString(),
      };

      const articleId = await addArticle(testArticle);
      setTestResult(`✅ Article uploaded successfully! ID: ${articleId}`);
    } catch (error) {
      setTestResult(`❌ Article upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Firebase Test Page</h1>
      
      <div className="space-y-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Firebase Connection'}
        </button>

        <button
          onClick={testArticleUpload}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 ml-4"
        >
          {loading ? 'Uploading...' : 'Test Article Upload'}
        </button>

        {testResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <pre className="whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
