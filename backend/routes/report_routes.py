from flask import Blueprint, request, Response, jsonify
import markdown
from xhtml2pdf import pisa
from io import BytesIO
from datetime import datetime
import traceback

from services.agents.crew import run_report_generation
from services.agents.tools import set_metrics
from services.aggregator import run_aggregation

report_bp = Blueprint('report', __name__)

@report_bp.route('/generate-report', methods=['POST'])
def generate_report():
    try:
        body = request.get_json(silent=True) or {}
        user_prompt = body.get('prompt', 'Generate a business report.')
        report_type = body.get('report_type', 'full')

        # 1. Gather metrics
        data, _ = run_aggregation(force=False)
        set_metrics(data)

        # 2. Call crew flow
        md_content = run_report_generation(user_prompt, report_type)

        # 3. Convert to HTML
        body_html = markdown.markdown(md_content, extensions=['tables'])

        report_date = datetime.now().strftime("%B %d, %Y")
        full_html = f"""
        <html>
            <head>
                <style>
                    @page {{ size: a4 portrait; margin: 2cm; }}
                    body {{ font-family: Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; }}
                    h1 {{ color: #1e3a8a; font-size: 24pt; margin-bottom: 5px; }}
                    p.subtitle {{ color: #6b7280; font-size: 10pt; border-bottom: 1px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }}
                    h2 {{ color: #1f2937; margin-top: 20px; }}
                    table {{ width: 100%; border: 1px solid #e5e7eb; }}
                    th {{ background-color: #f3f4f6; text-align: left; padding: 8px; }}
                    td {{ padding: 8px; border-bottom: 1px solid #e5e7eb; }}
                </style>
            </head>
            <body>
                <h1>UMH Business Report</h1>
                <p class="subtitle">Generated on {report_date} • Type: {report_type.title()}</p>
                <div>
                    {body_html}
                </div>
            </body>
        </html>
        """

        # 4. Render PDF to BytesIO buffer
        pdf_io = BytesIO()
        pisa_status = pisa.CreatePDF(full_html, dest=pdf_io)

        if pisa_status.err:
            raise Exception("PDF generation failed")

        pdf_bytes = pdf_io.getvalue()
        pdf_io.close()

        # 5. Return Response
        return Response(
            pdf_bytes, 
            mimetype='application/pdf',
            headers={"Content-Disposition": "attachment; filename=report.pdf"}
        )

    except Exception as e:
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500