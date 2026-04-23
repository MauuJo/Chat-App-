from langgraph.graph import StateGraph, END
from app.agent.state import AgentState
from app.agent.nodes import router_node, summarize_node, draft_node, qna_node

# 1. Initialize the graph with our custom state
workflow = StateGraph(AgentState)

# 2. Add our Python functions as executable nodes in the graph
workflow.add_node("router", router_node)
workflow.add_node("summarize", summarize_node)
workflow.add_node("draft", draft_node)
workflow.add_node("qna", qna_node)

# 3. Define the conditional routing logic
def route_intent(state: AgentState):
    """Reads the intent from the state and returns the name of the next node."""
    return state.get("intent", "qna") # Default to qna if something goes wrong

# 4. Set the graph's entry point
workflow.set_entry_point("router")

# 5. Map the conditional edges from the router to the specialists
workflow.add_conditional_edges(
    "router",
    route_intent,
    {
        "summarize": "summarize",
        "draft": "draft",
        "qna": "qna",
    }
)

# 6. Ensure all specialist nodes gracefully terminate the workflow
workflow.add_edge("summarize", END)
workflow.add_edge("draft", END)
workflow.add_edge("qna", END)

# 7. Compile the workflow into a runnable application
app_graph = workflow.compile()