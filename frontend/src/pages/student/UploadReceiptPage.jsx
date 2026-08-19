import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, FileImage, FileText, X, ChevronLeft, CheckCircle2 } from 'lucide-react';
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
    if (!ALLOWED[f.type]) { toast.error('Only JPEG, PNG, and PDF are allowed.'); return; }
    if (f.size > MAX_MB * 1024 * 1024) { toast.error(`File too large. Max ${MAX_MB} MB.`); return; }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) { toast.error('Please select a file.'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('receipt', file);
      await bookingApi.uploadReceipt(id, fd);
      setSuccess(true);
      toast.success('Receipt uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: 500, textAlign: 'center' }}>
          <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <CheckCircle2 size={64} color="var(--accent-400)" />
            <h2>Receipt Uploaded!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Your payment receipt has been submitted. An admin will review your booking shortly.</p>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 520 }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom:'1.5rem' }}>
          <ChevronLeft size={16}/> Back
        </button>
        <h1 style={{ marginBottom:'0.5rem' }}>Upload Payment Receipt</h1>
        <p style={{ color:'var(--text-secondary)', marginBottom:'2rem' }}>
          Upload proof of payment for Booking #{id}. Accepted formats: JPEG, PNG, PDF (max {MAX_MB} MB).
        </p>

        <div
          className={`drop-zone ${dragOver ? 'dragover' : ''} ${file ? 'has-file' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf"
            style={{ display:'none' }} onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />

          {file ? (
            <div className="file-preview">
              {file.type === 'application/pdf' ? <FileText size={40} color="var(--brand-400)"/> : <FileImage size={40} color="var(--accent-400)"/>}
              <div>
                <p style={{ fontWeight: 600, wordBreak:'break-all' }}>{file.name}</p>
                <p style={{ color:'var(--text-secondary)', fontSize:'0.8rem' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button className="btn btn-outline btn-sm" style={{ flexShrink:0 }}
                onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                <X size={14}/> Remove
              </button>
            </div>
          ) : (
            <div className="drop-prompt">
              <Upload size={40} />
              <div>
                <p style={{ fontWeight:600, marginBottom:'0.25rem' }}>Drop your file here</p>
                <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>or click to browse</p>
              </div>
            </div>
          )}
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop:'1.5rem' }}
          onClick={handleSubmit} disabled={!file || loading}>
          {loading ? <><span className="spinner" style={{ width:16,height:16 }}/> Uploading…</> : <><Upload size={16}/> Upload Receipt</>}
        </button>
      </div>

      <style>{`
        .drop-zone { border: 2px dashed var(--glass-border); border-radius: var(--radius-lg); padding: 2.5rem; cursor: pointer; transition: all var(--duration-base); background: rgba(255,255,255,0.02); }
        .drop-zone:hover, .drop-zone.dragover { border-color: var(--brand-500); background: rgba(99,102,241,0.05); }
        .drop-zone.has-file { border-style: solid; border-color: rgba(99,102,241,0.3); }
        .drop-prompt { display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--text-secondary); text-align: center; }
        .file-preview { display: flex; align-items: center; gap: 1rem; }
      `}</style>
    </div>
  );
}
