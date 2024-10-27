import React, { useState, useRef } from "react";
import axios from "axios";
import lockImage from "../images/61457.png";

const Home = () => {
  const [file, setFile] = useState(null);
  const [isIndexing, setIsIndexing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState(""); // State to hold the response
  const [pdfPreview, setPdfPreview] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [clearMessage, setClearMessage] = useState("");

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Ensure a file is selected
      setFile(selectedFile);
      setIsIndexing(true);
      setUploadMessage("");

      // Prepare the form data
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        // Make the POST request to the Flask backend
        const response = await axios.post(
          "http://127.0.0.1:5000/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setUploadMessage(response.data.message); // Display success message
        console.log(response.data.message);

        // Simulate indexing process
        setTimeout(() => {
          setIsIndexing(false);
          setIsReady(true);
          setPdfPreview(URL.createObjectURL(selectedFile)); // For previewing PDF
        }, 2000); // Adjust indexing time as needed
      } catch (error) {
        if (error.response && error.response.data) {
          setUploadMessage(error.response.data.error); // Display error message from backend
          console.error("Error uploading file:", error.response.data.error);
        } else {
          setUploadMessage("An error occurred while uploading the file.");
          console.error("Error uploading file:", error.message);
        }
        setIsIndexing(false);
        setIsReady(false);
      }
    }
  };

  const handleClearFiles = async () => {
    setClearMessage("");
    try {
      const response = await axios.delete("http://127.0.0.1:5000/clear");
      setClearMessage(response.data.message);
      console.log(response.data.message);
      // Optionally, reset other states
      setFile(null);
      setPdfPreview(null);
      setIsIndexing(false);
      setIsReady(false);
      setUploadMessage("");
      setResponseMessage(""); // Clear the response message
      // Reset the file input's value to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setClearMessage(error.response.data.error);
        console.error("Error clearing files:", error.response.data.error);
      } else {
        setClearMessage("An error occurred while clearing the files.");
        console.error("Error clearing files:", error.message);
      }
    }
  };

  const handleChatInput = (event) => {
    setChatMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setChatMessage("Awaiting response"); 
      const response = await axios.post("http://127.0.0.1:5000/chat", {
        message: chatMessage,
      });     
      setChatMessage(""); // Clear the input field if desired

      setResponseMessage(response.data.reply); // Store the response message
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred while sending your message.");
    }
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
            {isIndexing ? (
              <p>Indexing your document...</p>
            ) : isReady ? (
              <p className="ready-message">Ready to Chat!</p>
            ) : null}
          </div>
        )}

        {/* Display upload messages */}
        {uploadMessage && (
          <div className="upload-message">
            <p>{uploadMessage}</p>
          </div>
        )}

        {/* PDF Preview */}
        {pdfPreview && (
          <div className="pdf-preview">
            <h4>
              PDF Preview
              <img src={lockImage} alt="lockImage" className="lockImage" />
            </h4>
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
        <h2 className="heads">Analyze with Hermedoc
          <button onClick={handleClearFiles} className="clear-button">
            Clear documents
          </button>
        </h2><img src="../public/icon-512x512.png" className="lockLogo"></img>
        <div className="chat-history">
          {responseMessage && <p>{responseMessage}</p>}
        </div>
        <div className="chat-box">
          <form style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              placeholder="What's up?"
              value={chatMessage}
              onChange={handleChatInput}
              className="chat-input"
            />
            <button
              type="submit"
              className="submit-button"
              onClick={handleSubmit}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="40"
                height="40"
              >
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
