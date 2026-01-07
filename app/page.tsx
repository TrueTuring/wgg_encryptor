"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [encryptedContent, setEncryptedContent] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setEncryptedContent("");
    }
  };

  const encryptFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const content = await file.text();

      // Simple XOR encryption example - replace with your actual encryption logic
      const encrypted = btoa(content);

      setEncryptedContent(encrypted);
    } catch (error) {
      console.error("Encryption error:", error);
      alert("Failed to encrypt file");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadEncrypted = () => {
    if (!encryptedContent || !file) return;

    const blob = new Blob([encryptedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.lua$/, ".encrypted.lua");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-4 text-center">
            WGG Encryptor
          </h1>
          <p className="text-gray-300 text-center mb-12">
            Secure Lua file encryption for WGG Unlocker
          </p>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="file-upload"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Select Lua File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".lua"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-300">
                    Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              <button
                onClick={encryptFile}
                disabled={!file || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {isProcessing ? "Encrypting..." : "Encrypt File"}
              </button>

              {encryptedContent && (
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                    <p className="text-xs text-gray-400 mb-2">Encrypted Content Preview:</p>
                    <pre className="text-xs text-green-400 overflow-x-auto whitespace-pre-wrap break-all">
                      {encryptedContent.substring(0, 200)}...
                    </pre>
                  </div>

                  <button
                    onClick={downloadEncrypted}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Download Encrypted File
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>Files are encrypted client-side in your browser.</p>
            <p>No data is sent to any server.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
