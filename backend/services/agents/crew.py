from crewai import Agent, Task, Crew, Process
from services.glm_service import get_glm_model
from services.agents.tools import get_business_metrics, inventory_monitor, supplier_contact_lookup

llm = get_glm_model()

# 1. Risk Sentinel: The Monitor (Architecture PDF Item 2.2)
risk_sentinel = Agent(
    role='Risk Sentinel',
    goal='Detect "red flags" like inventory shortages or high return rates',
    backstory='You monitor the Alert Feed (P1/P2). You focus on operational survival.',
    tools=[inventory_monitor],
    llm=llm,
    verbose=True # This lets you see the agent thinking in the terminal
)

# 2. Strategist: The Brain (Architecture PDF Item 2.1)
strategist = Agent(
    role='Business Strategist',
    goal='Analyze trends and prepare the "Decision of the Day"',
    backstory='You prioritize insights by business impact. You always look at Net Profit first.',
    system_template="Always use RM (Ringgit Malaysia) for currency and focus on the Malaysian e-commerce context.",
    tools=[get_business_metrics],
    llm=llm,
    verbose=True
)

# 3. Executor: The Doer (Architecture PDF Item 2.3)
executor = Agent(
    role='Operations Executor',
    goal='Draft messages for suppliers or price update notifications',
    backstory='You handle the "Doing". You prepare drafts for the Quick Actions page.',
    tools=[supplier_contact_lookup],
    llm=llm,
    verbose=True
)

def run_di_analysis(user_query):
    # Task 1: Identify Risks (The "What is happening")
    task1 = Task(
        description=f"Analyze inventory and margins for: {user_query}. Use tools to find P1/P2 breaches.",
        agent=risk_sentinel,
        expected_output="A list of specific data red flags (e.g., low stock, high returns)."
    )
    
    # Task 2: Strategic Recommendation (The "Why is it happening")
    task2 = Task(
        description=f"Directly answer the user's question: '{user_query}'. Explain the 'Why' using business metrics (Net Profit, Return Rate). Then suggest a 'Decision of the Day'.",
        agent=strategist,
        context=[task1],
        expected_output="A deep-dive explanation of the cause of the issue and a strategic recommendation."
    )
    
    # Task 3: Execution Draft (The "Consolidated Report")
    task3 = Task(
        description="""
            1. Summarize the Strategist's explanation of 'Why' the issue occurred.
            2. State the 'Decision of the Day'.
            3. Provide the professional communication drafts (WhatsApp/Email).
            Combine all these into a single, beautiful report for the business owner.
        """,
        agent=executor,
        context=[task2],
        expected_output="A complete Strategic Insight Report that starts with an explanation of the problem, followed by the action plan and message drafts."
    )

    crew = Crew(
        agents=[risk_sentinel, strategist, executor],
        tasks=[task1, task2, task3],
        process=Process.sequential 
    )
    
    result = crew.kickoff()
    return str(result)