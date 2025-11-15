# Implementation Guides for 100X AI Agent System

## Table of Contents

1. [MetaGPT Implementation](#metagpt-implementation)
2. [CrewAI Implementation](#crewai-implementation)
3. [LangGraph Implementation](#langgraph-implementation)
4. [Ray for Distributed Computing](#ray-for-distributed-computing)
5. [vLLM for LLM Serving](#vllm-for-llm-serving)
6. [n8n Integration Platform](#n8n-integration-platform)
7. [Browser Automation with Playwright](#browser-automation-with-playwright)
8. [Observability with Langfuse](#observability-with-langfuse)

---

## MetaGPT Implementation

### Overview
MetaGPT is a multi-agent framework that simulates a software company with different roles working together.

### Installation

```bash
# Clone the repository
git clone https://github.com/geekan/MetaGPT.git
cd MetaGPT

# Install dependencies
pip install -e .
```

### Configuration

Create a `config2.yaml` file:

```yaml
llm:
  api_type: "openai"  # or "huggingface", "anthropic", etc.
  model: "gpt-4"
  api_key: "YOUR_API_KEY"
  base_url: "https://api.openai.com/v1"

# For Hugging Face
# llm:
#   api_type: "huggingface"
#   model: "Qwen/Qwen2.5-72B-Instruct"
#   api_key: "YOUR_HF_TOKEN"
#   base_url: "https://api-inference.huggingface.co/models/"
```

### Basic Usage

```python
import asyncio
from metagpt.roles import ProductManager, Architect, Engineer
from metagpt.team import Team

async def main():
    # Create a software development team
    team = Team()
    team.hire([
        ProductManager(),
        Architect(),
        Engineer(),
    ])
    
    # Give the team a project
    team.invest(investment=10.0)
    team.run_project("Build a REST API for a todo application")
    
    await team.run()

if __name__ == "__main__":
    asyncio.run(main())
```

### Advanced Example: Multi-Agent Collaboration

```python
import asyncio
from metagpt.roles.researcher import Researcher
from metagpt.roles.writer import Writer
from metagpt.team import Team

async def research_and_write():
    """Research a topic and write a comprehensive article"""
    
    # Create specialized team
    team = Team()
    team.hire([
        Researcher(),
        Writer()
    ])
    
    # Define the task
    task = """
    Research the latest trends in AI agents and write a 
    comprehensive blog post about the top 5 frameworks
    """
    
    team.invest(investment=5.0)
    result = await team.run(task)
    
    return result

if __name__ == "__main__":
    asyncio.run(research_and_write())
```

---

## CrewAI Implementation

### Overview
CrewAI enables creating role-playing autonomous AI agents that work together.

### Installation

```bash
pip install crewai crewai-tools
```

### Basic Usage

```python
from crewai import Agent, Task, Crew, Process

# Define agents
researcher = Agent(
    role='Senior Researcher',
    goal='Discover groundbreaking technologies',
    backstory='A curious mind passionate about cutting-edge tech',
    verbose=True
)

writer = Agent(
    role='Tech Writer',
    goal='Write engaging tech articles',
    backstory='An experienced tech journalist',
    verbose=True
)

# Define tasks
research_task = Task(
    description='Research the latest AI agent frameworks',
    agent=researcher,
    expected_output='A comprehensive report on AI frameworks'
)

write_task = Task(
    description='Write an article based on the research',
    agent=writer,
    expected_output='A well-written article'
)

# Create crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential
)

# Execute
result = crew.kickoff()
print(result)
```

### Advanced Example: Customer Support System

```python
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool, WebsiteSearchTool

# Initialize tools
search_tool = SerperDevTool()
web_tool = WebsiteSearchTool()

# Create specialized agents
support_agent = Agent(
    role='Customer Support Specialist',
    goal='Provide excellent customer support',
    backstory='Expert in handling customer queries with empathy',
    tools=[search_tool, web_tool],
    verbose=True
)

technical_agent = Agent(
    role='Technical Expert',
    goal='Solve technical problems',
    backstory='Deep technical knowledge of our products',
    tools=[web_tool],
    verbose=True
)

# Define workflow
inquiry_task = Task(
    description='Analyze customer inquiry: {customer_message}',
    agent=support_agent
)

solution_task = Task(
    description='Provide technical solution based on analysis',
    agent=technical_agent
)

# Create and run crew
support_crew = Crew(
    agents=[support_agent, technical_agent],
    tasks=[inquiry_task, solution_task],
    process=Process.sequential
)

result = support_crew.kickoff(inputs={
    'customer_message': 'My API integration is failing'
})
```

---

## LangGraph Implementation

### Overview
LangGraph helps build stateful, multi-actor applications with LLMs.

### Installation

```bash
pip install langgraph langchain langchain-openai
```

### Basic Usage

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

# Define state
class AgentState(TypedDict):
    messages: Annotated[list, "The messages in the conversation"]
    next: str

# Define nodes
def research_node(state: AgentState):
    # Research logic
    messages = state["messages"]
    # Add research results
    return {"messages": messages + ["Research complete"], "next": "writer"}

def writer_node(state: AgentState):
    # Writing logic
    messages = state["messages"]
    # Add written content
    return {"messages": messages + ["Article written"], "next": END}

# Build graph
workflow = StateGraph(AgentState)
workflow.add_node("researcher", research_node)
workflow.add_node("writer", writer_node)

workflow.set_entry_point("researcher")
workflow.add_edge("researcher", "writer")
workflow.add_edge("writer", END)

# Compile and run
app = workflow.compile()
result = app.invoke({"messages": ["Start research on AI agents"], "next": ""})
```

### Advanced Example: Customer Service Flow

```python
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from typing import TypedDict, Literal

class CustomerServiceState(TypedDict):
    customer_query: str
    category: str
    solution: str
    satisfaction: str

# Initialize LLM
llm = ChatOpenAI(model="gpt-4")

def categorize_query(state: CustomerServiceState):
    """Categorize the customer query"""
    query = state["customer_query"]
    # Use LLM to categorize
    prompt = f"Categorize this query: {query}\nCategories: technical, billing, general"
    category = llm.predict(prompt)
    return {"category": category.strip().lower()}

def route_query(state: CustomerServiceState) -> Literal["technical", "billing", "general"]:
    """Route based on category"""
    return state["category"]

def handle_technical(state: CustomerServiceState):
    """Handle technical queries"""
    query = state["customer_query"]
    solution = llm.predict(f"Provide technical solution for: {query}")
    return {"solution": solution}

def handle_billing(state: CustomerServiceState):
    """Handle billing queries"""
    query = state["customer_query"]
    solution = llm.predict(f"Provide billing assistance for: {query}")
    return {"solution": solution}

def handle_general(state: CustomerServiceState):
    """Handle general queries"""
    query = state["customer_query"]
    solution = llm.predict(f"Provide general assistance for: {query}")
    return {"solution": solution}

# Build the graph
workflow = StateGraph(CustomerServiceState)

workflow.add_node("categorize", categorize_query)
workflow.add_node("technical", handle_technical)
workflow.add_node("billing", handle_billing)
workflow.add_node("general", handle_general)

workflow.set_entry_point("categorize")
workflow.add_conditional_edges(
    "categorize",
    route_query,
    {
        "technical": "technical",
        "billing": "billing",
        "general": "general"
    }
)

workflow.add_edge("technical", END)
workflow.add_edge("billing", END)
workflow.add_edge("general", END)

# Compile and use
app = workflow.compile()
result = app.invoke({
    "customer_query": "My API integration is not working",
    "category": "",
    "solution": "",
    "satisfaction": ""
})
```

---

## Ray for Distributed Computing

### Overview
Ray enables distributed computing for massive scalability.

### Installation

```bash
pip install ray
```

### Basic Usage

```python
import ray

# Initialize Ray
ray.init()

@ray.remote
def process_task(task_id):
    """Process a single task"""
    import time
    time.sleep(1)  # Simulate work
    return f"Task {task_id} completed"

# Run 1000 tasks in parallel
tasks = [process_task.remote(i) for i in range(1000)]
results = ray.get(tasks)
print(f"Completed {len(results)} tasks")
```

### Advanced Example: Distributed Agent System

```python
import ray
from typing import List

ray.init()

@ray.remote
class Agent:
    def __init__(self, agent_id: int):
        self.agent_id = agent_id
        self.tasks_completed = 0
    
    def process_task(self, task):
        """Process a task"""
        # Simulate task processing
        result = f"Agent {self.agent_id} processed: {task}"
        self.tasks_completed += 1
        return result
    
    def get_stats(self):
        return {
            'agent_id': self.agent_id,
            'tasks_completed': self.tasks_completed
        }

@ray.remote
def coordinator(num_agents: int, tasks: List[str]):
    """Coordinate multiple agents"""
    # Create agents
    agents = [Agent.remote(i) for i in range(num_agents)]
    
    # Distribute tasks
    futures = []
    for i, task in enumerate(tasks):
        agent = agents[i % num_agents]
        futures.append(agent.process_task.remote(task))
    
    # Wait for all tasks
    results = ray.get(futures)
    
    # Get statistics
    stats = ray.get([agent.get_stats.remote() for agent in agents])
    
    return results, stats

# Run distributed system
num_agents = 10
tasks = [f"Task_{i}" for i in range(100)]

results, stats = ray.get(coordinator.remote(num_agents, tasks))
print(f"Processed {len(results)} tasks with {num_agents} agents")
for stat in stats:
    print(f"Agent {stat['agent_id']}: {stat['tasks_completed']} tasks")
```

---

## vLLM for LLM Serving

### Overview
vLLM provides high-throughput LLM serving.

### Installation

```bash
pip install vllm
```

### Basic Usage

```python
from vllm import LLM, SamplingParams

# Initialize model
llm = LLM(model="Qwen/Qwen2.5-7B-Instruct")

# Set sampling parameters
sampling_params = SamplingParams(
    temperature=0.7,
    top_p=0.95,
    max_tokens=512
)

# Generate
prompts = [
    "What is the future of AI agents?",
    "Explain quantum computing in simple terms."
]

outputs = llm.generate(prompts, sampling_params)

for output in outputs:
    print(f"Prompt: {output.prompt}")
    print(f"Generated: {output.outputs[0].text}")
    print("-" * 50)
```

### Server Mode

```bash
# Start vLLM server
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen2.5-32B-Instruct \
    --host 0.0.0.0 \
    --port 8000
```

### Client Usage

```python
from openai import OpenAI

# Point to vLLM server
client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="dummy"  # vLLM doesn't require API key
)

response = client.chat.completions.create(
    model="Qwen/Qwen2.5-32B-Instruct",
    messages=[
        {"role": "user", "content": "What is the future of AI?"}
    ]
)

print(response.choices[0].message.content)
```

---

## n8n Integration Platform

### Overview
n8n enables workflow automation with 1000+ integrations.

### Installation

```bash
# Using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Basic Workflow Example

1. **Create a Webhook Trigger**
   - Add "Webhook" node
   - Configure: Method = POST
   - Copy the webhook URL

2. **Add AI Agent Processing**
   - Add "HTTP Request" node
   - Configure to call your AI agent API

3. **Add Response Actions**
   - Add "Send Email" node (Gmail, Outlook, etc.)
   - Add "Create Notion Page" node
   - Add "Update Salesforce" node

### Integration with MetaGPT

```python
# Flask API for n8n to call
from flask import Flask, request, jsonify
import asyncio
from metagpt.roles import Researcher

app = Flask(__name__)

@app.route('/research', methods=['POST'])
def research():
    data = request.json
    topic = data.get('topic')
    
    async def run_research():
        researcher = Researcher()
        result = await researcher.run(topic)
        return result
    
    result = asyncio.run(run_research())
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(port=8080)
```

---

## Browser Automation with Playwright

### Overview
Playwright enables reliable browser automation.

### Installation

```bash
pip install playwright
playwright install
```

### Basic Usage

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    
    # Navigate
    page.goto("https://example.com")
    
    # Interact
    page.fill("#search", "AI agents")
    page.click("#submit")
    
    # Extract data
    results = page.query_selector_all(".result")
    for result in results:
        print(result.text_content())
    
    browser.close()
```

### AI-Powered Browser Agent

```python
from playwright.sync_api import sync_playwright
from langchain_openai import ChatOpenAI

class BrowserAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4")
        self.playwright = None
        self.browser = None
        self.page = None
    
    def start(self):
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(headless=False)
        self.page = self.browser.new_page()
    
    def navigate(self, url: str):
        self.page.goto(url)
    
    def extract_with_ai(self, instruction: str):
        """Use AI to extract information from the page"""
        page_content = self.page.content()
        prompt = f"""
        Page content: {page_content[:5000]}
        
        Task: {instruction}
        """
        result = self.llm.predict(prompt)
        return result
    
    def close(self):
        if self.browser:
            self.browser.close()
        if self.playwright:
            self.playwright.stop()

# Usage
agent = BrowserAgent()
agent.start()
agent.navigate("https://example.com")
info = agent.extract_with_ai("Extract all product names and prices")
print(info)
agent.close()
```

---

## Observability with Langfuse

### Overview
Langfuse provides observability for LLM applications.

### Installation

```bash
pip install langfuse
```

### Basic Usage

```python
from langfuse import Langfuse

# Initialize
langfuse = Langfuse(
    public_key="YOUR_PUBLIC_KEY",
    secret_key="YOUR_SECRET_KEY",
    host="https://cloud.langfuse.com"  # or self-hosted
)

# Trace an LLM call
trace = langfuse.trace(name="agent-execution")

generation = trace.generation(
    name="llm-call",
    model="gpt-4",
    input=[{"role": "user", "content": "Hello"}],
    output="Hi there!"
)

# Add metadata
generation.update(
    usage={"prompt_tokens": 10, "completion_tokens": 5},
    metadata={"agent_type": "research"}
)
```

### Integration with LangChain

```python
from langchain_openai import ChatOpenAI
from langfuse.callback import CallbackHandler

# Initialize callback
langfuse_handler = CallbackHandler(
    public_key="YOUR_PUBLIC_KEY",
    secret_key="YOUR_SECRET_KEY"
)

# Use with LangChain
llm = ChatOpenAI(
    model="gpt-4",
    callbacks=[langfuse_handler]
)

response = llm.predict("What is AI?")
# Automatically traced in Langfuse
```

---

## Best Practices

1. **Start Small**: Begin with a single agent framework
2. **Monitor Everything**: Use Langfuse from day one
3. **Scale Gradually**: Add Ray when you need parallelism
4. **Integrate Early**: Set up n8n for automation
5. **Test Thoroughly**: Browser automation requires careful testing
6. **Version Control**: Keep your agent configurations in Git
7. **Security First**: Never commit API keys or tokens

---

## Next Steps

- Explore [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production deployment
- Check [CURATED_RESOURCES.md](./CURATED_RESOURCES.md) for more tools
- Review [100X_AI_AGENT_GUIDE.md](./100X_AI_AGENT_GUIDE.md) for the complete vision
