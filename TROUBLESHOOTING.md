# 🔧 Troubleshooting Guide

## NPM Installation Issues

If you're experiencing problems with `npm install`, here are the most common solutions:

### ✅ **Issue Resolved**
The npm installation issues have been fixed in the latest commit. The following changes were made:
- Removed unnecessary FontAwesome dependencies
- Simplified package.json for better compatibility
- Cleaned up dependency conflicts

### 🚨 **Common Issues & Solutions**

#### 1. **Outdated Node/NPM Versions**
**Problem**: Your versions are slightly outdated
- Current: Node v24.1.0, npm v11.3.0
- Recommended: Node v24.3.0, npm v11.4.2

**Solution**:
```bash
# Update npm
npm install -g npm@latest

# Or update Node.js from https://nodejs.org
```

#### 2. **Corrupted Cache**
**Problem**: npm cache corruption
**Solution**:
```bash
npm cache clean --force
npm cache verify
```

#### 3. **Permission Issues (Windows)**
**Problem**: Permission denied errors
**Solution**:
```bash
# Run PowerShell as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 4. **Network/Proxy Issues**
**Problem**: Cannot connect to npm registry
**Solution**:
```bash
# Check registry
npm config get registry

# Reset to default if needed
npm config set registry https://registry.npmjs.org/

# For corporate networks, you may need proxy settings
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

#### 5. **Fresh Install**
**Problem**: Persistent dependency conflicts
**Solution**:
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json  # Linux/Mac
Remove-Item -Recurse -Force node_modules, package-lock.json  # Windows PowerShell

# Fresh install
npm install
```

### 🔍 **Diagnostic Commands**

```bash
# Check npm and node versions
node --version
npm --version

# Run npm doctor
npm doctor

# Check package installation
npm list --depth=0

# Verify cache
npm cache verify
```

### 📦 **Installation Steps (Guaranteed to Work)**

1. **Backend Installation**:
```bash
cd backend
npm install
```

2. **Frontend Installation**:
```bash
cd frontend
npm install
```

3. **If issues persist**:
```bash
# Clear everything and start fresh
cd frontend
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
npm install

cd ../backend
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
npm install
```

### ⚠️ **Known Warnings (Safe to Ignore)**

The following warnings are normal and don't affect functionality:
- Deprecated Babel plugin warnings
- ESLint version warnings
- Workbox deprecation warnings
- Security vulnerabilities in development dependencies

### 🆘 **Still Having Issues?**

1. **Check your environment**:
   - Windows 10/11 with PowerShell 7+
   - Node.js 18+ and npm 8+
   - Git installed and in PATH

2. **Try alternative approaches**:
   ```bash
   # Use yarn instead of npm
   npm install -g yarn
   yarn install
   
   # Or use npm with legacy peer deps
   npm install --legacy-peer-deps
   ```

3. **Contact support**:
   - Open an issue on [GitHub](https://github.com/Diatonic-AI/voice-chat-app/issues)
   - Include your Node/npm versions and error messages

### ✅ **Verification**

After successful installation, verify everything works:

```bash
# Backend
cd backend
npm start

# Frontend (in new terminal)
cd frontend
npm start
```

Both should start without errors!
