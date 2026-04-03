# WeloData FE Assessment — Annotation Quality Analysis

Processes annotation data from a labeling project where reviewers classified whether product category selections were distinct or duplicated.

## Setup

```bash
npm install
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run convert` | Part 1: Convert JSON → CSV |
| `npm run analytics` | Part 2: Per-annotator performance stats |
| `npm run accuracy` | Part 3: Ground truth accuracy + quality email |
| `npm run qa-prompt` | Part 4: Generate LLM QA prompt |
| `npm run all` | Run all scripts in sequence |

All outputs are written to `output/`.

## Project Structure

```
├── fe_assessment.json       # Raw annotation data
├── scripts/
│   ├── convert.ts           # JSON → CSV conversion
│   ├── analytics.ts         # Annotator performance metrics
│   ├── accuracy.ts          # Ground truth comparison + quality email
│   └── qa-prompt.ts         # LLM-powered QA prompt generator
└── output/                  # Generated CSVs, JSONs, and reports
```

## Data Schema

Each task contains annotations where reviewers answered:
- **Q1**: Does the list have more than one option? (Yes/No)
- **Q2**: Are the selections distinct? (Yes/No)
- **Q3**: Which selections are not distinct? (free text, only if Q2=No)
- **Q4**: Why are they not distinct? (free text, only if Q2=No)

Some tasks include a `ground_truth` annotation for accuracy benchmarking.