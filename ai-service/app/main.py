from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
import os

# 1. LOAD THE ENVIRONMENT VARIABLES FIRST
load_dotenv()

# 2. THEN IMPORT THE GRAPH (so it can use the loaded variables)
from app.agent.graph import app_graph 

app = FastAPI(title="AI Chat Microservice")
# ... (rest of your code stays exactly the same)

class ChatCommand(BaseModel):
    message: str
    chat_id: str
    user_id: str
    chat_context: str = "" # Added to accept historical chat logs from Node.js

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "fastapi-ai-service"}

@app.post("/api/ai-command")
async def process_ai_command(command: ChatCommand):
    try:
        # Prepare the initial state for LangGraph
        initial_state = {
            "messages": [HumanMessage(content=command.message)],
            "chat_context": command.chat_context
        }
        
        # Execute the graph
        result = app_graph.invoke(initial_state)
        
        # Extract the final results from the graph's state
        return {
            "status": "success",
            "intent": result.get("intent"),
            "reply": result.get("final_response")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/")
def read_root():
    return {"message": "AI Microservice is running!"}