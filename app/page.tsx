"use client";

import { useState, useRef } from "react";
import { encryptLuaFile, getWggFileName, formatBytes } from "./lib/encryption";

interface EncryptedFile {
  name: string;
  blob: Blob;
  size: number;
}

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [encryptedFiles, setEncryptedFiles] = useState<EncryptedFile[]>([]);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [statusText, setStatusText] = useState("Ready");
  const [view, setView] = useState<"encrypt" | "download">("encrypt");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalInputSize = files.reduce((sum, f) => sum + f.size, 0);
  const totalOutputSize = encryptedFiles.reduce((sum, f) => sum + f.size, 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const luaFiles = newFiles.filter((f) => f.name.toLowerCase().endsWith(".lua"));
    setFiles((prev) => [...prev, ...luaFiles]);
    if (luaFiles.length > 0) {
      setStatusText(`${files.length + luaFiles.length} file(s) selected`);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setStatusText(newFiles.length ? `${newFiles.length} file(s) selected` : "Ready");
  };

  const clearFiles = () => {
    setFiles([]);
    setStatusText("Ready");
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const encryptFiles = async () => {
    if (files.length === 0) return;

    setIsEncrypting(true);
    setStatusText("Encrypting...");

    try {
      const encrypted: EncryptedFile[] = [];

      for (const file of files) {
        const blob = await encryptLuaFile(file);
        encrypted.push({
          name: getWggFileName(file.name),
          blob,
          size: blob.size,
        });
      }

      setEncryptedFiles(encrypted);
      setView("download");
      setStatusText("Done");
    } catch (error) {
      console.error("Encryption error:", error);
      alert("Encryption failed. Please try again.");
      setStatusText("Error");
    } finally {
      setIsEncrypting(false);
    }
  };

  const downloadFile = (file: EncryptedFile) => {
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    encryptedFiles.forEach((file) => {
      downloadFile(file);
    });
  };

  const resetToEncrypt = () => {
    setFiles([]);
    setEncryptedFiles([]);
    setView("encrypt");
    setStatusText("Ready");
  };

  return (
    <>
      <header className="header" aria-label="Header">
        <div className="brand" aria-label="WGG Encryptor">
          <span className="brand-dot" aria-hidden="true"></span>
          <span className="brand-title">WGG Encryptor</span>
        </div>
      </header>

      <main>
        <section id="encryptor" className="card" aria-live="polite">
          <div className="card-h">
            <div>
              <div className="card-title">
                {view === "encrypt" ? "Encrypt" : "Download"}
              </div>
              <div className="card-sub">
                {view === "encrypt"
                  ? "Drop your .lua files or click to select. We will create .wgg."
                  : "Your files are encrypted and ready to download."}
              </div>
            </div>
            <div className="status">
              <span
                className="dot"
                style={
                  view === "download"
                    ? {
                        background: "var(--ok)",
                        boxShadow: "0 0 14px rgba(53,208,165,0.8)",
                      }
                    : {}
                }
              ></span>
              <span>{statusText}</span>
            </div>
          </div>

          {view === "encrypt" ? (
            <div className="card-b">
              <label
                className={`dropzone ${isDragging ? "drag" : ""}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".lua"
                  multiple
                  onChange={handleFileChange}
                />
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      color: "var(--accent-2)",
                      marginBottom: "6px",
                    }}
                  >
                    Drop .lua files here
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--muted)" }}>
                    or click to select
                  </div>
                </div>
              </label>

              {files.length > 0 && (
                <div className="list">
                  {files.map((file, idx) => (
                    <div key={idx} className="row">
                      <div className="left">
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "var(--accent)",
                            boxShadow: "0 0 10px var(--glow)",
                          }}
                        ></div>
                        <div style={{ minWidth: 0 }}>
                          <div className="name" title={file.name}>
                            {file.name}
                          </div>
                          <div className="meta">{formatBytes(file.size)}</div>
                        </div>
                      </div>
                      <div className="actions">
                        <button
                          className="pill secondary"
                          onClick={() => removeFile(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button className="btn-ghost" onClick={clearFiles}>
                    Clear selection
                  </button>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div className="card-sub">
                    Input size: {formatBytes(totalInputSize)} • Output size: —
                  </div>
                  <button
                    className="btn-primary"
                    onClick={encryptFiles}
                    disabled={files.length === 0 || isEncrypting}
                  >
                    {isEncrypting ? "Encrypting..." : "Encrypt"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-b">
              <div
                className="card"
                style={{
                  background: "rgba(15,22,48,0.4)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="card-h"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <div>
                    <div className="card-title">Download your files</div>
                    <div className="card-sub">
                      Your files are encrypted and ready to download.
                    </div>
                  </div>
                  <div className="status">
                    <span
                      className="dot"
                      style={{
                        background: "var(--ok)",
                        boxShadow: "0 0 14px rgba(53,208,165,0.8)",
                      }}
                    ></span>
                    <span>Done</span>
                  </div>
                </div>
                <div className="card-b" style={{ gap: "12px" }}>
                  <div className="list">
                    {encryptedFiles.map((file, idx) => (
                      <div key={idx} className="row">
                        <div className="left">
                          <div
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: "var(--ok)",
                              boxShadow: "0 0 10px rgba(53,208,165,0.8)",
                            }}
                          ></div>
                          <div style={{ minWidth: 0 }}>
                            <div className="name" title={file.name}>
                              {file.name}
                            </div>
                            <div className="meta">{formatBytes(file.size)}</div>
                          </div>
                        </div>
                        <div className="actions">
                          <button
                            className="pill"
                            onClick={() => downloadFile(file)}
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div className="card-sub">
                      Input size: {formatBytes(totalInputSize)} • Output size:{" "}
                      {formatBytes(totalOutputSize)}
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button className="btn-ghost" onClick={resetToEncrypt}>
                        Encrypt more
                      </button>
                      <button className="btn-primary" onClick={downloadAll}>
                        Download all
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <section id="faq" className="card" aria-label="FAQ">
          <div className="card-h">
            <div className="card-title">FAQ</div>
          </div>
          <div className="card-b" style={{ paddingTop: "12px" }}>
            <details>
              <summary>Which file types are supported?</summary>
              <p>Only .lua files are supported.</p>
            </details>
            <details>
              <summary>How does the encryption work?</summary>
              <p>
                Your files are encrypted client-side using AES-256-CBC encryption.
                The encryption happens entirely in your browser - no data is sent to
                any server.
              </p>
            </details>
            <details>
              <summary>Where can I use the .wgg file?</summary>
              <p>The .wgg file is only usable in the C:\WGG directory.</p>
            </details>
            <details>
              <summary>Is my data safe?</summary>
              <p>
                Yes! All encryption happens client-side in your browser. Your files
                never leave your computer and are not sent to any server.
              </p>
            </details>
          </div>
        </section>
      </main>

      <div className="footer">
        © {new Date().getFullYear()} WGG Encryptor
      </div>
    </>
  );
}
