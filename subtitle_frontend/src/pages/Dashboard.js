import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

// PUBLIC_INTERFACE
function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      setError("");
      try {
        const resp = await fetch("http://localhost:3001/api/dashboard/jobs");
        if (!resp.ok) throw new Error("Failed to load dashboard jobs");
        const data = await resp.json();
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchJobs();
  }, []);

  return (
    <div className="dashboard-main">
      <h2>Your Sync Jobs</h2>
      {error && <div className="dashboard-error">{error}</div>}
      <div className="job-card-grid">
        {jobs.length === 0 && <div>No jobs found. Upload media/subtitles to begin.</div>}
        {jobs.map(job => (
          <div key={job.sync_id} className={`job-card job-status-${job.status.toLowerCase()}`}>
            <div>
              <strong>Status:</strong> {job.status}
            </div>
            {job.detail && <div className="job-detail">{job.detail}</div>}
            <Link to={`/results/${job.sync_id}`} className="main-btn outline-btn">View Results</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Dashboard;
