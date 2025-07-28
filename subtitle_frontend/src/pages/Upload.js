import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Upload.css";

const LANG_OPTS = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
  { code: "ko", label: "Korean" },
];

function Upload() {
  const { token } = useAuth();
  const [mediaFile, setMediaFile] = useState(null);
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleMediaUpload = (e) => setMediaFile(e.target.files[0]);
  const handleSubtitleUpload = (e) => setSubtitleFile(e.target.files[0]);
  const handleLanguage = (e) => setLanguage(e.target.value);

  // Step 1: Upload media file
  async function uploadMedia() {
    const form = new FormData();
    form.append("file", mediaFile);
    const resp = await fetch("http://localhost:3001/api/upload/media", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!resp.ok) throw new Error("Failed to upload media");
    const data = await resp.json();
    return data.media_id;
  }

  // Step 2: Upload subtitle file
  async function uploadSubtitle(media_id) {
    const form = new FormData();
    form.append("file", subtitleFile);
    form.append("media_id", media_id);
    form.append("language", language);
    const resp = await fetch("http://localhost:3001/api/upload/subtitle", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!resp.ok) throw new Error("Failed to upload subtitle");
    const data = await resp.json();
    return data.media_id; // this is sub_id
  }

  // Step 3: Start sync/validation job
  async function syncSubtitle(media_id, sub_id) {
    const params = new URLSearchParams({ media_id, sub_id });
    const resp = await fetch("http://localhost:3001/api/sync/align", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    if (!resp.ok) throw new Error("Failed to start sync/validation");
    const job = await resp.json();
    return job.sync_id;
  }

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    e.preventDefault();
    if (!mediaFile || !subtitleFile) {
      setError("Please select a media and a subtitle file");
      return;
    }
    setLoading(true); setError(""); setStatusMsg("");
    try {
      setStatusMsg("Uploading media...");
      const media_id = await uploadMedia();
      setStatusMsg("Uploading subtitle...");
      const sub_id = await uploadSubtitle(media_id);
      setStatusMsg("Syncing data and running validation...");
      const sync_id = await syncSubtitle(media_id, sub_id);
      setStatusMsg("Submitted! Redirecting to results...");
      setTimeout(() => navigate(`/results/${sync_id}`), 1200);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setStatusMsg("");
    }
  }

  return (
    <div className="upload-main">
      <h2>Upload Media and Subtitle</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <label>Media File (audio/video)
          <input type="file" accept="audio/*,video/*" onChange={handleMediaUpload} required />
        </label>
        <label>Subtitle File (.srt, .vtt, etc.)
          <input type="file" accept=".srt,.vtt,.ass,.ssa,.sub" onChange={handleSubtitleUpload} required />
        </label>
        <label>Subtitle Language
          <select value={language} onChange={handleLanguage}>
            {LANG_OPTS.map(opt => <option value={opt.code} key={opt.code}>{opt.label}</option>)}
          </select>
        </label>
        <button className="main-btn" type="submit" disabled={loading}>{loading ? "Processing..." : "Start Validation"}</button>
        {statusMsg && <div className="form-status">{statusMsg}</div>}
        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  );
}
export default Upload;
