# 📚 Datasets & Research Papers - Upload Instructions

## Folder Structure

```
/public/data/
├── datasets/
│   └── datasets.json    ← Edit this file to add datasets
└── papers/
    └── papers.json      ← Edit this file to add research papers
```

## How to Add Datasets

Edit `/public/data/datasets/datasets.json` and add entries in this format:

```json
{
  "id": "unique-id",
  "title": "Dataset Name",
  "description": "Brief description of the dataset",
  "url": "https://link-to-dataset.com",
  "category": "Image | Video | Text",
  "size": "File size (e.g., 2.5 GB)",
  "year": "2024",
  "downloads": "15K+"
}
```

## How to Add Research Papers

Edit `/public/data/papers/papers.json` and add entries in this format:

```json
{
  "id": "unique-id",
  "title": "Paper Title",
  "authors": "Author et al.",
  "journal": "Journal Name",
  "year": "2024",
  "url": "https://arxiv.org/abs/...",
  "abstract": "Brief abstract of the paper",
  "citations": "123",
  "category": "Image Detection | Text Detection | Video Detection | Survey"
}
```

## Tips

- **URLs**: Use full links starting with `https://`
- **Placeholder**: Use `"#"` as URL if link is not available yet
- **Size Format**: Use human-readable formats (GB, MB)
- **Categories**: Keep consistent with existing categories
- **IDs**: Use unique sequential numbers or descriptive slugs

## After Updating

1. Save the JSON file
2. The website will automatically load and display the new entries
3. Check the `/datasets` and `/research` pages to verify
4. Animations will automatically apply to new entries

## File Validation

Make sure your JSON is valid! Use a JSON validator like:
- https://jsonlint.com/
- VS Code's built-in JSON validation

## Example Workflow

1. Find a new dataset or paper
2. Open the appropriate JSON file
3. Copy an existing entry
4. Modify the fields with new data
5. Save the file
6. Visit the website to see it live!

---

**Note**: These files are in the `public` folder, so they're accessible directly from the browser. The website fetches them dynamically and displays them with beautiful animations!


