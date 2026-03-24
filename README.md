# Artisanal Flourish (Cake Panier)

Artisanal Flourish is a premium bakery and café digital experience, specializing in handcrafted sourdough breads, bespoke celebration cakes, and artisanal pastries. This platform bridges the traditional craft of slow-fermentation baking with a modern, high-performance e-commerce engine powered by the Dealio API.

## 🥖 Features

- **Live Product Catalog:** Dynamically synchronized with the Dealio Catalog API, featuring real-time availability for breads, pastries, and treats.
- **Bespoke Cake Inquiries:** A dedicated inquiry system for custom celebration cakes, integrated with the Dealio CRM for lead management.
- **Artisanal Box (Cart):** A seamless "build your box" experience with persistent cart logic and price calculation.
- **Modern Tech Stack:** Built with Next.js 15 for server-side performance and optimized image delivery through Sanity CDN.
- **Visual Identity:** A warm, artisanal design language using Noto Serif and Plus Jakarta Sans typography.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Authentication:** [Logto](https://logto.io/)
- **Backend/API:** [Dealio v2 API](https://dealio.com/)
- **CMS/Images:** [Sanity.io](https://www.sanity.io/)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Development

```bash
# Start the development server
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🌍 Environment Variables

Ensure the following variables are set in your `.env` file for full API functionality:

- `DEALIO_API_BASE`: The base URL for the Dealio API.
- `DEALIO_CLIENT_ID`: Your Dealio application client ID.
- `DEALIO_CLIENT_SECRET`: Your Dealio application client secret.
- `NEXT_PUBLIC_LOGTO_APP_ID`: Logto authentication app ID.
- `LOGTO_COOKIE_SECRET`: Secret key for session cookies.

## 📄 License

© 2026 Artisanal Flourish Bakery. All rights reserved.
