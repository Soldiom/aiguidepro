#!/bin/bash
# Download Essential Hugging Face Models
# This script downloads the most important models for building AI agents

set -e

echo "🤗 Downloading Essential Hugging Face Models"
echo "============================================="

# Check if huggingface-cli is installed
if ! command -v huggingface-cli &> /dev/null; then
    echo "📦 Installing Hugging Face CLI..."
    pip install huggingface-hub
fi

# Check if user is logged in
if ! huggingface-cli whoami &> /dev/null; then
    echo "🔐 Please login to Hugging Face"
    echo "You can get your token from: https://huggingface.co/settings/tokens"
    huggingface-cli login
fi

# Create models directory
MODELS_DIR="${1:-./models}"
mkdir -p "$MODELS_DIR"

echo ""
echo "📂 Using directory: $MODELS_DIR"
echo ""

# Function to download model
download_model() {
    local model_name=$1
    local local_dir=$2
    
    echo "⬇️  Downloading $model_name..."
    
    if [ -d "$local_dir" ]; then
        echo "⚠️  Model directory already exists: $local_dir"
        read -p "Do you want to re-download? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "⏭️  Skipping $model_name"
            echo ""
            return
        fi
    fi
    
    if huggingface-cli download "$model_name" --local-dir "$local_dir"; then
        echo "✅ Successfully downloaded $model_name"
    else
        echo "❌ Failed to download $model_name"
    fi
    echo ""
}

# Interactive model selection
echo "Select models to download:"
echo ""
echo "General Purpose Models:"
echo "  1) Qwen2.5-7B-Instruct (7B - Fast, efficient)"
echo "  2) Qwen2.5-14B-Instruct (14B - Balanced)"
echo "  3) Qwen2.5-32B-Instruct (32B - High quality)"
echo "  4) Qwen2.5-72B-Instruct (72B - Best quality)"
echo ""
echo "Specialized Models:"
echo "  5) Qwen2.5-Coder-32B-Instruct (Coding)"
echo "  6) Llama-3.2-11B-Vision-Instruct (Vision)"
echo "  7) QwQ-32B-Preview (Reasoning)"
echo ""
echo "  8) Download all recommended models"
echo "  9) Custom model name"
echo "  0) Exit"
echo ""

read -p "Enter your choice (0-9): " choice

case $choice in
    1)
        download_model "Qwen/Qwen2.5-7B-Instruct" "$MODELS_DIR/qwen25-7b"
        ;;
    2)
        download_model "Qwen/Qwen2.5-14B-Instruct" "$MODELS_DIR/qwen25-14b"
        ;;
    3)
        download_model "Qwen/Qwen2.5-32B-Instruct" "$MODELS_DIR/qwen25-32b"
        ;;
    4)
        download_model "Qwen/Qwen2.5-72B-Instruct" "$MODELS_DIR/qwen25-72b"
        ;;
    5)
        download_model "Qwen/Qwen2.5-Coder-32B-Instruct" "$MODELS_DIR/qwen25-coder-32b"
        ;;
    6)
        download_model "meta-llama/Llama-3.2-11B-Vision-Instruct" "$MODELS_DIR/llama32-11b-vision"
        ;;
    7)
        download_model "Qwen/QwQ-32B-Preview" "$MODELS_DIR/qwq-32b"
        ;;
    8)
        echo "📦 Downloading all recommended models..."
        echo "⚠️  This will download approximately 200GB of data!"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            download_model "Qwen/Qwen2.5-7B-Instruct" "$MODELS_DIR/qwen25-7b"
            download_model "Qwen/Qwen2.5-32B-Instruct" "$MODELS_DIR/qwen25-32b"
            download_model "Qwen/Qwen2.5-Coder-32B-Instruct" "$MODELS_DIR/qwen25-coder-32b"
        fi
        ;;
    9)
        read -p "Enter Hugging Face model name (e.g., Qwen/Qwen2.5-7B-Instruct): " model_name
        read -p "Enter local directory name: " local_name
        download_model "$model_name" "$MODELS_DIR/$local_name"
        ;;
    0)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Model download process complete!"
echo ""
echo "📋 Downloaded models are in: $MODELS_DIR"
echo ""
echo "💡 Next steps:"
echo "1. Configure your LLM serving with vLLM or TGI"
echo "2. Point your agent framework to the local models"
echo "3. Test the models with sample prompts"
echo ""
echo "For detailed usage guides, see:"
echo "  - IMPLEMENTATION_GUIDES.md"
echo "  - DEPLOYMENT_GUIDE.md"
echo ""
