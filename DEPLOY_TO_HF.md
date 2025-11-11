# Hugging Face Spaces Deployment Workflow

This workflow will automatically deploy your Vite/React app to Hugging Face Spaces (static site) on every push to the `main` branch.

## 1. Prerequisites
- Create a Hugging Face Space (type: static) at https://huggingface.co/spaces
- Link your GitHub repo to the Space (Settings > Integrations > Link repository)
- Set the build command to `npm install && npm run build`
- Set the output directory to `dist`

## 2. .huggingface.yaml (optional, for advanced config)
```yaml
# Place this file in your repo root if you want to override build commands
title: AI Guide Pro
sdk: static
build:
  commands:
    - npm install
    - npm run build
output:
  path: dist
```

## 3. GitHub Actions (optional, for custom deploy)
If you want to push to Spaces from CI, add this workflow to `.github/workflows/deploy-to-hf.yml`:
```yaml
name: Deploy to Hugging Face Spaces
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - name: Push to Hugging Face Spaces
        uses: huggingface/hub-action@v1
        with:
          repo: <username>/<space_name>
          token: ${{ secrets.HF_TOKEN }}
          path: dist
```

## 4. Custom Domain & SSL
- After deploy, go to Space Settings > Custom Domain to add your domain and enable SSL.

## 5. Troubleshooting
- Ensure all static assets (manifest, icons, og-image) are in `public/` or root.
- If you see a blank page, check the build output and Space logs.

---

لأي استفسار: soldiom@gmail.com
