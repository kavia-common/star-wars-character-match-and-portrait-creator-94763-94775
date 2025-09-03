import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

/**
 * PUBLIC_INTERFACE
 * Upload component: supports file picker and camera capture. Ties upload to a resultId and
 * then navigates to result page.
 */
export default function Upload() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const resultId = state?.resultId;
  const preloadMatch = state?.match;
  const preloadDescription = state?.description;

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Camera
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    return () => {
      // Stop tracks on unmount
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch (e) {
      setError('Unable to access camera. Please allow permissions or use file upload.');
    }
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (blob) {
        const f = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        setFile(f);
        const url = URL.createObjectURL(f);
        setPreview(url);
      }
    }, 'image/jpeg', 0.92);
  };

  const upload = async () => {
    if (!file) { setError('Please select or capture a selfie first.'); return; }
    try {
      setBusy(true);
      const data = await api.uploadSelfie(file, resultId);
      const mashupUrl = data.mashupUrl || data.imageUrl;
      navigate('/result', {
        state: {
          resultId: resultId || data.resultId,
          match: preloadMatch,
          description: preloadDescription,
          mashupUrl
        }
      });
    } catch (e) {
      setError('Upload failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div className="panel">
        <div className="panel-inner">
          <div className="section-title">Selfie Upload</div>
          <div className="subtitle">Use your webcam or upload a photo from your device.</div>

          <div className="uploader-grid" style={{ marginTop: 10 }}>
            <div className="uploader">
              <label className="label" htmlFor="file">Upload a file</label>
              <input id="file" type="file" accept="image/*" className="input" onChange={onPick} />
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-icon" onClick={startCamera} type="button">📷 Use Camera</button>
                <button className="btn btn-primary btn-icon" onClick={upload} disabled={busy} type="button">
                  {busy ? 'Uploading…' : 'Generate Mashup'}
                </button>
              </div>
              {error && <div style={{ color: '#ff6b6b', marginTop: 8 }}>{error}</div>}
            </div>

            <div className="preview">
              {preview ? (
                <img src={preview} alt="Preview" />
              ) : (
                <div style={{ padding: 14 }}>
                  <div className="subtitle">Live camera or selected image will appear here.</div>
                </div>
              )}
              {/* Hidden canvas used for capture */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          </div>

          {streaming && (
            <div className="panel" style={{ marginTop: 14 }}>
              <div className="panel-inner">
                <div className="section-title">Camera</div>
                <video ref={videoRef} playsInline muted style={{ width: '100%', borderRadius: 12 }} />
                <div style={{ marginTop: 10 }}>
                  <button className="btn btn-primary btn-icon" type="button" onClick={capture}>📸 Capture</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
