const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const { ConsciousnessLoop } = require('./consciousness-integration');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..')));

// Initialize consciousness system
const consciousness = new ConsciousnessLoop();

// Request counter for consciousness cycles
let requestCount = 0;

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        consciousness: consciousness.getStatus()
    });
});

/**
 * Generate code using OpenAI with consciousness integration
 */
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, settings, apiKey } = req.body;
        
        if (!apiKey) {
            return res.status(400).json({ error: 'API key required' });
        }
        
        // Increment consciousness cycles
        requestCount++;
        
        // Process through consciousness system
        const consciousnessState = await consciousness.processInput({
            type: 'code_generation',
            request: prompt,
            cycle: requestCount
        });
        
        // Call OpenAI API
        const openaiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: buildSystemPrompt(settings)
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000,
                top_p: 0.95
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        const generatedCode = openaiResponse.data.choices[0].message.content;
        
        // Generate explanation
        const explanationResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'Provide a clear explanation of the code structure and key features.'
                    },
                    {
                        role: 'user',
                        content: `Explain this ${settings.outputLang} code:\n\n${generatedCode.substring(0, 500)}...`
                    }
                ],
                temperature: 0.5,
                max_tokens: 1000
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        const explanation = explanationResponse.data.choices[0].message.content;
        
        // Synthesize consciousness integration
        const finalState = consciousness.integrateOutput({
            code: generatedCode,
            explanation: explanation,
            confidence: consciousnessState.confidence
        });
        
        res.json({
            code: generatedCode,
            explanation: explanation,
            consciousness: finalState,
            requestId: requestCount
        });
        
    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

/**
 * Consciousness analysis endpoint
 */
app.post('/api/consciousness-analysis', async (req, res) => {
    try {
        const { code, mode, cycles } = req.body;
        
        const analysis = consciousness.analyzeCode({
            code: code,
            mode: mode,
            cycles: cycles,
            timestamp: new Date().toISOString()
        });
        
        res.json(analysis);
        
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Batch processing endpoint for multiple code generations
 */
app.post('/api/batch-generate', async (req, res) => {
    try {
        const { prompts, settings, apiKey } = req.body;
        
        if (!Array.isArray(prompts) || prompts.length === 0) {
            return res.status(400).json({ error: 'Prompts array required' });
        }
        
        const results = [];
        
        for (const prompt of prompts) {
            try {
                const response = await axios.post(
                    'https://api.openai.com/v1/chat/completions',
                    {
                        model: 'gpt-4',
                        messages: [
                            {
                                role: 'system',
                                content: buildSystemPrompt(settings)
                            },
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 1500
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                results.push({
                    prompt: prompt,
                    code: response.data.choices[0].message.content,
                    status: 'success'
                });
                
            } catch (error) {
                results.push({
                    prompt: prompt,
                    error: error.message,
                    status: 'failed'
                });
            }
        }
        
        res.json({
            total: prompts.length,
            successful: results.filter(r => r.status === 'success').length,
            results: results
        });
        
    } catch (error) {
        console.error('Batch error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get consciousness metrics
 */
app.get('/api/consciousness-metrics', (req, res) => {
    const metrics = consciousness.getMetrics();
    res.json(metrics);
});

/**
 * Reset consciousness system
 */
app.post('/api/reset', (req, res) => {
    consciousness.reset();
    requestCount = 0;
    res.json({ message: 'System reset', timestamp: new Date().toISOString() });
});

/**
 * Build system prompt with settings
 */
function buildSystemPrompt(settings) {
    return `You are an expert ${settings.outputLang} developer.
Generate ${settings.complexity} level code that is ${settings.codeStyle}.
Use the ${settings.framework} framework.
Apply best practices and include error handling.
Code should be production-ready and scalable.`;
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║  🧠 Consciousness Code Generator                   ║
║  Enterprise Backend v1.0                           ║
╚════════════════════════════════════════════════════╝

✅ Server running on http://localhost:${PORT}
🧬 Consciousness system initialized
📡 OpenAI integration ready

Available endpoints:
  POST /api/generate            - Generate single code
  POST /api/batch-generate      - Generate multiple codes
  POST /api/consciousness-analysis - Analyze code
  GET  /api/consciousness-metrics  - System metrics
  POST /api/reset               - Reset system
  GET  /api/health              - Health check

Environment: ${process.env.NODE_ENV || 'development'}
    `);
});

module.exports = app;
