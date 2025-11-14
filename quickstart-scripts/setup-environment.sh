#!/bin/bash
# Setup Complete AI Agent Development Environment
# This script sets up everything needed to start building AI agents

set -e

echo "🚀 100X AI Agent System - Complete Setup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on macOS or Linux
OS=$(uname -s)
echo "🖥️  Detected OS: $OS"
echo ""

# Function to print colored output
print_step() {
    echo -e "${BLUE}==> $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check prerequisites
print_step "Checking prerequisites..."

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    print_success "Python3 found: $PYTHON_VERSION"
else
    echo "❌ Python3 not found. Please install Python 3.10 or higher."
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_warning "Node.js not found. Some tools (n8n, Trigger.dev) require Node.js."
fi

# Check Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    print_success "Git found: $GIT_VERSION"
else
    echo "❌ Git not found. Please install Git."
    exit 1
fi

# Check Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | tr -d ',')
    print_success "Docker found: $DOCKER_VERSION"
else
    print_warning "Docker not found. Docker is recommended for deployment."
fi

echo ""

# Create project directory structure
print_step "Creating project directory structure..."

PROJECT_DIR="${1:-$HOME/ai-agent-project}"
mkdir -p "$PROJECT_DIR"/{frameworks,models,agents,configs,scripts,logs}

print_success "Created project structure at: $PROJECT_DIR"
echo ""

# Setup Python virtual environment
print_step "Setting up Python virtual environment..."

cd "$PROJECT_DIR"
if [ ! -d "venv" ]; then
    python3 -m venv venv
    print_success "Virtual environment created"
else
    print_warning "Virtual environment already exists"
fi

# Activate virtual environment
source venv/bin/activate

# Install essential Python packages
print_step "Installing essential Python packages..."

pip install --upgrade pip > /dev/null 2>&1

cat > requirements.txt << 'EOF'
# Core AI Agent Frameworks
openai>=1.0.0
anthropic>=0.18.0
google-generativeai>=0.3.0

# Agent Frameworks (install individually as needed)
# metagpt
# crewai
# langchain>=0.1.0
# langgraph>=0.1.0

# LLM Tools
huggingface-hub>=0.20.0
transformers>=4.36.0

# Observability
langfuse>=2.0.0

# API Development
fastapi>=0.109.0
uvicorn>=0.27.0
pydantic>=2.5.0

# Utilities
python-dotenv>=1.0.0
requests>=2.31.0
aiohttp>=3.9.0
tenacity>=8.2.0

# Monitoring
prometheus-client>=0.19.0

# Testing
pytest>=7.4.0
pytest-asyncio>=0.23.0
EOF

echo "📦 Installing packages (this may take a few minutes)..."
pip install -r requirements.txt > /dev/null 2>&1
print_success "Python packages installed"
echo ""

# Create .env template
print_step "Creating environment configuration..."

cat > .env.template << 'EOF'
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google AI Configuration
GOOGLE_API_KEY=your_google_api_key_here

# Hugging Face Configuration
HUGGINGFACE_TOKEN=your_huggingface_token_here

# Langfuse Configuration (for observability)
LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
LANGFUSE_SECRET_KEY=your_langfuse_secret_key
LANGFUSE_HOST=https://cloud.langfuse.com

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/agentdb
REDIS_URL=redis://localhost:6379

# Application Configuration
LOG_LEVEL=INFO
DEBUG=False
EOF

if [ ! -f ".env" ]; then
    cp .env.template .env
    print_success "Created .env file from template"
    print_warning "Please edit .env and add your API keys"
else
    print_warning ".env file already exists"
fi

echo ""

# Create sample agent script
print_step "Creating sample agent script..."

cat > agents/simple_agent.py << 'EOF'
"""
Simple AI Agent Example
This demonstrates a basic agent setup using OpenAI
"""

import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SimpleAgent:
    """A simple AI agent that can answer questions"""
    
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4"
    
    def run(self, prompt: str) -> str:
        """Run the agent with a given prompt"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful AI assistant."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error: {str(e)}"

if __name__ == "__main__":
    agent = SimpleAgent()
    result = agent.run("What is the future of AI agents?")
    print(result)
EOF

print_success "Created sample agent script"
echo ""

# Create Docker Compose for local development
print_step "Creating Docker Compose configuration..."

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL for data persistence
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: agentdb
      POSTGRES_USER: agent
      POSTGRES_PASSWORD: agent_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis for caching
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # n8n for workflow automation
  n8n:
    image: n8nio/n8n
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=admin
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  postgres_data:
  redis_data:
  n8n_data:
EOF

print_success "Created Docker Compose configuration"
echo ""

# Create README for the project
print_step "Creating project README..."

cat > README.md << 'EOF'
# AI Agent Project

This project is set up for building 100X AI Agent Systems.

## Quick Start

1. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```

2. Configure your API keys in `.env`

3. Run the sample agent:
   ```bash
   python agents/simple_agent.py
   ```

## Project Structure

- `frameworks/` - Cloned AI agent frameworks
- `models/` - Downloaded Hugging Face models
- `agents/` - Your custom agent implementations
- `configs/` - Configuration files
- `scripts/` - Utility scripts
- `logs/` - Application logs

## Documentation

See the main guide documents:
- `100X_AI_AGENT_GUIDE.md` - Complete system overview
- `CURATED_RESOURCES.md` - Resource links
- `IMPLEMENTATION_GUIDES.md` - Implementation examples
- `DEPLOYMENT_GUIDE.md` - Deployment instructions

## Next Steps

1. Clone frameworks: `bash scripts/clone-frameworks.sh`
2. Download models: `bash scripts/download-models.sh`
3. Start Docker services: `docker-compose up -d`
4. Build your first agent!

## Useful Commands

```bash
# Start local services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Run tests
pytest

# Activate environment
source venv/bin/activate
```
EOF

print_success "Created project README"
echo ""

# Final summary
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
print_success "Project directory: $PROJECT_DIR"
echo ""
echo "📋 What was created:"
echo "  ✓ Project directory structure"
echo "  ✓ Python virtual environment"
echo "  ✓ Essential Python packages"
echo "  ✓ Environment configuration template"
echo "  ✓ Sample agent script"
echo "  ✓ Docker Compose configuration"
echo "  ✓ Project README"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "1. Navigate to project directory:"
echo "   cd $PROJECT_DIR"
echo ""
echo "2. Activate virtual environment:"
echo "   source venv/bin/activate"
echo ""
echo "3. Edit .env file with your API keys:"
echo "   nano .env"
echo ""
echo "4. Clone frameworks (optional):"
echo "   bash ../quickstart-scripts/clone-frameworks.sh frameworks"
echo ""
echo "5. Start local services:"
echo "   docker-compose up -d"
echo ""
echo "6. Run sample agent:"
echo "   python agents/simple_agent.py"
echo ""
echo "📚 Documentation:"
echo "  - Main guide: 100X_AI_AGENT_GUIDE.md"
echo "  - Resources: CURATED_RESOURCES.md"
echo "  - Implementation: IMPLEMENTATION_GUIDES.md"
echo "  - Deployment: DEPLOYMENT_GUIDE.md"
echo ""
echo "💡 For help, visit: https://github.com/Soldiom/aiguidepro"
echo ""
