import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TrainingFiles = ({ refreshKey }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/training-files`);
      setFiles(res.data || []);
    } catch (err) {
      console.error("Failed to load files", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [refreshKey]); // 👈 refresh on upload/delete

  const deleteFile = async (id) => {
    await axios.delete(`${API_BASE_URL}/api/training-files/${id}`);
    loadFiles();
  };

  return (
    <div>
      <h3 className="font-semibold mb-3">Training Documents</h3>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}

      {!loading && files.length === 0 && (
        <p className="text-sm text-gray-500">No files uploaded</p>
      )}

      <ul className="space-y-2">
        {files.map((file) => (
          <li
            key={file._id}
            className="flex justify-between items-center bg-white p-2 rounded border"
          >
            <span className="text-sm truncate">{file.filename}</span>

            <button
              onClick={() => deleteFile(file._id)}
              className="text-red-500 text-sm hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainingFiles;
