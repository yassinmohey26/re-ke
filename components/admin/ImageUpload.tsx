'use client';

import { useState, useRef } from 'react';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({ value, onChange, folder = 'hurghada-reiseplaner', label = 'Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }
      const { url } = await res.json();
      onChange(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) uploadFile(file);
  }

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData('text');
    if (text.startsWith('http')) {
      onChange(text);
    }
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>

      <div
        className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''} ${value ? styles.hasImage : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <div className={styles.uploading}>
            <div className={styles.spinner} />
            <span>Uploading...</span>
          </div>
        ) : value ? (
          <div className={styles.preview}>
            <img src={value} alt="Preview" className={styles.previewImg} />
            <div className={styles.overlay}>
              <span>Click or drop to replace</span>
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Click or drag an image here</span>
            <span className={styles.hint}>or paste an image URL</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.hiddenInput}
      />

      <div className={styles.urlRow}>
        <input
          type="text"
          className={styles.urlInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder="https://... or upload above"
        />
        {value && (
          <button type="button" className={styles.removeBtn} onClick={() => onChange('')}>
            ✕
          </button>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
