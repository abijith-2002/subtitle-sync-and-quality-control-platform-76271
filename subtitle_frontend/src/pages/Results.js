import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/Results.css";

// PUBLIC_INTERFACE
function Results() {
  const { syncId } = useParams();
  const [data, setData] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJob() {
      setError(""); setData(null);
      try {
        const resp = await fetch(`http://localhost:3001/api/dashboard/jobs`);
        if (!resp.ok) throw new Error("Failed to load job");
        const jobs = (await resp.json()).jobs;
        const thisJob = jobs.find(j => j.sync_id === syncId);
        setData(thisJob || {});
      } catch (e) { setError(e.message);}
    }
    async function fetchReport() {
      try {
        const resp = await fetch(`http://localhost:3001/api/report/${syncId}`);
        if (!resp.ok) throw new Error("Failed to load report");
        setReport(await resp.json());
      } catch (e) { setError(e.message);}
    }
    fetchJob(); fetchReport();
  }, [syncId]);

  // Download report and subtitle handlers
  const downloadReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `validation_report_${syncId}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  const downloadSubtitle = async () => {
    try {
      const resp = await fetch(`http://localhost:3001/api/subtitle/aligned/${syncId}`);
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `aligned_${syncId}.srt`;
      a.click(); window.URL.revokeObjectURL(url);
    } catch {
      alert("Download failed");
    }
  };

  function highlightSegments(segments) {
    return Array.isArray(segments) && segments.length > 0
      ? <ul className="highlight-list">{segments.map((seg,i) =>
        <li key={i}>{JSON.stringify(seg)}</li>
      )}</ul>
      : null;
  }

  return (
    <div className="results-main">
      <h2>Validation Results</h2>
      {error && <div className="error-panel">{error}</div>}
      <div className="results-bar">
        <button className="outline-btn" onClick={downloadReport}>Download Report</button>
        <button className="outline-btn" onClick={downloadSubtitle}>Download Aligned Subtitle</button>
        <Link to="/" className="main-btn">Back to Dashboard</Link>
      </div>
      {!report
        ? <div>Loading validation results...</div>
        : <div className="results-grid">
          {report.results.map((item, i) => (
            <div key={i} className={`result-card${item.passed ? " passed" : " failed"}`}>
              <div className="result-type">{item.type.replaceAll("_"," ")}</div>
              <div className={`result-status ${item.passed ? "good" : "bad"}`}>
                {item.passed ? "✔ Pass" : "✖ Fail"}
              </div>
              {item.detail && <div className="result-detail">{item.detail}</div>}
              {item.highlight_segments && highlightSegments(item.highlight_segments)}
            </div>
          ))}
        </div>
      }
    </div>
  );
}
export default Results;
