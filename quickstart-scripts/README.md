# Quick Start Scripts

This directory contains automation scripts to help you quickly set up your 100X AI Agent System.

## Available Scripts

### 1. setup-environment.sh
**Complete development environment setup**

Sets up everything you need to start building AI agents:
- Creates project directory structure
- Sets up Python virtual environment
- Installs essential Python packages
- Creates environment configuration files
- Generates sample agent code
- Configures Docker Compose for local services

**Usage:**
```bash
bash setup-environment.sh [project-directory]
```

**Example:**
```bash
# Setup in default location (~/.../ai-agent-project)
bash setup-environment.sh

# Setup in custom location
bash setup-environment.sh /path/to/my-project
```

### 2. clone-frameworks.sh
**Clone all essential AI agent frameworks**

Clones the most important GitHub repositories for building AI agents:
- MetaGPT
- CrewAI
- AutoGen
- LangGraph
- AgentDock
- Ray
- vLLM
- n8n
- Browser Use
- Playwright
- Langfuse

**Usage:**
```bash
bash clone-frameworks.sh [target-directory]
```

**Example:**
```bash
# Clone to default location (~/ai-agent-frameworks)
bash clone-frameworks.sh

# Clone to custom location
bash clone-frameworks.sh /path/to/frameworks
```

### 3. download-models.sh
**Download Hugging Face models**

Interactive script to download AI models from Hugging Face:
- General purpose models (Qwen2.5, Llama-3.3, Mistral)
- Specialized models (Coding, Vision, Reasoning)
- Batch download options
- Custom model support

**Usage:**
```bash
bash download-models.sh [models-directory]
```

**Example:**
```bash
# Download to default location (./models)
bash download-models.sh

# Download to custom location
bash download-models.sh /path/to/models
```

## Quick Start Guide

### Option 1: Complete Setup (Recommended for Beginners)

Run the complete setup script:
```bash
bash setup-environment.sh
cd ~/ai-agent-project
source venv/bin/activate
```

### Option 2: Manual Setup (For Advanced Users)

1. Clone frameworks:
```bash
bash clone-frameworks.sh
```

2. Download models:
```bash
bash download-models.sh
```

3. Set up your own project structure and configuration

## Prerequisites

Before running these scripts, ensure you have:

- **Python 3.10+** installed
- **Git** installed
- **Docker** (optional, for local services)
- **Node.js** (optional, for n8n and Trigger.dev)
- **Sufficient disk space**:
  - Frameworks: ~5GB
  - Models: ~50-200GB depending on selection

## Environment Variables

After setup, configure these environment variables in your `.env` file:

```bash
# Required
OPENAI_API_KEY=your_key_here
HUGGINGFACE_TOKEN=your_token_here

# Optional but recommended
ANTHROPIC_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
LANGFUSE_PUBLIC_KEY=your_key_here
LANGFUSE_SECRET_KEY=your_key_here
```

## Common Issues

### Permission Denied
If you get permission errors, make scripts executable:
```bash
chmod +x *.sh
```

### Python Not Found
If Python3 is not found:
```bash
# On Ubuntu/Debian
sudo apt-get install python3 python3-pip python3-venv

# On macOS
brew install python3
```

### Git Clone Fails
If cloning fails due to network issues:
- Check your internet connection
- Try cloning individual repositories manually
- Use a VPN if some repositories are blocked

### Disk Space Issues
Models can be very large. To check available space:
```bash
df -h
```

## Script Details

### setup-environment.sh Features
- ✅ Automatic prerequisite checking
- ✅ Python virtual environment creation
- ✅ Package installation
- ✅ Configuration file generation
- ✅ Docker Compose setup
- ✅ Sample code generation
- ✅ Project documentation

### clone-frameworks.sh Features
- ✅ Parallel cloning for speed
- ✅ Shallow clones to save space
- ✅ Duplicate detection
- ✅ Error handling
- ✅ Progress reporting

### download-models.sh Features
- ✅ Interactive model selection
- ✅ Hugging Face authentication
- ✅ Resume capability
- ✅ Disk space warnings
- ✅ Custom model support

## Next Steps

After running the setup scripts:

1. **Configure API Keys**: Edit `.env` file with your API keys
2. **Start Services**: Run `docker-compose up -d` for local services
3. **Test Setup**: Run the sample agent script
4. **Read Documentation**: Review the main guide documents
5. **Build Your First Agent**: Start with simple examples

## Additional Resources

- [100X_AI_AGENT_GUIDE.md](../100X_AI_AGENT_GUIDE.md) - Complete system overview
- [CURATED_RESOURCES.md](../CURATED_RESOURCES.md) - Links to all resources
- [IMPLEMENTATION_GUIDES.md](../IMPLEMENTATION_GUIDES.md) - Implementation examples
- [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) - Production deployment

## Support

For issues or questions:
- Check the documentation in the parent directory
- Review error messages carefully
- Ensure all prerequisites are installed
- Verify API keys and tokens are correct

## License

These scripts are part of the AI Guide Pro project. See the main repository for license information.
