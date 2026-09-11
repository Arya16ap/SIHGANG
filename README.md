# Dino

Shop-floor reports, matched to the right work order.

Operators write production reports in free text — handwritten notes, scans, shift logs. Dino reads them, pulls out the structured fields (part number, quantities, downtime, line, shift), matches the report to the correct open work order, and scores it against the production plan so deviations surface immediately.

**Smart India Hackathon 2026** — Production Report to Production Plan Matching (PS ID 26122), Smart Automation / Manufacturing.

## What it does

1. **Extract** — OCR + NLP over the uploaded report
2. **Match** — resolve the report to an open work order, with a confidence score
3. **Score** — compare reported output against plan and flag deviations and risks

## Stack

React + Vite, Tailwind, shadcn/ui, Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

> Note: the extraction and matching pipeline is currently mocked in the UI — the progress stages and results are placeholders pending backend integration.
