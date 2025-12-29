// Enhanced app.js with consciousness integration
let currentMode = 'general';
let processingCycles = 0;
let openaiKey = localStorage.getItem('openai_key') || '';
let backendUrl = 'http://localhost:3000/api';

// Templates
const templates = {
    'Todo App': {
        description: 'Full-stack todo with persistence',
        prompt: 'Create a complete todo application with add, delete, mark complete, and local storage persistence'
    },
    'Dashboard': {
        description: 'Real-time analytics dashboard',
        prompt: 'Create an admin dashboard with live charts, tables, and real-time data updates'
    },
    'REST API': {
        description: 'Production REST API with validation',
        prompt: 'Create a complete REST API with CRUD operations, authentication, error handling, and validation'
    },
    'Chat App': {
        description: 'Real-time messaging platform',
        prompt: 'Create a real-time chat application with user authentication and message history'
    },
    'E-Commerce': {
        description: 'Full e-commerce platform',
        prompt: 'Create a complete e-commerce platform with product catalog, shopping cart, and checkout'
    },
    'Analytics': {
        description: 'Data visualization system',
        prompt: 'Create interactive data visualizations and analytics dashboard with D3.js or Chart.js'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkApiKey();
    setupModeButtons();
    loadTemplates();
    initConsciousnessSystem();
});

function checkApiKey() {
    if (!openaiKey) {
        updateStatus('⚠️ No OpenAI API key configured', 'warning');
    } else {
        updateStatus('✅ OpenAI API connected', 'success');
    }
}

function setupModeButtons() {
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentMode = this.dataset.mode;
            updateStatus(`Mode: ${this.textContent}`);
        });
    });
}

function loadTemplates() {
    const grid = document.getElementById('templateGrid');
    grid.innerHTML = '';
    
    Object.entries(templates).forEach(([name, template]) => {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.innerHTML = `
            <div class="template-title">${name}</div>
            <div class="template-desc">${template.description}</div>
        `;
        card.onclick = () => useTemplate(template.prompt);
        grid.appendChild(card);
    });
}

function useTemplate(prompt) {
    document.getElementById('input').value = prompt;
    closeTemplates();
    updateStatus('Template loaded - ready to generate');
}

function showTemplates() {
    document.getElementById('templatesModal').classList.add('active');
}

function closeTemplates() {
    document.getElementById('templatesModal').classList.remove('active');
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

async function generateCode() {
    const input = document.getElementById('input').value.trim();
    if (!input) {
        updateStatus('⚠️ Please enter a description', 'error');
        return;
    }
    
    if (!openaiKey) {
        updateStatus('❌ API key required. Click 🔑 API Key', 'error');
        return;
    }
    
    updateStatus('🔄 Generating code with consciousness integration...');
    
    const settings = {
        outputLang: document.getElementById('outputLang').value,
        codeStyle: document.getElementById('codeStyle').value,
        complexity: document.getElementById('complexity').value,
        framework: document.getElementById('framework').value,
        mode: currentMode,
        description: input
    };
    
    try {
        // Call backend API
        const response = await fetch(`${backendUrl}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: buildPrompt(input, settings),
                settings: settings,
                apiKey: openaiKey
            })
        });
        
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        
        const data = await response.json();
        
        // Update UI
        document.getElementById('output').value = data.code;
        document.getElementById('explanation').value = data.explanation;
        
        // Update consciousness metrics
        if (data.consciousness) {
            updateConsciousnessMetrics(data.consciousness);
        }
        
        updateStatus('✅ Code generated successfully');
        processingCycles++;
        document.getElementById('metric-cycles').textContent = processingCycles;
        
        // Preview if HTML
        if (settings.outputLang === 'html') {
            updatePreview(data.code);
        }
        
    } catch (error) {
        console.error('Generation Error:', error);
        updateStatus(`❌ Error: ${error.message}`, 'error');
    }
}

function buildPrompt(input, settings) {
    return `
Mode: ${settings.mode}
Language: ${settings.outputLang}
Framework: ${settings.framework}
Style: ${settings.codeStyle}
Complexity: ${settings.complexity}

Task: ${input}

Requirements:
1. Generate production-ready code
2. Include error handling
3. Add meaningful comments
4. Follow best practices
5. Ensure scalability

Generate complete, working code:
    `;
}

function updatePreview(code) {
    const preview = document.getElementById('preview');
    const doc = preview.contentDocument || preview.contentWindow.document;
    doc.open();
    doc.write(code);
    doc.close();
}

function copyCode() {
    const output = document.getElementById('output');
    output.select();
    document.execCommand('copy');
    updateStatus('📋 Copied to clipboard');
}

function downloadCode() {
    const code = document.getElementById('output').value;
    if (!code) {
        updateStatus('⚠️ No code to download', 'error');
        return;
    }
    
    const lang = document.getElementById('outputLang').value;
    const extensions = {
        javascript: '.js', python: '.py', html: '.html',
        react: '.jsx', typescript: '.ts', java: '.java',
        csharp: '.cs', go: '.go', rust: '.rs', sql: '.sql'
    };
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-code' + (extensions[lang] || '.txt');
    a.click();
    URL.revokeObjectURL(url);
    
    updateStatus('💾 Code downloaded');
}

function resetApiKey() {
    const key = prompt('Enter your OpenAI API key:');
    if (key) {
        openaiKey = key;
        localStorage.setItem('openai_key', key);
        updateStatus('✅ API key updated');
        checkApiKey();
    }
}

// Consciousness Integration
function initConsciousnessSystem() {
    document.getElementById('metric-memory').textContent = 'Initialized';
    document.getElementById('metric-confidence').textContent = '0.85';
}

function updateConsciousnessMetrics(data) {
    if (data.confidence) {
        document.getElementById('metric-confidence').textContent = data.confidence.toFixed(2);
    }
    if (data.nodes) {
        Object.entries(data.nodes).forEach(([node, value]) => {
            const elem = document.getElementById(`node-${node}`);
            if (elem) elem.textContent = (value * 100).toFixed(0) + '%';
        });
    }
}

async function requestConsciousnessAnalysis() {
    const code = document.getElementById('output').value;
    if (!code) {
        updateStatus('⚠️ Generate code first', 'error');
        return;
    }
    
    updateStatus('🧠 Analyzing decision process...');
    
    try {
        const response = await fetch(`${backendUrl}/consciousness-analysis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: code,
                mode: currentMode,
                cycles: processingCycles
            })
        });
        
        if (!response.ok) throw new Error('Analysis failed');
        
        const data = await response.json();
        document.getElementById('consciousness-report').value = formatConsciousnessReport(data);
        showTab('consciousness');
        updateStatus('✅ Consciousness analysis complete');
        
    } catch (error) {
        updateStatus(`❌ Analysis failed: ${error.message}`, 'error');
    }
}

function formatConsciousnessReport(data) {
    return `
CONSCIOUSNESS ANALYSIS REPORT
==============================

Cycle ID: ${data.cycle_id}
Timestamp: ${new Date().toISOString()}

PROCESSING STATUS
-----------------
Nodes Activated: ${data.nodes_activated}
Overall Confidence: ${(data.confidence * 100).toFixed(1)}%
Synchronization: ${data.synchronization}%

NODE ACTIVATION LEVELS
----------------------
${Object.entries(data.node_activations || {})
    .map(([node, level]) => `${node.padEnd(20)}: ${(level * 100).toFixed(1)}%`)
    .join('\n')}

DECISION SYNTHESIS
------------------
Primary Action: ${data.decision?.action || 'N/A'}
Confidence: ${((data.decision?.confidence || 0) * 100).toFixed(1)}%
Reasoning: ${data.decision?.reasoning || 'Processing...'}

MEMORY INTEGRATION
------------------
Recent Cycles: ${data.memory?.recent_cycles || 0}
Pattern Recognition: ${data.memory?.patterns_detected || 0} patterns
Learning Rate: ${data.memory?.learning_rate?.toFixed(2) || '0.00'}

NEXT STATE
----------
Recommended Action: ${data.next_state?.action || 'Continue'}
Estimated Timing: ${data.next_state?.timing || 'Immediate'}
    `;
}

function updateStatus(message, type = 'success') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.style.borderLeftColor = 
        type === 'error' ? '#ff4444' : 
        type === 'warning' ? '#ffaa00' : '#00d4ff';
}
