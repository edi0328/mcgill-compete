# Compete McGill

Website for McGill University's competitive programming club, built with Next.js, TypeScript, and Tailwind CSS.

[Visit the site](https://competemcgill.com)

## Features

- Club information, event listings, and a hall of fame
- Algorithm templates grouped by topic, with search and syntax highlighting
- Light and dark themes, responsive layouts, and motion effects
- A contact form using FormSubmit

## Run locally

With Node.js and npm installed:

```bash
npm ci
npm run dev
```

Open http://localhost:4321. Run `npm run lint` to check the code and `npm run build` to create a production build.

## Update content

Most content lives in `src/content`. Edit `fallEvents.ts` for the homepage event list, `site.ts` for club links, and `templates/` for algorithm templates. Pages live in `src/app` and reusable UI components in `src/components`.

Keep event information in sync with the sponsorship prospectus in `public`. The retired sponsorship page is preserved in `archive`.

## Contact and deployment

The contact form sends requests to `site.links.email` through FormSubmit. The recipient must confirm the activation email before messages are forwarded. No API key is needed.

Hosted on Vercel. Builds download the Google fonts declared in `src/app/layout.tsx`.
