import os
from dotenv import load_dotenv
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from app.agent.state import AgentState

load_dotenv()
# Initialize the Gemini model

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", # Or gemini-2.5-flash if you kept that!
    google_api_key=os.getenv("GEMINI_API_KEY"),
    convert_system_message_to_human=True
)

def router_node(state: AgentState):
    """
    Analyzes the user's @ai command and classifies the intent.
    This acts as the brain of our routing mechanism.
    """
    messages = state.get("messages", [])
    last_user_message = messages[-1].content if messages else ""
    
    system_prompt = (
        "You are an intent classifier for a chat application. "
        "Analyze the user's command and categorize it into EXACTLY ONE of these categories: "
        "'summarize', 'draft', or 'qna'. "
        "Return ONLY the category name in lowercase, with no punctuation or extra text."
    )
    
    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=last_user_message)
    ])
    
    # Clean the response to ensure it strictly matches our graph's conditional edges
    intent = response.content.strip().lower()
    
    # Safety fallback in case the LLM hallucinates a weird category
    if intent not in ['summarize', 'draft', 'qna']:
        intent = 'qna'
        
    return {"intent": intent}

def summarize_node(state: AgentState):
    """Specialist agent that summarizes the ongoing chat context."""
    chat_context = state.get("chat_context", "No chat context provided.")
    
    # Aggressively constrain the length
    prompt = (
        f"Provide an extremely short, high-level summary of this chat history. "
        f"Use a maximum of 2 bullet points. Keep it brief and conversational!\n\n{chat_context}"
    )
    response = llm.invoke([HumanMessage(content=prompt)])
    
    return {"final_response": response.content}

def draft_node(state: AgentState):
    """Specialist agent that drafts a reply based on the chat context."""
    chat_context = state.get("chat_context", "No chat context provided.")
    messages = state.get("messages", [])
    last_user_message = messages[-1].content if messages else ""
    
    # Force a 1-sentence WhatsApp style reply
    prompt = (
        f"Based on this chat history:\n{chat_context}\n\n"
        f"Draft an extremely concise, conversational reply for the user asking: {last_user_message}. "
        f"Maximum 1 sentence. Do not be overly formal. Speak like you are texting a friend."
    )
    response = llm.invoke([HumanMessage(content=prompt)])
    
    return {"final_response": response.content}

def qna_node(state: AgentState):
    """Specialist agent that answers general questions concisely."""
    messages = state.get("messages", [])
    last_user_message = messages[-1].content if messages else ""
    
    # Force the LLM to behave like a mobile chat bot
    system_prompt = (
        "You are a helpful AI assistant integrated directly into a fast-paced messaging app. "
        "Your responses MUST be extremely concise, conversational, and direct. "
        "Keep your answer to a maximum of 1 to 2 short sentences. "
        "Do not use markdown headers, long lists, or deep explanations. Be brief!"
    )
    
    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=last_user_message)
    ])
    
    return {"final_response": response.content}