const generateBtn = document.getElementById('generateBtn');

generateBtn.addEventListener('click', runEngine);

async function runEngine() {
    const url = document.getElementById('linkField').value;

    if (!url) {
        alert('Input parameter required!');
        return;
    }

    const status = document.getElementById('status');
    const output = document.getElementById('output');

    status.style.display = 'block';
    output.style.display = 'none';

    try {
        const response = await fetch('/api/analyze-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) throw new Error("Server error during extraction.");
        const data = await response.json();

        // 1. Render Metrics Dashboard
        document.getElementById('scoreOut').innerText = data.intentScore || '0';
        document.getElementById('actionOut').innerText = data.recommendedAction || 'N/A';

        // 2. Map Array Elements to UI Pills
        const painContainer = document.getElementById('painsOut');
        painContainer.innerHTML = ''; // Wipe stale inputs
        
        if (data.painPoints && data.painPoints.length > 0) {
            data.painPoints.forEach(pain => {
                const pill = document.createElement('span');
                pill.className = 'pain-pill';
                pill.innerText = pain;
                painContainer.appendChild(pill);
            });
        } else {
            painContainer.innerHTML = '<span class="subtitle">None detected.</span>';
        }

        // 3. Render Copy Blocks
        document.getElementById('commentOut').innerText = data.comment || 'No comment generated';
        document.getElementById('dmOut').innerText = data.directMessage || 'No message generated';

        output.style.display = 'block';
    } catch (error) {
        console.error(error);
        alert('Unable to communicate with backend. Check server logs.');
    } finally {
        status.style.display = 'none';
    }
}