'use client';

import { useState, useRef } from 'react';
import styles from './GalleryUpload.module.css';

interface GalleryUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  maxImages?: number;
}

export default function GalleryUpload({
  values,
  onChange,
  folder = 'hurghada-reiseplaner/tours',
  label = 'Gallery Images',
  maxImages = 50,
}: GalleryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function addImages(newUrls: string[]) {
    const valid = newUrls.filter(u => u.startsWith('http'));
    const combined = [...values, ...valid];
    if (combined.length > maxImages) {
      setError(`Maximum ${maxImages} images`);
      return;
    }
    onChange(combined);
  }

  function removeImage(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= values.length) return;
    const arr = [...values];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    onChange(arr);
  }

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
      addImages([url]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) uploadFile(files[i]);
    }
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) uploadFile(files[i]);
    }
  }

  function handleAddUrl() {
    const url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith('http')) {
      setError('URL must start with http');
      return;
    }
    addImages([url]);
    setUrlInput('');
    setError('');
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text');
    if (text.startsWith('http')) {
      e.preventDefault();
      addImages([text]);
    }
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label} ({values.length})</label>

      {values.length > 0 && (
        <div className={styles.grid}>
          {values.map((url, i) => (
            <div key={`${url}-${i}`} className={styles.thumb}>
              <img src={url} alt={`Image ${i + 1}`} className={styles.thumbImg} />
              <div className={styles.thumbOverlay}>
                <button
                  type="button"
                  className={styles.moveBtn}
                  disabled={i === 0}
                  onClick={() => moveImage(i, i - 1)}
                  title="Move left"
                >
                  ◀
                </button>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeImage(i)}
                  title="Remove"
                >
                  ✕
                </button>
                <button
                  type="button"
                  className={styles.moveBtn}
                  disabled={i === values.length - 1}
                  onClick={() => moveImage(i, i + 1)}
                  title="Move right"
                >
                  ▶
                </button>
              </div>
              <span className={styles.thumbIndex}>{i + 1}</span>
            </div>
          ))}
        </div>
      )}

      <div
        className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
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
        ) : (
          <div className={styles.placeholder}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Klicken oder Bilder hierher ziehen</span>
            <span className={styles.hint}>oder unten eine URL einfügen</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className={styles.hiddenInput}
      />

      <div className={styles.urlRow}>
        <input
          type="text"
          className={styles.urlInput}
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAddUrl(); }}
          placeholder="https://... Bild-URL hinzufügen"
        />
        <button type="button" className={styles.addUrlBtn} onClick={handleAddUrl}>
          Hinzufügen
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
