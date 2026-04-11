from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT

OUTPUT = "assets/NishantChaudhary_CoverLetter_v2.pdf"

BLACK     = colors.HexColor("#111111")
DARK_GREY = colors.HexColor("#333333")
MID_GREY  = colors.HexColor("#666666")
RULE_COL  = colors.HexColor("#DDDDDD")

name_style = ParagraphStyle(
    "name", fontSize=18, fontName="Helvetica-Bold",
    textColor=BLACK, leading=22, spaceAfter=2
)
meta_style = ParagraphStyle(
    "meta", fontSize=9, fontName="Helvetica",
    textColor=MID_GREY, leading=13, spaceAfter=0
)
body_style = ParagraphStyle(
    "body", fontSize=10, fontName="Helvetica",
    textColor=DARK_GREY, leading=16, spaceAfter=12, alignment=TA_LEFT
)
salute_style = ParagraphStyle(
    "salute", fontSize=10, fontName="Helvetica",
    textColor=DARK_GREY, leading=14, spaceAfter=12
)
sign_name_style = ParagraphStyle(
    "sign_name", fontSize=10, fontName="Helvetica-Bold",
    textColor=BLACK, leading=14
)
sign_title_style = ParagraphStyle(
    "sign_title", fontSize=9, fontName="Helvetica",
    textColor=MID_GREY, leading=13
)

def rule():
    return HRFlowable(width="100%", thickness=0.5, color=RULE_COL,
                      spaceBefore=6, spaceAfter=12)

story = []

# ── Header ────────────────────────────────────────────────────────────────────
story.append(Paragraph("Nishant Chaudhary", name_style))
story.append(Paragraph("Senior Frontend Engineer", meta_style))
story.append(Paragraph(
    "New Delhi, India  \u00b7  nishantchaudhary5338@gmail.com  \u00b7  +91 9560025338  \u00b7  "
    "github.com/nishantchaudhary5338  \u00b7  linkedin.com/in/nishantchaudhary5338",
    meta_style
))
story.append(rule())

story.append(Paragraph("April 2025", meta_style))
story.append(Spacer(1, 12))
story.append(Paragraph("Dear Hiring Manager,", salute_style))

# ── Para 1: Hook — built it, used it, taught it ───────────────────────────────
story.append(Paragraph(
    "At Samsung R&amp;D I spent the last year building systems other engineers use to build things. "
    "A headless dashboard library that takes a team from zero to a working, drag-and-drop, resizable "
    "dashboard in a day instead of a sprint. A Turborepo monorepo with custom MCP tools that automates "
    "60\u201370% of repetitive frontend work \u2014 scaffolding, refactoring, TypeScript enforcement "
    "\u2014 so engineers focus on the parts that actually need thinking. An AI-powered UI builder that "
    "turns a plain-English description into a rendered dashboard layout using a local Ollama model. "
    "And then, because building the tools wasn\u2019t enough, I run internal paired learning sessions "
    "at the Research Center teaching engineers how to actually get productivity out of agentic AI "
    "workflows \u2014 the practice, not the pitch. That loop \u2014 build, use, teach "
    "\u2014 is how I think about engineering work.",
    body_style
))

# ── Para 2: Range — not just Samsung ─────────────────────────────────────────
story.append(Paragraph(
    "Before Samsung I was at Safex Chemicals, a B2B platform with 15,000+ users, where I owned the "
    "frontend end-to-end: Azure AD SSO and Google OAuth flows, a SAP Cloud integration that killed a "
    "fully manual export process, and an LMS we shipped in about ten weeks from design handoff to "
    "production. Performance work cut load times by 40% without touching a line of backend code. "
    "Alongside that I maintain a personal monorepo with 14 apps, 8 shared packages, and 35+ CLI tools "
    "\u2014 partly because the architecture problems are interesting, partly because it\u2019s the "
    "fastest way to actually learn something.",
    body_style
))

# ── Para 3: [Company] placeholder ────────────────────────────────────────────
story.append(Paragraph(
    "I\u2019m looking for a senior or staff role where frontend architecture is treated as a "
    "first-class concern \u2014 where the right way to structure a shared library, design a component "
    "API, or set up a build pipeline is worth a real conversation. Not every team operates that way. "
    "The ones that do tend to build things that last, and those are the environments where I do "
    "my best work.",
    body_style
))

# ── Para 4: Close ─────────────────────────────────────────────────────────────
story.append(Paragraph(
    "Happy to walk through any of the systems I\u2019ve built \u2014 live demo or codebase walkthrough, "
    "whichever is more useful. Thanks for reading.",
    body_style
))

story.append(Spacer(1, 20))
story.append(Paragraph("Nishant Chaudhary", sign_name_style))
story.append(Paragraph("Senior Frontend Engineer", sign_title_style))

# ── Build ─────────────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    leftMargin=0.75 * inch,
    rightMargin=0.75 * inch,
    topMargin=0.65 * inch,
    bottomMargin=0.65 * inch,
)
doc.build(story)
print(f"Done \u2192 {OUTPUT}")
