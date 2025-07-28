import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/Results.css";

// PUBLIC_INTERFACE
function ReportPage() {
  const { syncId } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchReport() {
      setError("");
      try {
        const resp = await fetch(`http://localhost:3001/api/report/${syncId}`);
        if (!resp.ok) throw new Error("Failed to load report");
        setReport(await resp.json());
      } catch (e) { setError(e.message);}
    }
    fetchReport();
  }, [syncId]);

  function highlightSegments(segments) {
    return Array.isArray(segments) && segments.length > 0
      ? <ul className="highlight-list">{segments.map((seg,i) =>
        <li key={i}>{JSON.stringify(seg)}</li>
      )}</ul>
      : null;
  }

  return (
    <div className="results-main">
      <h2>Validation Report</h2>
      {error && <div className="error-panel">{error}</div>}
      <div className="results-bar">
        <Link to="/" className="main-btn">Back to Dashboard</Link>
      </div>
      {!report
        ? <div>Loading report...</div>
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
export default ReportPage;
