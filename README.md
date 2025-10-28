# School Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It's a full-stack application for managing a directory of schools.

## Features

- **Add New Schools**: A dedicated page (`/add-school`) allows users to add new schools to the directory. The form captures essential details such as the school's name, address, contact information, and an image.
- **View a List of Schools**: The `/show-school` page displays all the registered schools in a card-based layout. Each card, rendered by the `SchoolCard` component, provides a quick overview of the school, including its name, address, and city.
- **API Routes for Data Persistence**: The application uses Next.js API routes (e.g., `/api/add-school`) to handle the backend logic for creating and managing school data, which is then persisted in a database.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for building user interfaces.
- [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript.
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) - Serverless PostgreSQL database.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript.
- [React Hook Form](https://react-hook-form.com/) - For building forms in React.

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm, yarn, pnpm, or bun

### 1. Installation

First, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd school-project
npm install
```

### 2. Environment Variables

This project requires a PostgreSQL database connection. Create a `.env` file in the root of the project and add your database connection string:

```
POSTGRES_URL="your_database_connection_string"
```

This is used by Prisma and Vercel Postgres.

### 3. Database Setup

Once your environment variables are set up, you need to sync your database schema with the Prisma schema.

```bash
npx prisma db push
```

This will create the necessary tables in your database based on the `prisma/schema.prisma` file.

The `postinstall` script will automatically run `prisma generate` after you install dependencies, but you can also run it manually if you make changes to the schema:

```bash
npx prisma generate
```

### 4. Running the Development Server

Now you can run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production. This also runs `prisma generate`.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the codebase using ESLint.

## Project Structure

- `app/`: Contains the pages and routes of the application, following the Next.js App Router structure.
  - `api/`: Contains the API route handlers.
  - `components/`: Contains reusable React components.
- `lib/`: Contains library code, such as the Prisma client instance.
- `prisma/`: Contains the Prisma schema file (`schema.prisma`).
- `public/`: Contains static assets like images and SVGs.
