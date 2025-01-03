// components/LinkChecker.js

import { useState } from 'react';

export default function LinkChecker() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckLink = async () => {
    if (!url) {
      alert('Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/check-link?url=${url}`);
      const data = await res.json();
      
      if (res.ok) {
        setStatus(`Status: ${data.status} - ${data.message}`);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Link Checker</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button onClick={handleCheckLink} disabled={loading}>
        {loading ? 'Checking...' : 'Check Link'}
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
