# Deployment Guide for 100X AI Agent System

## Table of Contents

1. [Docker Deployment](#docker-deployment)
2. [Kubernetes Deployment](#kubernetes-deployment)
3. [Serverless Deployment](#serverless-deployment)
4. [Cloud Platforms](#cloud-platforms)
5. [Production Best Practices](#production-best-practices)

---

## Docker Deployment

### Basic Dockerfile for MetaGPT Agent

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV OPENAI_API_KEY=""

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "main.py"]
```

### Docker Compose for Multi-Service Setup

```yaml
version: '3.8'

services:
  # MetaGPT Agent Service
  agent:
    build: ./agent
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
      - postgres
    ports:
      - "8000:8000"
    restart: unless-stopped

  # vLLM Service for LLM Serving
  vllm:
    image: vllm/vllm-openai:latest
    command: >
      --model Qwen/Qwen2.5-32B-Instruct
      --host 0.0.0.0
      --port 8001
    ports:
      - "8001:8001"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    restart: unless-stopped

  # n8n Workflow Automation
  n8n:
    image: n8nio/n8n
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n
    restart: unless-stopped

  # Redis for caching and message queue
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # PostgreSQL for data persistence
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=agentdb
      - POSTGRES_USER=agent
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  # Langfuse for observability
  langfuse:
    image: langfuse/langfuse:latest
    environment:
      - DATABASE_URL=postgresql://agent:${POSTGRES_PASSWORD}@postgres:5432/langfuse
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=http://localhost:3000
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  n8n_data:
  redis_data:
  postgres_data:
```

### Build and Run

```bash
# Create .env file
cat > .env << EOF
OPENAI_API_KEY=your_openai_key
N8N_PASSWORD=your_n8n_password
POSTGRES_PASSWORD=your_postgres_password
NEXTAUTH_SECRET=your_nextauth_secret
EOF

# Build and start services
docker-compose up -d

# Check logs
docker-compose logs -f agent

# Scale agents
docker-compose up -d --scale agent=5
```

---

## Kubernetes Deployment

### Agent Deployment

```yaml
# agent-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-agent
  labels:
    app: ai-agent
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-agent
  template:
    metadata:
      labels:
        app: ai-agent
    spec:
      containers:
      - name: agent
        image: your-registry/ai-agent:latest
        ports:
        - containerPort: 8000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: agent-secrets
              key: openai-api-key
        - name: REDIS_URL
          value: "redis://redis-service:6379"
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: ai-agent-service
spec:
  selector:
    app: ai-agent
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

### vLLM Deployment with GPU

```yaml
# vllm-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: vllm-server
  template:
    metadata:
      labels:
        app: vllm-server
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:latest
        args:
          - --model
          - Qwen/Qwen2.5-32B-Instruct
          - --host
          - 0.0.0.0
          - --port
          - "8001"
        ports:
        - containerPort: 8001
        resources:
          limits:
            nvidia.com/gpu: 1
          requests:
            nvidia.com/gpu: 1
---
apiVersion: v1
kind: Service
metadata:
  name: vllm-service
spec:
  selector:
    app: vllm-server
  ports:
  - port: 8001
    targetPort: 8001
  type: ClusterIP
```

### Secrets Management

```yaml
# secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: agent-secrets
type: Opaque
stringData:
  openai-api-key: "your-openai-key"
  huggingface-token: "your-hf-token"
```

### Horizontal Pod Autoscaler

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-agent-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ai-agent
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace ai-agents

# Apply secrets
kubectl apply -f secrets.yaml -n ai-agents

# Deploy services
kubectl apply -f agent-deployment.yaml -n ai-agents
kubectl apply -f vllm-deployment.yaml -n ai-agents
kubectl apply -f hpa.yaml -n ai-agents

# Check status
kubectl get pods -n ai-agents
kubectl get services -n ai-agents

# View logs
kubectl logs -f deployment/ai-agent -n ai-agents

# Scale manually
kubectl scale deployment/ai-agent --replicas=10 -n ai-agents
```

---

## Serverless Deployment

### AWS Lambda with MetaGPT

```python
# lambda_handler.py
import json
import asyncio
from metagpt.roles import Researcher

def lambda_handler(event, context):
    """AWS Lambda handler for AI agent"""
    
    # Parse input
    body = json.loads(event['body'])
    topic = body.get('topic')
    
    # Run agent
    async def run():
        researcher = Researcher()
        result = await researcher.run(topic)
        return result
    
    result = asyncio.run(run())
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'result': result
        })
    }
```

### Serverless Framework Configuration

```yaml
# serverless.yml
service: ai-agent-system

provider:
  name: aws
  runtime: python3.10
  region: us-east-1
  memorySize: 3008
  timeout: 900
  environment:
    OPENAI_API_KEY: ${env:OPENAI_API_KEY}
  
functions:
  research:
    handler: lambda_handler.lambda_handler
    events:
      - http:
          path: research
          method: post
          cors: true
    layers:
      - arn:aws:lambda:us-east-1:123456789:layer:metagpt-layer:1

plugins:
  - serverless-python-requirements

custom:
  pythonRequirements:
    dockerizePip: true
```

### Deploy to AWS Lambda

```bash
# Install Serverless Framework
npm install -g serverless

# Configure AWS credentials
aws configure

# Deploy
serverless deploy

# Invoke function
serverless invoke -f research --data '{"topic": "AI trends"}'

# View logs
serverless logs -f research --tail
```

### Google Cloud Functions

```python
# main.py
import functions_framework
import asyncio
from metagpt.roles import Researcher

@functions_framework.http
def research_agent(request):
    """Google Cloud Function for AI agent"""
    
    request_json = request.get_json()
    topic = request_json.get('topic')
    
    async def run():
        researcher = Researcher()
        result = await researcher.run(topic)
        return result
    
    result = asyncio.run(run())
    
    return {'result': result}
```

### Deploy to Google Cloud

```bash
# Deploy function
gcloud functions deploy research-agent \
    --runtime python310 \
    --trigger-http \
    --allow-unauthenticated \
    --memory 4GB \
    --timeout 540s \
    --set-env-vars OPENAI_API_KEY=$OPENAI_API_KEY
```

### Trigger.dev Integration

```typescript
// trigger.config.ts
import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "ai-agent-system",
  runtime: "node",
  logLevel: "info",
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
    },
  },
});
```

```typescript
// jobs/research.ts
import { task } from "@trigger.dev/sdk/v3";

export const researchTask = task({
  id: "research-agent",
  run: async (payload: { topic: string }) => {
    // Call your AI agent
    const response = await fetch("YOUR_AGENT_API/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: payload.topic }),
    });
    
    const result = await response.json();
    return result;
  },
});
```

---

## Cloud Platforms

### Amazon EKS (Elastic Kubernetes Service)

```bash
# Install eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Create cluster
eksctl create cluster \
  --name ai-agent-cluster \
  --region us-east-1 \
  --nodegroup-name gpu-nodes \
  --node-type g4dn.xlarge \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 10 \
  --managed

# Configure kubectl
aws eks update-kubeconfig --region us-east-1 --name ai-agent-cluster

# Deploy your application
kubectl apply -f k8s/
```

### Google GKE (Google Kubernetes Engine)

```bash
# Create cluster with GPU support
gcloud container clusters create ai-agent-cluster \
  --machine-type n1-standard-4 \
  --num-nodes 3 \
  --zone us-central1-a \
  --accelerator type=nvidia-tesla-t4,count=1 \
  --enable-autoscaling \
  --min-nodes 1 \
  --max-nodes 10

# Get credentials
gcloud container clusters get-credentials ai-agent-cluster --zone us-central1-a

# Install NVIDIA drivers
kubectl apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/master/nvidia-driver-installer/cos/daemonset-preloaded.yaml

# Deploy your application
kubectl apply -f k8s/
```

### Azure AKS (Azure Kubernetes Service)

```bash
# Create resource group
az group create --name ai-agent-rg --location eastus

# Create AKS cluster
az aks create \
  --resource-group ai-agent-rg \
  --name ai-agent-cluster \
  --node-count 3 \
  --node-vm-size Standard_NC6 \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 10 \
  --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group ai-agent-rg --name ai-agent-cluster

# Deploy your application
kubectl apply -f k8s/
```

### Hugging Face Spaces

```python
# app.py for Gradio interface
import gradio as gr
import asyncio
from metagpt.roles import Researcher

async def research(topic):
    """Research a topic using MetaGPT"""
    researcher = Researcher()
    result = await researcher.run(topic)
    return result

def research_sync(topic):
    return asyncio.run(research(topic))

# Create Gradio interface
demo = gr.Interface(
    fn=research_sync,
    inputs=gr.Textbox(label="Research Topic", placeholder="Enter a topic to research..."),
    outputs=gr.Textbox(label="Research Results"),
    title="AI Research Agent",
    description="AI-powered research agent using MetaGPT"
)

if __name__ == "__main__":
    demo.launch()
```

### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Add environment variables
railway variables set OPENAI_API_KEY=your_key

# View logs
railway logs
```

---

## Production Best Practices

### 1. Security

```yaml
# Security best practices
- Use secrets management (Kubernetes Secrets, AWS Secrets Manager, etc.)
- Enable HTTPS/TLS for all endpoints
- Implement API authentication (JWT, API keys)
- Use network policies in Kubernetes
- Regular security scanning of containers
- Rotate credentials regularly
```

### 2. Monitoring and Observability

```python
# Comprehensive monitoring setup
from prometheus_client import Counter, Histogram, Gauge
import time

# Metrics
agent_requests = Counter('agent_requests_total', 'Total agent requests')
agent_duration = Histogram('agent_duration_seconds', 'Agent execution time')
active_agents = Gauge('active_agents', 'Number of active agents')

def monitor_agent(func):
    """Decorator for monitoring agent execution"""
    def wrapper(*args, **kwargs):
        agent_requests.inc()
        active_agents.inc()
        
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            return result
        finally:
            duration = time.time() - start_time
            agent_duration.observe(duration)
            active_agents.dec()
    
    return wrapper
```

### 3. Logging

```python
# Structured logging
import structlog
import json

logger = structlog.get_logger()

def log_agent_execution(agent_id, task, result, duration):
    """Log agent execution with structured data"""
    logger.info(
        "agent_execution",
        agent_id=agent_id,
        task=task,
        result_length=len(result),
        duration_seconds=duration,
        timestamp=time.time()
    )
```

### 4. Error Handling and Retries

```python
# Robust error handling
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=10)
)
async def run_agent_with_retry(agent, task):
    """Run agent with automatic retries"""
    try:
        result = await agent.run(task)
        return result
    except Exception as e:
        logger.error("agent_execution_failed", error=str(e))
        raise
```

### 5. Rate Limiting

```python
# API rate limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from fastapi import FastAPI, Request

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

@app.post("/research")
@limiter.limit("10/minute")
async def research_endpoint(request: Request, topic: str):
    """Rate-limited research endpoint"""
    # Process request
    pass
```

### 6. Load Balancing

```yaml
# Nginx load balancer configuration
upstream agent_backend {
    least_conn;
    server agent1:8000 weight=1;
    server agent2:8000 weight=1;
    server agent3:8000 weight=1;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://agent_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
    }
}
```

### 7. Health Checks

```python
# Health check endpoints
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
async def health_check():
    """Basic health check"""
    return {"status": "healthy"}

@app.get("/ready")
async def readiness_check():
    """Readiness check - verify dependencies"""
    checks = {
        "redis": check_redis_connection(),
        "postgres": check_postgres_connection(),
        "llm": check_llm_availability()
    }
    
    if all(checks.values()):
        return {"status": "ready", "checks": checks}
    else:
        return {"status": "not_ready", "checks": checks}, 503
```

### 8. Backup and Disaster Recovery

```bash
# Automated backup script
#!/bin/bash

# Backup PostgreSQL
pg_dump -h postgres -U agent agentdb | gzip > backup_$(date +%Y%m%d).sql.gz

# Upload to S3
aws s3 cp backup_$(date +%Y%m%d).sql.gz s3://my-backups/

# Backup Redis
redis-cli --rdb /backup/redis_$(date +%Y%m%d).rdb

# Rotate old backups (keep 30 days)
find /backup -name "*.sql.gz" -mtime +30 -delete
```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Secrets properly managed
- [ ] Health checks implemented
- [ ] Monitoring and logging set up
- [ ] Rate limiting configured
- [ ] Backup strategy in place
- [ ] Auto-scaling configured
- [ ] Load balancing set up
- [ ] SSL/TLS certificates configured
- [ ] CI/CD pipeline established
- [ ] Disaster recovery plan documented
- [ ] Security scanning enabled
- [ ] Performance testing completed
- [ ] Documentation updated

---

## Deployment Target

**Your deployment target**: Althowaikh.com/soldiom

For more information:
- Main Guide: [100X_AI_AGENT_GUIDE.md](./100X_AI_AGENT_GUIDE.md)
- Resources: [CURATED_RESOURCES.md](./CURATED_RESOURCES.md)
- Implementation: [IMPLEMENTATION_GUIDES.md](./IMPLEMENTATION_GUIDES.md)
