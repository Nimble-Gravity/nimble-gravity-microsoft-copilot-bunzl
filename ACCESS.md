# Access & Visibility

**This site is public.** The repository is public on GitHub and is published with GitHub Pages, so the deployed site — and every file served from the repo root, including the lesson HTML, `assets/lab-data/`, docs (`docs/superpowers/**` included), and every other markdown file — is reachable by anyone with the URL and indexable by search engines. The current content is the **Bunzl** M365 Copilot program build (replacing a prior Brown & Brown build — see git history): all lab data is synthetic and the client's real internal specifics (names, figures, from any private discovery call) must never be committed, per `CLAUDE.md`'s Domain Context. This build was made **directly on `main`, in place**, not on a `client-<name>` branch — following the same precedent as the prior Axos→Brown & Brown transition — which diverges from this doc's own recommendation below; that divergence was a deliberate choice for this engagement, not an oversight, but means the client-branch gating this doc recommends is not in effect for this content.

## What "public" means for client engagements

The generic template is fine to be public. A **client branch** (`client-<name>`) that contains a client's name, scenarios, letterhead, or use cases should **not** be published to the public Pages site as-is.

## Real access control is out of P1 scope

There is no authentication on this site and none is planned for the P1 build. A genuine gate requires one of:

- **Private repo + GitHub Enterprise Cloud** → access-controlled GitHub Pages (Pages visible only to org members). Requires the repo to be private *and* an Enterprise plan.
- **A host with auth** → move the static build behind Cloudflare Access, Netlify/Vercel password protection, or an identity-aware proxy.
- **Per-tenant clone** → deliver the client branch inside the client's own walls (their tenant / their hosting).

A client-side JavaScript "password" on a public static site is **not** access control — the content ships in the page source and is trivially bypassed. Do not rely on one.

## Recommendation

- Keep `main` / the generic template public.
- Build client packs on `client-<name>` branches and deploy those **only** to a gated host (one of the options above) — never to the public Pages site.
- Revisit a real gate with infra/Kevin before the first client engagement goes live.
