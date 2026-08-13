# Compete McGill

Website for Compete McGill, McGill University's competitive programming club.

## Development

```bash
npm install
npm run dev     # runs on http://localhost:4321
npm run build
npm run lint
```

## Editing content

Site copy and data live in `src/content`. The fall event list shown on the
home and sponsorship pages is in `fallEvents.ts`, and it should be kept in
sync with the sponsorship prospectus PDF in `public`. Algorithm templates
are in `src/content/templates`, one file per topic. Pages under `src/app`
read from these files, so most updates do not require touching component
code.

## Deployment

Hosted on Vercel. Deploy with `vercel --prod`, or push to `main` once the
GitHub repo is connected to the Vercel project.
