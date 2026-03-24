# Contributing to Artisanal Flourish

Welcome! We appreciate your interest in contributing to the Artisanal Flourish project. This guide outlines how you can help improve our digital bakery experience.

## 🤝 How to Contribute

### 1. Reporting Bugs
- Use the **GitHub Issues** tab to report bugs.
- Provide a clear description and steps to reproduce.

### 2. Suggesting Features
- Feature requests are welcome! Use the Issues tab to start a discussion.

### 3. Submitting Pull Requests
- Fork the repository.
- Create a feature branch: `git checkout -b feat/my-new-feature` or `git checkout -b fix/issue-123`.
- Commit your changes with descriptive messages following [Conventional Commits](https://www.conventionalcommits.org/).
- Push to your fork and submit a Pull Request.

## 🎨 Coding Guidelines

### Styling & Design
- **Tailwind CSS 4:** Use utility-first styling. Avoid writing custom CSS in separate files unless absolutely necessary.
- **Shadcn UI:** Reuse existing components from `@/components/ui`. Customize via the registry or local modifications when needed.
- **Typography:** Use the `notoSerif` and `plusJakarta` variables for consistent artisanal branding.

### Component Structure
- **Server Components (RSC):** Use Server Components by default for data fetching (e.g., from Dealio API).
- **Client Components:** Only use `'use client'` for interactive elements like forms, buttons, and cart management.

### Data Fetching
- Use the existing utilities in `src/lib/dealio/` for API requests.
- Avoid exposing sensitive API keys in the browser. Always use server-side fetching or Server Actions.

### Branch Naming
- `feat/` for new features.
- `fix/` for bug fixes.
- `chore/` for maintenance and dependency updates.
- `docs/` for documentation changes.

## 🧪 Testing & Verification
- Verify all UI changes locally.
- Run `npm run build` to ensure there are no build errors.

## 📜 Code of Conduct
Please be respectful and helpful in all interactions within this project. We aim to foster a collaborative and welcoming environment.

---
Thank you for helping us bake a better web! 🥖
