# KMS Dashboard

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-Deployed-orange?logo=cloudflare)](https://pages.cloudflare.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Edge Runtime](https://img.shields.io/badge/Runtime-Edge-brightgreen)](https://edge-runtime.vercel.app/)

> Enterprise-grade API Key Management Dashboard with AI-powered scope suggestions, deployed on Cloudflare's edge network for optimal performance and global availability.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Cloudflare Edge                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │   Pages     │◄──►│  Workers    │◄──►│  Workers AI (LLM)   │ │
│  │  (Next.js)  │    │   (API)     │    │  Scope Suggestions  │ │
│  └─────────────┘    └─────────────┘    └─────────────────────┘ │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐    ┌─────────────┐                             │
│  │     KV      │    │  Analytics  │                             │
│  │  (Session)  │    │  (Real-time)│                             │
│  └─────────────┘    └─────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  External APIs  │
                    │  • GitHub       │
                    │  • GitLab       │
                    │  • NPM          │
                    └─────────────────┘
```

## Key Features

### Core Functionality
- **API Key Management**: Create, rotate, revoke and monitor API keys with granular permissions
- **Real-time Analytics**: Live usage statistics with interactive charts
- **Multi-tenant Support**: Organization-based access control
- **Audit Logging**: Complete traceability of all key operations

### AI-Powered Features
- **Intelligent Scope Suggestions**: LLM-based permission recommendations using Cloudflare Workers AI
- **Natural Language Processing**: Describe your use case, get optimal scope configurations
- **Security Analysis**: Automatic detection of overly permissive keys

### Developer Experience
- **Edge-Native Architecture**: Sub-100ms response times globally
- **Type-Safe**: Full TypeScript implementation with strict mode
- **Modern UI**: Built with Radix UI primitives and Tailwind CSS
- **Responsive Design**: Optimized for desktop and mobile workflows

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15 (App Router) | React framework with edge runtime |
| **Language** | TypeScript 5 | Type-safe development |
| **Styling** | Tailwind CSS + Radix UI | Utility-first CSS + accessible primitives |
| **State** | React Hook Form + Zod | Form management and validation |
| **Charts** | Recharts | Data visualization |
| **Notifications** | Sileo | Toast notifications |
| **AI/ML** | Cloudflare Workers AI | LLM inference at the edge |
| **Deployment** | Cloudflare Pages | Edge deployment platform |

## Project Structure

```
kms-dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth group (login)
│   │   ├── (dashboard)/       # Dashboard group
│   │   │   ├── keys/          # API key management
│   │   │   ├── settings/      # Configuration
│   │   │   ├── statistics/    # Analytics
│   │   │   └── integrations/  # External integrations
│   │   ├── api/               # API routes (edge runtime)
│   │   │   └── ai/
│   │   │       └── scopes/    # AI scope suggestions
│   │   ├── actions.ts         # Server actions
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── dashboard/         # Dashboard components
│   │   ├── providers/         # Context providers
│   │   └── ui/                # UI primitives
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and clients
│   └── test/                  # Test suite
├── docs/                      # Documentation
├── public/                    # Static assets
├── wrangler.toml             # Cloudflare configuration
└── next.config.ts            # Next.js configuration
```

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Cloudflare account (for deployment)

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd kms-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Environment Variables

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cloudflare (for AI features)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token

# External APIs (optional)
GITHUB_TOKEN=your_github_token
GITLAB_TOKEN=your_gitlab_token
NPM_TOKEN=your_npm_token
```

## Deployment

### Cloudflare Pages (Recommended)

1. **Install Wrangler CLI**:
```bash
npm install -g wrangler
```

2. **Authenticate with Cloudflare**:
```bash
wrangler login
```

3. **Configure your project**:
Update `wrangler.toml` with your account details:
```toml
name = "kms-dashboard"
account_id = "your-account-id"
```

4. **Deploy**:
```bash
# Build for Cloudflare Pages
npm run build:pages

# Deploy to Cloudflare
npm run deploy
```

### Build Configuration

The project uses `@cloudflare/next-on-pages` for edge-compatible builds:

```json
{
  "scripts": {
    "build:pages": "npx @cloudflare/next-on-pages",
    "deploy": "wrangler pages deploy .vercel/output/static"
  }
}
```

## Edge Runtime Configuration

All API routes use the Edge Runtime for optimal performance:

```typescript
// src/app/api/ai/scopes/route.ts
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const ai = (request as any).env?.AI;
  // AI inference at the edge
}
```

## AI Scope Suggestions

The dashboard leverages Cloudflare Workers AI to provide intelligent scope recommendations:

**Request Flow:**
1. User describes intended API key usage
2. Request hits the edge worker
3. LLM (Llama 3.1) analyzes the description
4. Returns optimized scope configuration with reasoning

**Fallback Strategy:**
If AI is unavailable, the system uses keyword-based inference for uninterrupted service.

## API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/scopes` | Get AI-powered scope suggestions |

### Example Request

```bash
curl -X POST https://your-domain.com/api/ai/scopes \
  -H "Content-Type: application/json" \
  -d '{"description": "Read-only access for CI/CD pipeline"}'
```

### Response

```json
{
  "suggestedScopes": ["read"],
  "reasoning": "Based on the description, read-only access is sufficient for CI/CD pipeline operations."
}
```

## Testing

```bash
# Run unit tests
npm test

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

## Performance Optimizations

- **Edge Deployment**: Static generation at 300+ locations worldwide
- **Streaming**: Progressive enhancement with React Suspense
- **Code Splitting**: Route-based automatic splitting
- **Image Optimization**: Next.js Image component with Cloudflare CDN
- **Caching**: KV-based session storage with configurable TTL

## Security Considerations

- **Edge Runtime**: No Node.js attack surface
- **Input Validation**: Zod schemas for all inputs
- **CSP Headers**: Content Security Policy enforcement
- **Secure Cookies**: HttpOnly, Secure, SameSite flags
- **Rate Limiting**: Built-in Cloudflare protection

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Cloudflare](https://cloudflare.com) for edge infrastructure
- [Next.js](https://nextjs.org) team for the framework
- [Radix UI](https://radix-ui.com) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com) for styling utilities

---

<p align="center">
  Built with ❤️ for developers who value security and performance
</p>
