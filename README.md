# Auris - Your Intelligent Meeting Assistant

![Auris Banner Placeholder](https://via.placeholder.com/1200x400?text=Auris+Banner+Image)

**Auris** is a next-generation AI-powered meeting assistant designed to streamline your workflow by automating meeting documentation, integrating with your favorite tools, and providing intelligent insights. It doesn't just record meetings; it understands them.

Connect your calendar, let Auris join your calls, and get instant summaries, action items, and the ability to "chat" with your entire meeting history using advanced RAG (Retrieval-Augmented Generation) technology.

---

## Key Features

### Intelligent Meeting Agent
- **Auto-Join & Record**: Automatically syncs with your Google Calendar and joins meetings (Google Meet, Zoom, Teams) to record audio and video.
- **Real-time Transcription**: High-accuracy transcription with speaker diarization to know who said what.
- **Smart Summaries**: AI-generated summaries that capture the essence of the discussion, not just the transcript.
- **Action Item Extraction**: Automatically identifies and lists tasks, assignees, and deadlines.

### RAG-Powered Chat (Talk to Your Data)
- **Universal Search**: Ask questions like *"What did we decide about the marketing budget last week?"* and get answers based on your meeting history.
- **Vector Database**: Uses Pinecone to store and index meeting transcripts for semantic search.
- **Contextual Awareness**: The AI understands the context of previous meetings to provide relevant answers.

### Advanced Integrations Ecosystem
Auris acts as a central hub, connecting your meetings to your workflow tools.

- **Slack Integration**:
  - **Notifications**: Receive instant meeting summaries and action items in dedicated channels or direct messages.
  - **Interactive Bot**: "Chat" with Auris directly from Slack. Ask *"What are my tasks from the Product Sync?"* and get an instant response without leaving Slack.
  - **Slash Commands**: Use commands to quickly retrieve meeting info or trigger actions.

- **Project Management (Trello, Jira, Asana)**:
  - **Auto-Export Action Items**: Automatically convert meeting action items into tasks/cards in your preferred project management tool.
  - **Context Syncing**: Attach meeting summaries and video clips directly to Jira tickets or Trello cards for full context.
  - **Board Management**: Select specific boards or projects for different meeting types (e.g., "Engineering Sync" -> Jira, "Marketing Weekly" -> Trello).

- **Calendar Sync**: Two-way sync with Google Calendar ensures Auris never misses a meeting and updates your event descriptions with summaries.

### Customizable & Personal
- **Custom Bot Identity**: Name your assistant and give it a custom avatar to fit your company culture.
- **Privacy First**: Enterprise-grade security with granular permissions.

### Flexible Pricing
- **Tiered Plans**: Free, Starter, Pro, and Premium plans to suit individuals and large teams.
- **Billing**: Monthly and Yearly billing options with Stripe integration (Save ~17% on yearly plans).

---

## Technology Stack

Auris is built with a modern, scalable, and type-safe stack:

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: Next.js Server Actions & API Routes
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/)), [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **AI & ML**: 
  - [Google Gemini](https://deepmind.google/technologies/gemini/) (LLM for Summaries & Chat)
  - [Pinecone](https://www.pinecone.io/) (Vector Database for RAG)
- **Real-time**: [Slack Bolt](https://slack.dev/bolt-js/) (Slack Bot Events), WebSockets

---

## Screenshots

| Dashboard | Pricing Page |
|:---:|:---:|
| ![Dashboard Placeholder](https://via.placeholder.com/600x400?text=Dashboard+UI) | ![Pricing Placeholder](https://via.placeholder.com/600x400?text=Pricing+Page) |

| Meeting Insights | Settings |
|:---:|:---:|
| ![Meeting View Placeholder](https://via.placeholder.com/600x400?text=Meeting+Insights) | ![Settings Placeholder](https://via.placeholder.com/600x400?text=Settings+Page) |

---

## Getting Started

Follow these steps to set up Auris locally on your machine.

### Prerequisites
- Node.js (v20+)
- npm or yarn
- PostgreSQL Database
- Clerk Account
- Stripe Account
- Google Cloud Project (for Gemini & Calendar API)
- Pinecone Account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/auris.git
cd auris
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and populate it with your keys:

```bash
# Database (Neon/Postgres)
DATABASE_URL="postgresql://..."

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Payments (Stripe)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI (Google Gemini & Pinecone)
GEMINI_API_KEY="AIza..."
PINECONE_API_KEY="..."
PINECONE_INDEX="..."

# AWS S3 (For storing avatars/recordings)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="..."
AWS_BUCKET_NAME="..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup
Push the schema to your database:
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Project Structure

```bash
auris/
├── app/
│   ├── api/             # Backend API routes (Stripe, Slack, RAG, etc.)
│   ├── (auth)/          # Authentication pages (Sign in/up)
│   ├── dashboard/       # Main user dashboard
│   ├── meetings/        # Individual meeting views
│   ├── pricing/         # Pricing & Subscription page
│   └── settings/        # User & Bot settings
├── components/          # Reusable UI components (Shadcn)
├── lib/                 # Utility functions (DB, AI, Helpers)
├── prisma/              # Database schema
└── public/              # Static assets
```

---

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and request features.