const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Create applications directory if it doesn't exist
const applicationsDir = path.join(__dirname, 'applications');
if (!fs.existsSync(applicationsDir)) {
    fs.mkdirSync(applicationsDir, { recursive: true });
    console.log('📁 Created applications directory');
}

// Function to check what files exist in a directory
function checkDirectoryFiles(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            return { exists: false, files: [] };
        }
        const files = fs.readdirSync(dirPath);
        return { exists: true, files: files };
    } catch (error) {
        return { exists: false, files: [], error: error.message };
    }
}

// Basic route - Server homepage
app.get('/', (req, res) => {
    // Check what files actually exist
    const breastCancerFiles = checkDirectoryFiles(path.join(__dirname, 'applications/breast-cancer'));
    const chatbotFiles = checkDirectoryFiles(path.join(__dirname, 'applications/chatbot'));
    
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Unified Server - Home</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .container {
                background: white;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 700px;
            }
            h1 {
                color: #333;
                margin-bottom: 20px;
                font-size: 2.5em;
            }
            .app-list {
                margin: 30px 0;
                text-align: left;
            }
            .app-item {
                background: #f8f9fa;
                margin: 15px 0;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }
            .status-active {
                color: #28a745;
                font-weight: bold;
            }
            .status-inactive {
                color: #dc3545;
                font-weight: bold;
            }
            .file-list {
                background: #e9ecef;
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
                font-family: monospace;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Unified Server - DEBUG MODE</h1>
            <p>Checking what files actually exist...</p>
            
            <div class="app-list">
                <div class="app-item">
                    <h3>🤖 AI Chatbot</h3>
                    <p><strong>Status:</strong> 
                        <span class="${chatbotFiles.files.length > 0 ? 'status-active' : 'status-inactive'}">
                            ${chatbotFiles.files.length > 0 ? 'FILES FOUND!' : 'No files found'}
                        </span>
                    </p>
                    <p><strong>Directory:</strong> applications/chatbot/</p>
                    <div class="file-list">
                        <strong>Files found:</strong><br>
                        ${chatbotFiles.files.length > 0 ? chatbotFiles.files.join(', ') : 'No files found'}
                    </div>
                    <a href="/chatbot" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 5px;">Try to Access Chatbot</a>
                </div>
                
                <div class="app-item">
                    <h3>🌐 Breast Cancer Website</h3>
                    <p><strong>Status:</strong> 
                        <span class="${breastCancerFiles.files.length > 0 ? 'status-active' : 'status-inactive'}">
                            ${breastCancerFiles.files.length > 0 ? 'FILES FOUND!' : 'No files found'}
                        </span>
                    </p>
                    <p><strong>Directory:</strong> applications/breast-cancer/</p>
                    <div class="file-list">
                        <strong>Files found:</strong><br>
                        ${breastCancerFiles.files.length > 0 ? breastCancerFiles.files.join(', ') : 'No files found'}
                    </div>
                    <a href="/breast-cancer" style="background: #e75480; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 5px;">Try to Access Website</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
});

// Chatbot route - More flexible file detection
app.get('/chatbot', (req, res) => {
    const chatbotDir = path.join(__dirname, 'applications/chatbot');
    
    if (!fs.existsSync(chatbotDir)) {
        return res.status(404).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Directory Not Found</title></head>
            <body>
                <h1>❌ Directory applications/chatbot/ does not exist!</h1>
                <p>Create it with: <code>mkdir applications\\chatbot</code></p>
            </body>
            </html>
        `);
    }
    
    const files = fs.readdirSync(chatbotDir);
    console.log('Chatbot directory files:', files);
    
    // Try to find any HTML file
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    if (htmlFiles.length > 0) {
        // Serve the first HTML file found
        const fileToServe = htmlFiles.includes('rem2.html') ? 'rem2.html' : htmlFiles[0];
        res.sendFile(path.join(chatbotDir, fileToServe));
    } else {
        res.status(404).send(`
            <!DOCTYPE html>
            <html>
            <head><title>No HTML Files Found</title></head>
            <body>
                <h1>❌ No HTML files found in applications/chatbot/</h1>
                <p>Files found: ${files.length > 0 ? files.join(', ') : 'None'}</p>
                <p>Copy your rem2.html file to this directory.</p>
            </body>
            </html>
        `);
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    const chatbotFiles = checkDirectoryFiles(path.join(__dirname, 'applications/chatbot'));
    const breastCancerFiles = checkDirectoryFiles(path.join(__dirname, 'applications/breast-cancer'));
    
    res.json({
        status: 'healthy',
        server: 'Express.js',
        port: PORT,
        timestamp: new Date().toISOString(),
        directories: {
            chatbot: {
                exists: chatbotFiles.exists,
                files: chatbotFiles.files
            },
            breastCancer: {
                exists: breastCancerFiles.exists,
                files: breastCancerFiles.files
            }
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                  SERVER STARTED - DEBUG MODE                ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  🌐 Server Dashboard: http://localhost:${PORT}                   ║
║  📊 Health Check:     http://localhost:${PORT}/api/health        ║
║                                                              ║
║  This version will show exactly what files are detected     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
    
    // Log what files exist
    console.log('\n📁 Checking directory structure...');
    const chatbotFiles = checkDirectoryFiles(path.join(__dirname, 'applications/chatbot'));
    const breastCancerFiles = checkDirectoryFiles(path.join(__dirname, 'applications/breast-cancer'));
    
    console.log('applications/chatbot/:', chatbotFiles.files.length > 0 ? chatbotFiles.files.join(', ') : 'No files found');
    console.log('applications/breast-cancer/:', breastCancerFiles.files.length > 0 ? breastCancerFiles.files.join(', ') : 'No files found');
});