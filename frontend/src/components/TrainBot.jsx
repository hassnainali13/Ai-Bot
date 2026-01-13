import { useEffect, useState } from "react";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import { RiAddLine } from "react-icons/ri";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TrainBot = ({ onBack, onFilesUpdated }) => {
  /* ================= FILE UPLOAD ================= */
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  /* ================= STARTERS ================= */
  const [starters, setStarters] = useState([]);
  const [starterInput, setStarterInput] = useState("");
  const [loadingStarters, setLoadingStarters] = useState(false);

  /* ================= LOAD STARTERS ================= */
  useEffect(() => {
    loadStarters();
  }, []);

  const loadStarters = async () => {
    try {
      setLoadingStarters(true);
      const res = await axios.get(`${API_BASE_URL}/api/starters`);
      setStarters(res.data); // [{_id, text}]
    } catch (err) {
      console.error("Failed to load starters", err);
    } finally {
      setLoadingStarters(false);
    }
  };

  /* ================= UPLOAD FILES ================= */
  const uploadFiles = async () => {
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setUploading(true);
      await axios.post(`${API_BASE_URL}/api/train-txt`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFiles([]);
      onFilesUpdated(); // ✅ refresh right panel list
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  /* ================= ADD STARTER ================= */
  const addStarter = async () => {
    if (!starterInput.trim()) return;
    if (starters.length >= 4) {
      alert("Maximum 4 starter messages allowed");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/starters`, {
        text: starterInput.trim(),
      });

      // ✅ update UI without reload
      setStarters((prev) => [...prev, res.data]);
      setStarterInput("");
    } catch (err) {
      console.error("Failed to add starter", err);
    }
  };

  /* ================= DELETE STARTER ================= */
  const deleteStarter = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/starters/${id}`);

      // ✅ remove from UI instantly
      setStarters((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Failed to delete starter", err);
    }
  };

  return (
    <div className="h-full p-6 flex flex-col gap-6 overflow-y-auto">
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-blue-600 hover:underline"
        >
          <IoMdArrowBack size={18} />
          Back
        </button>
        <h2 className="text-xl font-semibold">Train Bot</h2>
      </div>

      {/* ================= UPLOAD FILES (CENTER ONLY) ================= */}
      <div className="bg-gray-50 border rounded-xl p-4 max-w-xl">
        <h3 className="font-medium mb-2">Upload Training Documents</h3>

        <input
          type="file"
          accept=".txt"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="block mb-3"
        />

        <button
          onClick={uploadFiles}
          disabled={uploading || !files.length}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
      </div>

      {/* ================= STARTER MESSAGES FORM ================= */}
      <div className="bg-gray-50 border rounded-xl p-4 max-w-xl">
        <h3 className="font-medium mb-2">Starter Messages (max 4)</h3>

        <div className="flex gap-2 mb-3">
          <input
            value={starterInput}
            onChange={(e) => setStarterInput(e.target.value)}
            placeholder="Add starter message"
            className="flex-1 border rounded px-3 py-2 text-sm"
          />

          <button
            onClick={addStarter}
            className="bg-green-600 text-white px-3 rounded flex items-center gap-1"
          >
            <RiAddLine />
            Add
          </button>
        </div>

        {loadingStarters ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {starters.map((s) => (
              <span
                key={s._id}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center gap-2"
              >
                {s.text}
                <button
                  onClick={() => deleteStarter(s._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </span>
            ))}

            {!starters.length && (
              <p className="text-xs text-gray-400">
                No starter messages added yet
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainBot;
