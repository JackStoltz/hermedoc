import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import lockImage from '../images/61457.png';

const Home = () => {
  const [file, setFile] = useState(null);
  const [isIndexing, setIsIndexing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [pdfPreview, setPdfPreview] = useState(null);

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) { // Ensure a file is selected
      setFile(selectedFile);
      setIsIndexing(true);

      // Simulate indexing process
      setTimeout(() => {
        setIsIndexing(false);
        setIsReady(true);
        setPdfPreview(URL.createObjectURL(selectedFile)); // For previewing PDF
      }, 2000); // Adjust indexing time as needed
    }
  };

  const clearFile = () => {
    setFile(null);
    setPdfPreview(null);
    setIsIndexing(false);
    setIsReady(false);

    // Reset the file input's value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChatInput = (event) => {
    setChatMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add code to send chatMessage to backend
    console.log("Sending message:", chatMessage);
  };

  return (
    <div className="home-container">
      {/* Left Panel */}
      <div className="left-panel">
        <h2>Securely add document</h2>
        <p>
          Choose your <span className="pdf-highlight">.pdf</span> file
        </p>
        <div className="file-upload">
          <input
            type="file"
            accept=".pdf"
            className="file-input"
            id="file-upload"
            onChange={handleFileUpload}
            ref={fileInputRef} // Attach the ref here
          />
          <label htmlFor="file-upload" className="file-label">
            Drag and drop file here
          </label>
          <br />
          <label htmlFor="file-upload" className="browse-label">
            Browse files
          </label>
        </div>

        {file && (
          <div className="file-info">
            <p>{file.name}</p>
            {isIndexing ? (
              <p>Indexing your document...</p>
            ) : isReady ? (
              <p className="ready-message">Ready to Chat!</p>
            ) : null}
          </div>
        )}

        {/* PDF Preview */}
        {pdfPreview && (
          <div className="pdf-preview">
            <h4>PDF Preview<img src={lockImage} alt="lockImage" className="lockImage"/></h4>
            <iframe
              src={pdfPreview}
              title="PDF Preview"
              className="pdf-iframe"
            />
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <h2>Chat with Docs using Llama-3</h2>
        <button onClick={clearFile} className="clear-button">
          Clear
        </button>
        <div className="chat-box">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="What's up?"
              value={chatMessage}
              onChange={handleChatInput}
              className="chat-input"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
