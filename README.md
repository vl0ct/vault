# Vault (self-hostable)

An encrypted cloud platform for securely storing, syncing, and managing environment variables across all your projects and teams.

## Some Previews

- Landing Page
  ![Screenshot](/public/preview.png)

- Personal Dashboard
  ![Screenshot](/public/personal-dashboard.png)

- Teams Dashboard
  ![Screenshot](/public/teams-dashboard.png)

- Projects Details Page
  ![Screenshot](/public/personal-project-view.png)

- Team Members
  ![Screenshot](/public/teams-members.png)

## ✨ Features

- **👥 Collaboration** - Collaborate with team members on environment variables
- **🔒 Secure Storage** - Enterprise-grade encryption for your sensitive data
- **🔑 Easy Access** - Simple and intuitive interface for managing environment variables
- **🛡️ Encrypted** - End-to-end encryption ensures your data stays private
- **⚡ Fast Sync** - Quick synchronization across all your projects and environments
- **🌐 Multi-Environment** - Manage environment variables for different environments (e.g., development, staging, production)

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with Radix UI components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Runtime**: Bun
- **TypeScript**: Full type safety throughout

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/VA5UDEV/vault.git
cd vault
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up your environment variables:

```bash
cp .env.example .env.local
```

4. Configure your database connection in `.env.local`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/vault"
```

5. Apply the database migrations:

```bash
pnpm run db:migrate
```

6. Start the development server:

```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`.

## 🛠️ Development

### Available Scripts

- `pnpm run dev` - Start development server with Turbopack
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run Biome linting
- `pnpm run format` - Format code with Biome
- `pnpm run db:push` - Push database schema changes (development only)
- `pnpm run db:migrate` - Apply tracked migrations (use for production)
- `pnpm run db:studio` - Open Drizzle Studio
- `pnpm run schema:generate` - Generate database migrations

### Project Structure

```
vault/
├── app/
│   ├── (main)/
│   │   ├── auth/          # Authentication pages
│   │   └── dashboard/     # Dashboard pages
│   ├── (root)/            # Landing page
│   └── api/               # API routes
├── components/            # Reusable UI components
├── db/                    # Database schema and configuration
├── drizzle/              # Database migrations
├── lib/                  # Utility functions and configurations
├── modules/              # Feature modules
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL="your-postgresql-connection-string"
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GMAIL_USER=
GMAIL_PASS=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### Database Setup

This project uses PostgreSQL with Drizzle ORM. Make sure you have PostgreSQL running and create a database for the application.

## 🚀 Deployment (Vercel)

The project is configured to run on Vercel with the Node.js runtime.

### Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables), plus a local `.env.local` for development:

```env
DATABASE_URL="your-postgresql-connection-string"
BETTER_AUTH_URL="https://your-domain.com"
BETTER_AUTH_SECRET=""         # openssl rand -base64 32 — generate a fresh one for production
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GMAIL_USER=""
GMAIL_PASS=""                 # Gmail app password
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

> `BETTER_AUTH_SECRET` is also used as the AES encryption key for stored environment values. Do not rotate it after release, or previously saved values become unreadable.

### OAuth Redirect URIs

Register the production callback URLs in your OAuth provider dashboards:

- Google Cloud Console: add `https://your-domain.com/api/auth/callback/google`
- GitHub OAuth App: add `https://your-domain.com/api/auth/callback/github`

### Database Migrations

Apply tracked migrations to the production database from your machine/CI (Vercel does not run them):

```bash
pnpm run db:migrate
```

Use `db:migrate` instead of `db:push` in production to avoid silent schema drift.

### Build

```bash
pnpm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/VA5UDEV/vault)
- [Issues](https://github.com/VA5UDEV/vault/issues)

## 💡 Why Vault?

Managing environment variables across multiple projects, environments, and team members can be challenging. Vault solves this by providing a secure, centralized platform where you can:

- Store sensitive configuration data with enterprise-grade encryption
- Easily share environment variables with team members
- Sync configurations across development, staging, and production environments
- Maintain version history and audit trails
- Access your variables from anywhere with a simple, intuitive interface

Built with modern web technologies and security best practices, Vault ensures your sensitive data remains protected while being easily accessible to authorized users.
