import React, { useState } from 'react';
import './GeneratorPage.css';

const GeneratorPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    startImage: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2w5bWx6aG90anE0dGxpY2F4a2w5Z216Z2x2Y2w5bWx6aG90anE0dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cLS1cfxvGOPVpf9g3y/giphy.gif',
    endImage: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3J5bWx6aG90anE0dGxpY2F4a2w5Z216Z2x2Y2w5bWx6aG90anE0dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/T8Cq42t8Y00C1v45QY/giphy.gif',
    finalMessage: 'Yay! See you on the 14th! ❤️',
  });
  const [generatedLink, setGeneratedLink] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Safe Base64 Encoding that supports Emojis
  const safeBtoa = (str) => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      return btoa(str);
    }
  };

  const generateLink = (e) => {
    e.preventDefault();
    const dataObj = {
      n: formData.name,
      si: formData.startImage,
      ei: formData.endImage,
      fm: formData.finalMessage
    };

    const jsonString = JSON.stringify(dataObj);
    const encodedData = safeBtoa(jsonString);

    const link = `${window.location.origin}/?data=${encodedData}`;
    setGeneratedLink(link);
  };

  return (
    <div className="gen-container">
      <div className="generator-glass-card">
        <h1 className="gen-title">Valentine </h1>
        <p className="gen-subtitle">Design Your proposal link</p>

        <form onSubmit={generateLink} className="gen-form">
          <div className="input-row">
            <div className="input-group">
              <label>Their Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Sarah" required />
            </div>
          </div>

          <div className="input-group">
            <label>Initial GIF/Image URL</label>
            <input type="url" name="startImage" value={formData.startImage} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Success GIF/Image URL</label>
            <input type="url" name="endImage" value={formData.endImage} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Success Message (Emojis allowed! 💖)</label>
            <textarea name="finalMessage" value={formData.finalMessage} onChange={handleChange} rows="2" required />
          </div>

          <button type="submit" className="submit-btn">Generate Special Link</button>
        </form>

        {generatedLink && (
          <div className="link-result animate-in">
            <p>Your Link is Ready:</p>
            <div className="copy-area">
              <input readOnly value={generatedLink} id="linkInput" />
              <button onClick={() => {
                navigator.clipboard.writeText(generatedLink);
                alert("Copied to clipboard!");
              }}>Copy</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratorPage;