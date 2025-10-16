"use client";
import React, { useState } from "react";

const AddNews = () => {
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);
  const [agreed, setAgreed] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("Du skal acceptere reglerne før du sender nyheden.");
      return;
    }

    if (!comment && files.length === 0) {
      alert("Skriv en kommentar eller upload mindst én fil.");
      return;
    }

    const formData = new FormData();
    formData.append("comment", comment);
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("http://localhost:4000/api/news", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Nyheden er sendt!");
        setComment("");
        setFiles([]);
        setAgreed(false);
      } else {
        alert("Fejl ved indsendelse af nyheden.");
      }
    } catch (err) {
      console.error(err);
      alert("Noget gik galt!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-6">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        {/* Form container */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Del en nyhed
          </h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <textarea
              placeholder="Skriv en kommentar..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg min-h-[120px]"
            />

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Upload billeder eller videoer
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700"
              />
            </div>

            {/* Preview uploaded files */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="w-24 h-24 border rounded-lg flex items-center justify-center overflow-hidden bg-gray-100 text-xs text-gray-600"
                  >
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(file)}
                        className="object-cover w-full h-full"
                        controls
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4"
              />
              Jeg accepterer reglerne
            </label>

            <button
              type="submit"
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Send nyhed
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AddNews;
