================================================================================
DATASETS & RESEARCH PAPERS - Data Files
================================================================================

This folder contains JSON data files for the DetectX website.

STRUCTURE:
----------
/public/data/
├── datasets/
│   └── datasets.json    ← Edit this to add datasets
└── papers/
    └── papers.json      ← Edit this to add research papers

HOW TO ADD DATA:
----------------
1. Edit the appropriate JSON file
2. Follow the existing format
3. Save the file
4. The website will automatically load the new data

DOCUMENTATION:
--------------
For detailed instructions, see: /docs/DATA_INSTRUCTIONS.md

EXAMPLE DATASET ENTRY:
----------------------
{
  "id": "unique-id",
  "title": "Dataset Name",
  "description": "Brief description",
  "url": "https://link-to-dataset.com",
  "category": "Image",
  "size": "2.5 GB",
  "year": "2024",
  "downloads": "15K+"
}

EXAMPLE PAPER ENTRY:
--------------------
{
  "id": "unique-id",
  "title": "Paper Title",
  "authors": "Author et al.",
  "journal": "Journal Name",
  "year": "2024",
  "url": "https://arxiv.org/abs/...",
  "abstract": "Brief abstract",
  "citations": "123",
  "category": "Image Detection"
}

================================================================================
For full documentation, visit: /docs/
================================================================================
