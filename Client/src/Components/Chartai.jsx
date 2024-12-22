import axios from 'axios';
import React, { useState } from 'react';
import LoadingText from './LoadingText';

const Chartai = () => {
  const [question, setQuestion] = useState('');
  const [file, setFile] = useState('');
  const [answer, setAnswer] = useState('');
  const apiKey = import.meta.env.VITE_REACT_AI_API_KEY;
  console.log(file.name);
  
  const fetchData = async () => {
    setAnswer(<LoadingText />);
    // file ? console.log("file has") : console.log("upload file");
    const formData = new FormData();
    if(file)
    {
      formData.append("file",file)
      formData.append("desc",question)
      try 
      {
        const response = await axios.post(`http://localhost:4001/upload`,
            formData
        ) 
        // console.log(response);
        setAnswer(response.data);
        
      } 
      catch (error) {
        console.log("Something Went wrong : ",error);
        
      }
    }
    else
    {

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: question }],
            },
          ],
        }
      );
      setAnswer(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
      setAnswer('An error occurred while fetching data. Please try again.');
    }
   
  }
  
  };

  return (
    <div
      className="container mt-5"
      style={{
        maxWidth: '700px',
        backgroundColor: '#1e1e1e',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
      }}
    >
      <h1 className="text-white mb-4 text-center">Chat AI</h1>
      <div className="mb-4 position-relative">
        <textarea
          className="textarea-dark form-control border-0 text-white"
          rows={4}
          value={question}
          placeholder={file.name ? file.name : "How can I help you today?"}
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            backgroundColor: '#2f2f2f',
            resize: 'none',
            borderRadius: '8px',
            padding: '10px',
          }}
        > 
        </textarea>
        <input
        type="file"
        id="file"
        name="file"
        onChange={(e)=>setFile(e.target.files[0])}
        style={{ display: "none" }}
      />

      {/* Label acting as button */}
      <label
        htmlFor="file"
        className="btn btn-dark position-absolute bottom-0 end-0 mb-2 me-5 btn "
        
      >
        <i className="bi bi-plus-lg"></i>
      </label>
        <button
          className="position-absolute bottom-0 end-0 mb-2 me-2 btn p-1"
          aria-label="Send message"
          onClick={fetchData}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="white"
            className="bi bi-send-fill"
            viewBox="0 0 16 16"
          >
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
          </svg>
        </button>
      </div>
      <pre
        className="text-white p-3"
        style={{
          backgroundColor: '#2f2f2f',
          borderRadius: '8px',
          whiteSpace: 'pre-wrap', // Wrap text instead of horizontal scrolling
          wordWrap: 'break-word', // Break long words
          overflow: 'auto',
          maxHeight: '300px', // Limit height for large responses
        }}
      >
        {answer}
      </pre>
    </div>
  );
};

export default Chartai;
