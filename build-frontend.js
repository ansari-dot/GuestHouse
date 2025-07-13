import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏗️  Building frontend...');

try {
    // Change to client directory
    process.chdir(path.join(__dirname, 'client'));
    
    // Install dependencies if node_modules doesn't exist
    if (!fs.existsSync('node_modules')) {
        console.log('📦 Installing frontend dependencies...');
        execSync('npm install', { stdio: 'inherit' });
    }
    
    // Build the frontend
    console.log('🔨 Building React app...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Create public directory in server if it doesn't exist
    const publicDir = path.join(__dirname, 'server', 'public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Copy build files to server/public
    console.log('📁 Copying build files to server/public...');
    const distPath = path.join(__dirname, 'client', 'dist');
    const publicPath = path.join(__dirname, 'server', 'public');
    
    // Remove existing public directory contents
    if (fs.existsSync(publicPath)) {
        fs.rmSync(publicPath, { recursive: true, force: true });
        fs.mkdirSync(publicPath, { recursive: true });
    }
    
    // Copy all files from dist to public
    copyDirectory(distPath, publicPath);
    
    console.log('✅ Frontend built and copied successfully!');
    console.log('🚀 You can now start the server with: npm run dev');
    
} catch (error) {
    console.error('❌ Error building frontend:', error.message);
    process.exit(1);
}

function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
} 