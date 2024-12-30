# TravelAI - AI-Powered Travel Planner

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public key
- `CLERK_SECRET_KEY`: Clerk secret key
- `MONGODB_URI`: MongoDB connection string
- `OPENAI_API_KEY`: OpenAI API key

## VS Code Setup

1. Install recommended extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense

2. The project includes preconfigured settings for:
   - TypeScript
   - ESLint
   - Prettier
   - Editor formatting

## Project Structure

```
├── app/                 # Next.js app directory
├── components/          # React components
├── lib/                 # Utility functions and configurations
├── public/             # Static assets
└── types/              # TypeScript type definitions
```

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run fo