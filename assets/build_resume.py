from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, ListFlowable, ListItem
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import Table, TableStyle

OUTPUT = "assets/NishantChaudhary_v2.pdf"

# ── Colours ──────────────────────────────────────────────────────────────────
BLACK      = colors.HexColor("#111111")
DARK_GREY  = colors.HexColor("#333333")
MID_GREY   = colors.HexColor("#555555")
LIGHT_GREY = colors.HexColor("#888888")
RULE_COLOR = colors.HexColor("#CCCCCC")

# ── Styles ────────────────────────────────────────────────────────────────────
def styles():
    base = dict(fontName="Helvetica", textColor=BLACK, leading=14)

    name = ParagraphStyle("name", fontSize=20, fontName="Helvetica-Bold",
                           textColor=BLACK, leading=24, spaceAfter=2)

    title_s = ParagraphStyle("title_s", fontSize=11, fontName="Helvetica",
                              textColor=MID_GREY, leading=14, spaceAfter=4)

    contact = ParagraphStyle("contact", fontSize=9, fontName="Helvetica",
                              textColor=DARK_GREY, leading=12, spaceAfter=0)

    section = ParagraphStyle("section", fontSize=10.5, fontName="Helvetica-Bold",
                              textColor=BLACK, leading=13, spaceBefore=10, spaceAfter=2)

    job_co = ParagraphStyle("job_co", fontSize=10, fontName="Helvetica-Bold",
                            textColor=BLACK, leading=13, spaceBefore=7, spaceAfter=0)

    job_meta = ParagraphStyle("job_meta", fontSize=9, fontName="Helvetica-Oblique",
                              textColor=MID_GREY, leading=12, spaceAfter=3)

    bullet = ParagraphStyle("bullet", fontSize=9, fontName="Helvetica",
                            textColor=DARK_GREY, leading=13, leftIndent=10,
                            firstLineIndent=0, spaceAfter=2)

    proj_name = ParagraphStyle("proj_name", fontSize=9.5, fontName="Helvetica-Bold",
                               textColor=BLACK, leading=12, spaceBefore=5, spaceAfter=1)

    proj_body = ParagraphStyle("proj_body", fontSize=9, fontName="Helvetica",
                               textColor=DARK_GREY, leading=12.5, spaceAfter=1)

    tech_label = ParagraphStyle("tech_label", fontSize=8.5, fontName="Helvetica-Bold",
                                textColor=MID_GREY, leading=12)

    tech_val = ParagraphStyle("tech_val", fontSize=8.5, fontName="Helvetica",
                              textColor=DARK_GREY, leading=12)

    skill_cat = ParagraphStyle("skill_cat", fontSize=9, fontName="Helvetica-Bold",
                               textColor=DARK_GREY, leading=13)

    skill_val = ParagraphStyle("skill_val", fontSize=9, fontName="Helvetica",
                               textColor=DARK_GREY, leading=13)

    edu_inst = ParagraphStyle("edu_inst", fontSize=9.5, fontName="Helvetica-Bold",
                              textColor=BLACK, leading=13, spaceBefore=4)

    edu_detail = ParagraphStyle("edu_detail", fontSize=9, fontName="Helvetica",
                                textColor=MID_GREY, leading=12)

    return dict(name=name, title_s=title_s, contact=contact, section=section,
                job_co=job_co, job_meta=job_meta, bullet=bullet,
                proj_name=proj_name, proj_body=proj_body,
                tech_label=tech_label, tech_val=tech_val,
                skill_cat=skill_cat, skill_val=skill_val,
                edu_inst=edu_inst, edu_detail=edu_detail)

S = styles()

def rule():
    return HRFlowable(width="100%", thickness=0.5, color=RULE_COLOR, spaceAfter=4)

def section_header(text):
    return [Paragraph(text.upper(), S["section"]), rule()]

def bullet_item(text):
    return Paragraph(f"\u2022\u2002{text}", S["bullet"])

def job_header(company, role, dates):
    return [
        Paragraph(company, S["job_co"]),
        Paragraph(f"{role}  \u2013  {dates}", S["job_meta"]),
    ]

# ── Content ───────────────────────────────────────────────────────────────────
def build_story():
    story = []

    # ── HEADER ────────────────────────────────────────────────────────────────
    story.append(Paragraph("Nishant Chaudhary", S["name"]))
    story.append(Paragraph("Senior Frontend Engineer", S["title_s"]))
    story.append(Paragraph(
        "New Delhi, India  \u00b7  nishantchaudhary5338@gmail.com  \u00b7  +91 9560025338  \u00b7  "
        "github.com/nishantchaudhary5338  \u00b7  linkedin.com/in/nishantchaudhary5338",
        S["contact"]
    ))
    story.append(Spacer(1, 6))
    story.append(rule())

    # ── SUMMARY ───────────────────────────────────────────────────────────────
    story += section_header("Summary")
    story.append(Paragraph(
        "Frontend engineer with 4+ years shipping production applications at enterprise scale. "
        "I care about the full picture — from component API design to build pipeline to how a "
        "new developer onboards to the codebase. At Samsung I built a shared dashboard library "
        "adopted across teams and an AI-augmented tooling system that cut repetitive work by "
        "60–70%. Before that, I led frontend delivery at a B2B SaaS platform serving 15,000+ users. "
        "Strong in React, TypeScript, and modern build infrastructure. Looking for a senior or staff "
        "role where there\u2019s real architecture to own.",
        S["bullet"]
    ))
    story.append(Spacer(1, 4))

    # ── SKILLS ────────────────────────────────────────────────────────────────
    story += section_header("Technical Skills")

    skill_rows = [
        ("Core",         "JavaScript (ES6+), TypeScript, HTML5, CSS3"),
        ("Frameworks",   "React.js, Next.js, Tailwind CSS, Radix UI, Framer Motion, GSAP, Three.js"),
        ("State & Data", "Redux Toolkit, Zustand, React Query, REST APIs, GraphQL"),
        ("Build & Infra","Vite, Turborepo, Webpack, Rollup, pnpm workspaces, CI/CD"),
        ("Testing",      "Vitest, Jest, React Testing Library, Storybook, ESLint, Prettier"),
        ("Cloud & Auth", "AWS, Azure AD (MSAL), Google OAuth 2.0, Firebase"),
    ]

    for cat, vals in skill_rows:
        row = Table(
            [[Paragraph(cat + ":", S["skill_cat"]),
              Paragraph(vals, S["skill_val"])]],
            colWidths=[1.1 * inch, None],
            hAlign="LEFT",
        )
        row.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 1),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
        ]))
        story.append(row)

    story.append(Spacer(1, 4))

    # ── EXPERIENCE ────────────────────────────────────────────────────────────
    story += section_header("Work Experience")

    # Samsung
    story += job_header(
        "Samsung Electronics \u2014 Samsung R&D Institute India, Delhi",
        "Software Engineer, Frontend",
        "Jul 2024 \u2013 Present"
    )
    samsung_bullets = [
        "Built an AI-augmented development system on top of a custom MCP server and Turborepo monorepo "
        "that automates 60\u201370% of repetitive frontend work \u2014 code generation, refactoring, "
        "component scaffolding. Onboarding a new app went from a day\u2019s work to under an hour.",

        "Authored <b>@repo/dashcraft</b>, a headless dashboard library (React + TypeScript + DnD Kit + "
        "Framer Motion) with grid layout, drag-and-drop, dynamic resizing, API polling, and theming. "
        "Teams building new dashboards now start from a working product instead of a blank canvas \u2014 "
        "roughly 60% faster end-to-end.",

        "Led the frontend for a content-verification Test Suite \u2014 an admin portal (React + Vite + "
        "TypeScript) for authoring, scheduling, and monitoring automated quality checks of TVPlus "
        "channels and VOD services on remote DTV farms via DAB protocol.",

        "Engineered a browser-based HLS video player using Web Workers and Service Workers for adaptive "
        "streaming and smart caching. Cold-start playback under 2 seconds.",

        "Merged five legacy internal portals into a single SPA: incident dashboards, live HLS streams, "
        "structured logs, and metadata services in one place. Reduced MTTR and stopped the "
        "\u201cwhich portal\u201d question entirely.",

        "30% faster data fetching and 40% drop in incident-reporting latency through caching, "
        "prefetching, and code-splitting \u2014 no library changes, just better patterns.",

        "Run internal paired learning sessions at Samsung Research Center on agentic AI workflows "
        "\u2014 teaching engineers how to actually work with tools like Cline and custom MCP tools "
        "to get real productivity gains, not just hype.",
    ]
    for b in samsung_bullets:
        story.append(bullet_item(b))

    # Safex
    story += job_header(
        "Safex Chemicals India Pvt Ltd, Delhi",
        "Frontend Developer",
        "Mar 2023 \u2013 Jun 2024"
    )
    safex_bullets = [
        "Implemented Azure AD SSO (MSAL) and Google OAuth 2.0 with role-based access across the "
        "platform \u2014 first proper authentication layer the product had.",

        "Built a SAP Cloud Platform integration (Node.js + Express backend, React frontend) that "
        "replaced a manual data-export workflow for 15,000+ B2B users.",

        "Contributed to the core e-commerce product: order tracking, bulk ordering flows, "
        "and Google Analytics instrumentation for product and ops teams.",

        "Delivered a responsive LMS with video streaming, quiz modules, and real-time "
        "Firebase sync. Whole thing from design handoff to production in about 10 weeks.",

        "Cut page load times by 40% through prefetching, memoization, lazy loading, "
        "code splitting, and virtual lists \u2014 no backend changes required.",

        "Set up the team\u2019s first structured PR-review process and unit/integration test suite.",
    ]
    for b in safex_bullets:
        story.append(bullet_item(b))

    # DevsLane
    story += job_header(
        "DevsLane, Noida",
        "Frontend Engineer",
        "Nov 2021 \u2013 Mar 2023"
    )
    devslane_bullets = [
        "Delivered pixel-perfect React UIs from Figma and Adobe XD designs across "
        "multiple client projects \u2014 dashboards, landing pages, admin portals.",

        "Built and documented reusable component libraries with Storybook, picked up "
        "across 3+ projects running concurrently.",

        "Wired up REST API integrations with proper error boundaries, validation, "
        "and loading states \u2014 the kind of detail that makes apps feel solid.",

        "Applied semantic HTML and WCAG accessibility practices on all deliverables.",
    ]
    for b in devslane_bullets:
        story.append(bullet_item(b))

    story.append(Spacer(1, 4))

    # ── PROJECTS ──────────────────────────────────────────────────────────────
    story += section_header("Personal Projects & Open Source")

    # Project 1 — Monorepo
    story.append(Paragraph("Production Turborepo Monorepo Platform", S["proj_name"]))
    story.append(Paragraph(
        "A monorepo I\u2019ve been building as a proper platform \u2014 14 web apps, 8 shared packages, "
        "and 35+ automation CLIs in a single pnpm workspace. The interesting parts:",
        S["proj_body"]
    ))
    mono_bullets = [
        "<b>@repo/dashcraft</b> \u2014 the headless widget/dashboard library. DnD, dynamic resizing, "
        "Recharts/Nivo chart integrations, Zustand state, API polling, multi-theme support.",

        "<b>@repo/ui</b> \u2014 100+ Radix UI + Tailwind components with Storybook docs. "
        "Used across all apps in the repo.",

        "35+ CLI tools for component generation, accessibility auditing, render performance "
        "analysis, TypeScript enforcement, and automated refactoring.",
    ]
    for b in mono_bullets:
        story.append(bullet_item(b))
    story.append(Paragraph(
        "<b>Tech:</b> React 19, TypeScript, Vite, Turborepo, Rollup, DnD Kit, Framer Motion, pnpm workspaces",
        S["proj_body"]
    ))

    # Project 2 — AI Builder
    story.append(Paragraph("AI-Powered UI Builder", S["proj_name"]))
    story.append(Paragraph(
        "Describe a dashboard layout in plain English \u2014 get a working React layout rendered "
        "on a dashcraft canvas. Integrates Ollama (llama3.2:3b) locally so nothing leaves the machine. "
        "Monaco Editor for live code editing alongside the preview.",
        S["proj_body"]
    ))
    story.append(Paragraph(
        "<b>Tech:</b> React, TypeScript, Zustand, Ollama API, OpenAI SDK, Monaco Editor",
        S["proj_body"]
    ))

    # Project 3 — 3D Portfolio
    story.append(Paragraph("3D Interactive Portfolio", S["proj_name"]))
    story.append(Paragraph(
        "Performance-focused portfolio with GSAP scroll-triggered animations, clip-path transitions, "
        "and Three.js postprocessing effects. EmailJS contact form. "
        "Built to explore what the browser can actually do when you push it.",
        S["proj_body"]
    ))
    story.append(Paragraph(
        "<b>Tech:</b> React 19, GSAP 3, Three.js, React Three Fiber, React Three Postprocessing, Tailwind",
        S["proj_body"]
    ))

    story.append(Spacer(1, 4))

    # ── EDUCATION ─────────────────────────────────────────────────────────────
    story += section_header("Education")

    story.append(Paragraph("Master of Computer Applications (MCA)", S["edu_inst"]))
    story.append(Paragraph("Chandigarh University \u2013 Sep 2023 \u2013 Present (Pursuing)", S["edu_detail"]))

    story.append(Paragraph("Bachelor of Commerce (Hons)", S["edu_inst"]))
    story.append(Paragraph("University of Delhi \u2013 Aug 2013 \u2013 Jul 2016", S["edu_detail"]))

    story.append(Spacer(1, 4))

    return story


# ── Build ─────────────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    leftMargin=0.65 * inch,
    rightMargin=0.65 * inch,
    topMargin=0.55 * inch,
    bottomMargin=0.55 * inch,
)
doc.build(build_story())
print(f"Done → {OUTPUT}")
