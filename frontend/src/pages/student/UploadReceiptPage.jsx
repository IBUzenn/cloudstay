import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, FileImage, FileText, X, ChevronLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { bookingApi } from '../../api';
import toast from 'react-hot-toast';

const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png', 'application/pdf': '.pdf' };
const MAX_MB  = 5;

export default function UploadReceiptPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const fileRef    = useRef(null);
  const [file,     setFile]     = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  const handleFile = (f) => {
    if (!ALLOWED[f.type]) {
      toast.error('Invalid file type. Only JPEG, PNG, and PDF files are accepted.');
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      toast.error(`File size exceeds limit. Maximum allowed size is ${MAX_MB} MB.`);
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please select a payment receipt file first.');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('receipt', file);
      await bookingApi.uploadReceipt(id, fd);
      setSuccess(true);
      toast.success('Payment receipt uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Receipt upload failed.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: 540 }}>
          <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div className="success-icon-badge">
              <CheckCircle2 size={48} />
            </div>
            <h2>Receipt Uploaded Successfully!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem' }}>
              Your proof of payment for Booking #{id} has been submitted for university admin review.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </button>
          </div>
        </div>
        <style>{`
          .success-icon-badge {
            color: var(--emerald-600);
            margin-bottom: 1rem;
            display: flex;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 540 }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate(-1)}
          style={{ marginBottom: '1.25rem' }}
        >
          <ChevronLeft size={16} /> Back to Booking
        </button>

        <div className="upload-header">
          <h1>Upload Payment Proof</h1>
          <p className="upload-subtext">
            Submit bank payment slip or receipt for Booking #{id}. Accepted formats: JPEG, PNG, PDF (max {MAX_MB}MB).
          </p>
        </div>

        <div
          className={`drop-zone ${dragOver ? 'dragover' : ''} ${file ? 'has-file' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />

          {file ? (
            <div className="file-preview-card">
              <div className="file-icon">
                {file.type === 'application/pdf' ? (
                  <FileText size={32} color="var(--blue-600)" />
                ) : (
                  <FileImage size={32} color="var(--emerald-600)" />
                )}
              </div>
              <div className="file-meta">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm remove-btn"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
              >
                <X size={14} /> Remove
              </button>
            </div>
          ) : (
            <div className="drop-prompt">
              <div className="upload-icon-circle">
                <Upload size={24} />
              </div>
              <div>
                <p className="prompt-main">Drag & drop your receipt document here</p>
                <p className="prompt-sub">or click anywhere to browse files</p>
              </div>
            </div>
          )}
        </div>

        <button
          className="btn btn-primary btn-full btn-lg"
          style={{ marginTop: '1.25rem' }}
          onClick={handleSubmit}
          disabled={!file || loading}
        >
          {loading ? 'Uploading Document...' : (
            <>
              <ShieldCheck size={16} /> Submit Receipt Document
            </>
          )}
        </button>
      </div>

      <style>{`
        .upload-header {
          margin-bottom: 1.5rem;
        }

        .upload-subtext {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-top: 0.2rem;
        }

        .drop-zone {
          border: 2px dashed var(--border-medium);
          border-radius: var(--radius-md);
          padding: 2.5rem 1.5rem;
          cursor: pointer;
          transition: all 140ms ease-in-out;
          background: #ffffff;
        }

        .drop-zone:hover, .drop-zone.dragover {
          border-color: var(--blue-500);
          background: var(--blue-50);
        }

        .drop-zone.has-file {
          border-style: solid;
          border-color: var(--blue-400);
          background: #ffffff;
          padding: 1.25rem;
        }

        .drop-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          text-align: center;
        }

        .upload-icon-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--blue-50);
          border: 1px solid var(--blue-200);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--blue-600);
        }

        .prompt-main {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .prompt-sub {
          font-size: 0.825rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }

        .file-preview-card {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .file-meta {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }

        .file-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          font-size: 0.775rem;
          color: var(--text-muted);
        }

        .remove-btn {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
