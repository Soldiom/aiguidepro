#!/bin/bash
# Clone All Essential AI Agent Frameworks
# This script clones the most important frameworks for building a 100X AI agent system

set -e

echo "🚀 Cloning Essential AI Agent Frameworks"
echo "========================================"

# Create directory for frameworks
FRAMEWORKS_DIR="${1:-$HOME/ai-agent-frameworks}"
mkdir -p "$FRAMEWORKS_DIR"
cd "$FRAMEWORKS_DIR"

echo "📂 Using directory: $FRAMEWORKS_DIR"
echo ""

# Array of repositories to clone
declare -a REPOS=(
    "https://github.com/geekan/MetaGPT.git"
    "https://github.com/joaomdmoura/crewAI.git"
    "https://github.com/microsoft/autogen.git"
    "https://github.com/langchain-ai/langgraph.git"
    "https://github.com/agentdock/agentdock.git"
    "https://github.com/ray-project/ray.git"
    "https://github.com/vllm-project/vllm.git"
    "https://github.com/n8n-io/n8n.git"
    "https://github.com/browser-use/browser-use.git"
    "https://github.com/microsoft/playwright.git"
    "https://github.com/langfuse/langfuse.git"
)

# Function to clone repository
clone_repo() {
    local repo_url=$1
    local repo_name=$(basename "$repo_url" .git)
    
    echo "📦 Cloning $repo_name..."
    
    if [ -d "$repo_name" ]; then
        echo "⚠️  $repo_name already exists, skipping..."
    else
        if git clone "$repo_url" --depth 1 2>/dev/null; then
            echo "✅ Successfully cloned $repo_name"
        else
            echo "❌ Failed to clone $repo_name"
        fi
    fi
    echo ""
}

# Clone all repositories in parallel
echo "Starting parallel cloning..."
echo ""

for repo in "${REPOS[@]}"; do
    clone_repo "$repo" &
done

# Wait for all background jobs to complete
wait

echo ""
echo "🎉 Framework cloning complete!"
echo ""
echo "📋 Summary of cloned frameworks:"
ls -1 "$FRAMEWORKS_DIR"
echo ""
echo "💡 Next steps:"
echo "1. Navigate to each framework directory"
echo "2. Read their respective README.md files"
echo "3. Install dependencies with pip or npm"
echo "4. Configure API keys in .env files"
echo ""
echo "For detailed implementation guides, see:"
echo "  - IMPLEMENTATION_GUIDES.md"
echo "  - 100X_AI_AGENT_GUIDE.md"
echo ""
