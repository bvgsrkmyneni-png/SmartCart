
import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

interface BackgroundJob {
  jobId: number;
  orderId: number;
  jobType: string;
  status: string;
  message: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const BackgroundJobMonitor = () => {
  const [jobs, setJobs] = useState<BackgroundJob[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Load existing background jobs
    fetch(`${API_URL}/api/jobs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load background jobs");
        }
        return response.json();
      })
      .then((data: BackgroundJob[]) => setJobs(data))
      .catch((error) =>
        console.error("Failed to load background jobs:", error)
      );

    // Automatically select ws:// or wss://
    const websocketURL = new URL(API_URL);
    websocketURL.protocol =
      websocketURL.protocol === "https:" ? "wss:" : "ws:";
    websocketURL.pathname = "/ws-smartcart";
    websocketURL.search = "";
    websocketURL.hash = "";

    // Connect to WebSocket
    const client = new Client({
      brokerURL: websocketURL.toString(),

      reconnectDelay: 5000,

      onConnect: () => {
        client.subscribe("/topic/jobs", (message) => {
          const updatedJob: BackgroundJob = JSON.parse(
            message.body
          );

          setJobs((currentJobs) => {
            const exists = currentJobs.some(
              (job) => job.jobId === updatedJob.jobId
            );

            if (exists) {
              return currentJobs.map((job) =>
                job.jobId === updatedJob.jobId
                  ? updatedJob
                  : job
              );
            }

            return [...currentJobs, updatedJob];
          });
        });
      },

      onStompError: (frame) => {
        console.error(
          "WebSocket STOMP error:",
          frame.headers["message"]
        );
      },

      onWebSocketError: (error) => {
        console.error("WebSocket connection error:", error);
      },
    });

    client.activate();

    return () => {
      void client.deactivate();
    };
  }, []);

  return (
    <div className="job-monitor">
      <h2>Background Job Monitor</h2>

      <table className="job-table">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Order ID</th>
            <th>Task</th>
            <th>Status</th>
            <th>Message</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr key={job.jobId}>
              <td>{job.jobId}</td>
              <td>{job.orderId}</td>
              <td>{job.jobType}</td>
              <td>{job.status}</td>
              <td>{job.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackgroundJobMonitor;
