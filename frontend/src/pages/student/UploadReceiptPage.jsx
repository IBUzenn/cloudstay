import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, FileImage, FileText, X, ChevronLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { bookingApi } from '../../api';
import toast from 'react-hot-toast';

const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png', 'application/pdf': '.pdf' };
const MAX_MB  = 10;

export default function UploadReceiptPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const fileRef    = useRef(null);
  const [file,     setFile]     = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [success,  setSuccess]  = useState(false);

  const handleFile = (f) => {
    if (!ALLOWED[f.type]) {
      toast.error("This file type isn't supported. Please upload a PDF, JPG or PNG receipt.");
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      toast.error(`The receipt is too large. Please choose a file smaller than ${MAX_MB} MB.`);
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
    setProgress(10);
    
    // Simulate upload progress steps for responsive user feedback
    const timer1 = setTimeout(() => setProgress(45), 200);
    const timer2 = setTimeout(() => setProgress(82), 400);

    try {
      const fd = new FormData();
      fd.append('receipt', file);
      await bookingApi.uploadReceipt(id, fd);
      setProgress(100);
      setSuccess(true);
      toast.success('Receipt uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Receipt upload failed.');
      setProgress(0);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: 540 }}>
          <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div className="success-icon-badge">
              <CheckCircle2 size={52} />
            </div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-primary)' }}>✓ Receipt Uploaded</h2>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', margin: '0.75rem 0 1.5rem', lineHeight: '1.5' }}>
              Your payment receipt for <strong>Booking #{id}</strong> has been submitted successfully.<br />
              <span style={{ display: 'inline-block', marginTop: '0.75rem', padding: '0.3rem 0.85rem', background: 'var(--amber-50)', color: 'var(--amber-800)', border: '1px solid var(--amber-300)', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600 }}>
                Status: Pending Review
              </span>
            </p>
            <div className="alert alert-info" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <strong>What happens next?</strong>
              <p style={{ fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                A hostel administrator will review your payment receipt and verify your room reservation.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-primary btn-full" onClick={() => navigate(`/bookings/${id}`)}>
                View Booking Details
              </button>
            </div>
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
          <h1>Payment Verification</h1>
          <p className="upload-subtext">
            Your reservation requires payment verification. Upload the bank or mobile money payment receipt issued after payment for Booking #{id}.
          </p>
        </div>

        <div className="specs-callout-box">
          <span className="spec-tag">Accepted: PDF, JPG, PNG</span>
          <span className="spec-tag">Maximum size: 10 MB</span>
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
                  <FileText size={36} color="var(--blue-600)" />
                ) : (
                  <FileImage size={36} color="var(--emerald-600)" />
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
                <Upload size={26} />
              </div>
              <div>
                <p className="prompt-main">Tap to select your receipt</p>
                <p className="prompt-sub">or drag file here on desktop</p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-md mobile-choose-btn"
                onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
              >
                📎 Choose Receipt
              </button>
            </div>
          )}
        </div>

        {/* Upload Progress Bar */}
        {loading && (
          <div className="progress-container fade-in" style={{ marginTop: '1.25rem' }}>
            <div className="progress-label-row">
              <span>Uploading receipt...</span>
              <strong>{progress}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.4rem', textAlign: 'center' }}>
              Please keep this page open while your receipt is uploaded.
            </p>
          </div>
        )}

        <button
          className="btn btn-primary btn-full btn-lg"
          style={{ marginTop: '1.25rem' }}
          onClick={handleSubmit}
          disabled={!file || loading}
        >
          {loading ? `Uploading receipt... ${progress}%` : (
            <>
              <ShieldCheck size={16} /> Submit Receipt for Verification
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

        .specs-callout-box {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .spec-tag {
          font-size: 0.775rem;
          font-weight: 600;
          color: var(--blue-700);
          background: var(--blue-50);
          border: 1px solid var(--blue-200);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
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

        .progress-container {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1rem;
        }

        .progress-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .progress-track {
          width: 100%;
          height: 8px;
          background: var(--surface-subtle);
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: var(--blue-600);
          transition: width 200ms ease-out;
        }

        .mobile-choose-btn {
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
