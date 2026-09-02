document.addEventListener('DOMContentLoaded', async () => {
  const contentDiv = document.getElementById('content');
  
  // Get current active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  if (!url || url.startsWith('chrome://')) {
    contentDiv.innerHTML = '<div class="status safe">Cannot scan this page</div>';
    return;
  }

  try {
    // Send URL to our backend
    const response = await fetch('http://localhost:8000/api/scan-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Backend error');
    }

    const data = await response.json();
    
    let html = `<div class="status ${data.status}">${data.status} (Score: ${data.risk_score}/100)</div>`;
    
    if (data.threats_detected && data.threats_detected.length > 0) {
      html += '<div id="details"><strong>Threats:</strong>';
      data.threats_detected.forEach(threat => {
        html += `<div class="threat-item">${threat}</div>`;
      });
      html += '</div>';
    } else {
      html += '<div id="details">No threats detected.</div>';
    }

    contentDiv.innerHTML = html;
  } catch (error) {
    contentDiv.innerHTML = `<div style="color: #ef4444; font-size: 14px;">${error.message || 'Error connecting to PhishShield API. Is the backend running?'}</div>`;
  }
});
