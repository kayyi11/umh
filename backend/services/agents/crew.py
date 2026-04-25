import os
from crewai import Agent, Task, Crew, Process
from services.glm_service import get_glm_model
from services.agents.tools import get_business_metrics, inventory_monitor, supplier_contact_lookup

llm = get_glm_model()
VERBOSE = os.getenv("CREWAI_VERBOSE", "false") == "true"

# Kept for run_report_generation and run_draft_actions
risk_sentinel = Agent(
    role='Risk Sentinel',
    goal='Detect "red flags" like inventory shortages or high return rates',
    backstory='You monitor the Alert Feed (P1/P2). You focus on operational survival.',
    tools=[inventory_monitor],
    llm=llm,
    max_iter=3,
    max_execution_time=60,
    verbose=VERBOSE,
)

# Combined detect+think agent: has both tools so it can do risk detection AND
# strategic analysis in a single LLM chain, eliminating one sequential round-trip.
strategist = Agent(
    role='Business Strategist',
    goal='Detect inventory risks and analyze business metrics to form a strategic recommendation',
    backstory='You scan for P1/P2 inventory alerts and use business metrics to identify the root cause and best action. You always lead with Net Profit and speak in RM.',
    system_template="Always use RM (Ringgit Malaysia) for currency and focus on the Malaysian e-commerce context.",
    tools=[inventory_monitor, get_business_metrics],
    llm=llm,
    max_iter=3,
    max_execution_time=90,
    verbose=VERBOSE,
)

executor = Agent(
    role='Operations Executor',
    goal='Format strategic analysis into a clean, structured plain-text response',
    backstory='You take raw analysis and produce the final user-facing response with the correct structure and tone.',
    tools=[supplier_contact_lookup],
    llm=llm,
    max_iter=2,
    max_execution_time=60,
    verbose=VERBOSE,
)

def _build_metrics_context(metrics: dict) -> str:
    """Serialize pre-loaded metrics into a compact string for direct prompt injection,
    eliminating all tool-calling round-trips from run_di_analysis."""
    m = metrics
    wow = m.get('wow_revenue_change', 0) or 0
    lines = [
        "=== BUSINESS METRICS ===",
        f"Net Profit (WTD):    RM {m.get('net_profit', 0):.2f}",
        f"Net Margin:          {m.get('net_margin_percent', 0):.1f}%",
        f"This Week Revenue:   RM {m.get('this_week_revenue', 0):.2f}",
        f"WoW Revenue:         {wow:+.1f}%",
        f"Return Rate:         {m.get('return_rate_percent', 0):.1f}%",
        f"Voucher Impact:      RM {m.get('voucher_impact', 0):.2f}",
        f"New Customers:       {m.get('new_customers_this_week', 0)}",
        f"Inventory Days Left: {m.get('inventory_days_remaining')}",
        "",
        "=== INVENTORY ALERTS ===",
        f"P1 Critical: {m.get('p1_alerts', 0)}   P2 Warning: {m.get('p2_alerts', 0)}",
    ]
    flagged = [a for a in m.get('inventory_alerts', []) if a.get('alert') in ('P1', 'P2')]
    if flagged:
        for a in flagged:
            lines.append(
                f"  [{a['alert']}] {a['product_name']}: "
                f"{a.get('stock', '?')} units (threshold {a.get('threshold', '?')})"
            )
    else:
        lines.append("  All stock healthy — no breaches.")
    top3 = m.get('top_3_products_by_net_profit', [])
    if top3:
        lines += ["", "=== TOP 3 PRODUCTS BY NET PROFIT ==="] + [f"  {p}" for p in top3]
    return "\n".join(lines)


def run_di_analysis(user_query, metrics_data=None, event_queue=None):
    def emit(event_type, content):
        print(f"\n[AGENT:{event_type.upper()}] {content}")
        if event_queue is not None:
            try:
                event_queue.put_nowait({'type': event_type, 'content': content})
            except Exception:
                pass

    context = _build_metrics_context(metrics_data or {})

    emit('detect', 'Scanning inventory risks and business metrics...')
    emit('think', 'Analyzing data to form a strategic recommendation...')

    # Single tool-free agent: data pre-injected + format instructions in one prompt
    # = exactly 1 LLM call, which is the minimum possible.
    analyst = Agent(
        role='Business Analyst',
        goal='Answer business questions using pre-loaded metrics and return a formatted response',
        backstory=(
            'Expert in Malaysian e-commerce. You receive structured business data '
            'and produce a concise, formatted recommendation in one pass.'
        ),
        tools=[],
        llm=llm,
        max_iter=1,
        max_execution_time=60,
        verbose=True,
    )

    emit('act', 'Generating response...')

    task1 = Task(
        description=(
            f"Here is the current business data:\n\n{context}\n\n"
            f"Answer this question from the business owner: '{user_query}'\n\n"
            f"Respond in this EXACT format — no deviations:\n\n"
            f"[emoji] [one sentence summary of the key finding]\n\n"
            f"[emoji] What's happening:\n"
            f"• [specific data point or observation]\n"
            f"• [another data point if relevant]\n\n"
            f"[emoji] Recommended action:\n"
            f"• [one clear, actionable step]\n"
            f"• [second step if needed]\n\n"
            f"[emoji] [one sentence expected outcome]\n\n"
            f"Do you need further clarification?\n\n"
            f"Rules:\n"
            f"- Use RM for all currency. Malaysian e-commerce context.\n"
            f"- Use • (bullet) not * or -\n"
            f"- No **bold**, no #headers, no markdown\n"
            f"- Max 6 bullet points total\n"
            f"- End with exactly: \"Do you need further clarification?\""
        ),
        agent=analyst,
        expected_output=(
            "Structured plain-text with emojis and • bullets, "
            "ending with 'Do you need further clarification?'"
        ),
        max_execution_time=60,
    )

    crew = Crew(
        agents=[analyst],
        tasks=[task1],
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()

    output_text = result.raw if hasattr(result, 'raw') else str(result)
    thoughts_text = ""
    if hasattr(result, 'tasks_output') and hasattr(result.tasks_output, '__len__'):
        parts = []
        for i, t in enumerate(result.tasks_output[:-1]):
            parts.append(f"Agent Task {i+1} Output:\n{getattr(t, 'raw', str(t)).strip()}")
        thoughts_text = "\n\n".join(parts)

    emit('done_log', f"Analysis complete. Output: {len(output_text)} chars")
    if event_queue is not None:
        event_queue.put({'type': 'done', 'output': output_text, 'thoughts': thoughts_text})

    return result


def run_report_generation(user_prompt, report_type):
    data_gathering_task = Task(
        description=(
            f"Gather all relevant numerical data, metrics, and inventory statuses "
            f"required for a '{report_type}' report. Keep in mind the user's specific request: '{user_prompt}'."
        ),
        expected_output="A raw data summary containing all necessary metrics and inventory figures.",
        agent=risk_sentinel,
        tools=[get_business_metrics, inventory_monitor]
    )

    report_writing_task = Task(
        description=(
            f"Using the gathered data, write a structured and professional '{report_type}' report. "
            f"Address the user's specific prompt: '{user_prompt}'.\n"
            f"You MUST include the following sections:\n"
            f"- Executive Summary\n"
            f"- Key Metrics\n"
            f"- Analysis\n"
            f"- Recommendations\n\n"
            f"Format the final output strictly in clean Markdown."
        ),
        expected_output="A professional, strictly Markdown-formatted report with Executive Summary, Key Metrics, Analysis, and Recommendations.",
        agent=strategist
    )

    report_crew = Crew(
        agents=[risk_sentinel, strategist],
        tasks=[data_gathering_task, report_writing_task],
        verbose=VERBOSE,
    )

    result = report_crew.kickoff()

    if hasattr(result, 'raw'):
        return result.raw
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