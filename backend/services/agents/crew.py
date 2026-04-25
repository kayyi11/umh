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
    
    # Task 3: Structured, readable reply with emojis and bullet points
    task3 = Task(
        description="""
            Write a concise, well-structured response using ONLY this exact format — no deviations:

            [One emoji] [One sentence summary of the key finding]

            [Section emoji] What's happening:
            • [Specific data point or observation]
            • [Another data point if relevant]

            [Section emoji] Recommended action:
            • [One clear, actionable step]
            • [Second step if needed]

            [Closing emoji] [One sentence on expected outcome]

            Do you need further clarification?

            Rules:
            - Use relevant emojis (e.g. 📉 for decline, 📦 for inventory, 💰 for revenue, ⚠️ for risk, ✅ for positive).
            - Use • (bullet character) for all list items. Do NOT use *, -, or markdown.
            - Do NOT use ** bold **, # headers, or any other markdown syntax.
            - Keep every bullet point to one sentence. Maximum 6 bullet points total.
            - Always end with exactly: "Do you need further clarification?"
        """,
        agent=executor,
        context=[task2],
        expected_output="A structured plain-text response with emojis, • bullet points, and no markdown, ending with 'Do you need further clarification?'"
    )

    crew = Crew(
        agents=[risk_sentinel, strategist, executor],
        tasks=[task1, task2, task3],
        process=Process.sequential
    )

    result = crew.kickoff()
    return str(result)


def run_draft_actions():
    """3-agent pipeline (Risk Sentinel → Strategist → Executor) that produces
    drafted messages for the Quick Actions page."""

    task1 = Task(
        description=(
            "Use the inventory_monitor tool to identify all P1 and P2 stock alerts. "
            "Report each flagged product with its product name, stock_on_hand, "
            "reorder_point, and alert level."
        ),
        agent=risk_sentinel,
        expected_output=(
            "A list of flagged inventory items with product name, stock on hand, "
            "threshold, and alert severity (P1 or P2)."
        )
    )

    task2 = Task(
        description="""
Use the get_business_metrics tool to retrieve current metrics. Then, based on the
inventory risk flags and those metrics, output ONLY a valid JSON object in this
exact structure — no markdown, no code fences, no extra text:

{
  "narrative": "<one sentence: the single most urgent business issue today>",
  "recommended_actions": [
    {
      "action_id": "supplier",
      "priority": "<P1 or P2>",
      "intent": "<what this supplier email should achieve>",
      "metric_context": {
        "product_name": "<most at-risk product>",
        "stock_on_hand": <integer>,
        "reorder_point": <integer>,
        "days_remaining": <integer or null>
      }
    },
    {
      "action_id": "whatsapp",
      "priority": "<P1 or P2>",
      "intent": "<what the team needs to know or act on>",
      "metric_context": {
        "trigger": "<e.g. price adjustment, stockout alert, return spike>",
        "detail": "<specific observation>",
        "amount": "<RM value or percentage if applicable, else null>"
      }
    },
    {
      "action_id": "pricelist",
      "priority": "P2",
      "intent": "<what price update or export to prepare>",
      "metric_context": {
        "category": "<affected product category>",
        "adjustment": "<e.g. +RM0.50 or -5%>",
        "reason": "<one-sentence business reason>"
      }
    }
  ]
}

Rules:
- Always include all three action_id values: supplier, whatsapp, pricelist.
- Use real metric values from the tools — do not invent numbers.
- Use RM for all currency values.
- If an action has weak data support, set its priority to P2 and state that in intent.
""",
        agent=strategist,
        context=[task1],
        expected_output=(
            'A valid JSON object with "narrative" (string) and "recommended_actions" '
            "(array of exactly 3 objects, each with action_id, priority, intent, "
            "metric_context). No markdown. No code fences. No extra text."
        )
    )

    task3 = Task(
        description="""
The previous task produced a JSON object with "narrative" and "recommended_actions".
For each action in recommended_actions, draft a complete, ready-to-send message.

Use the supplier_contact_lookup tool with the product_name from the "supplier" action's
metric_context to get the supplier's real contact details. Use those details in the email draft.

Output ONLY a valid JSON array in this exact structure — no markdown, no code fences, no extra text:

[
  {
    "action_id": "supplier",
    "action_type": "email",
    "recipient": "<Supplier name and contact person from lookup>",
    "subject": "<concise email subject line>",
    "body": "<full email body, professional tone, signed off as Management>",
    "priority": "<P1 or P2 from recommended_actions>"
  },
  {
    "action_id": "whatsapp",
    "action_type": "whatsapp",
    "recipient": "Internal Team",
    "subject": null,
    "body": "<WhatsApp message, casual but professional, 1-2 emojis allowed>",
    "priority": "<P1 or P2 from recommended_actions>"
  },
  {
    "action_id": "pricelist",
    "action_type": "system",
    "recipient": "System",
    "subject": null,
    "body": "<system log preview describing what the price list export will do>",
    "priority": "<P1 or P2 from recommended_actions>"
  }
]

Rules:
- Draft all three messages. Do not skip any action_id.
- Use RM for all currency values.
- Keep bodies concise: supplier email max 150 words, WhatsApp max 60 words, pricelist max 50 words.
- Supplier email must include: greeting with contact person name, the specific product and stock issue, a clear request, and a sign-off.
- Base all content strictly on metric_context values from recommended_actions — do not invent numbers.
""",
        agent=executor,
        context=[task2],
        expected_output=(
            "A valid JSON array of exactly 3 objects, each with action_id, action_type, "
            "recipient, subject, body, and priority. No markdown. No code fences. No extra text."
        )
    )

    crew = Crew(
        agents=[risk_sentinel, strategist, executor],
        tasks=[task1, task2, task3],
        process=Process.sequential
    )

    result = crew.kickoff()
    return str(result)