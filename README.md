# Bookkeeping Application

A modern bookkeeping application built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Authentication**: Secure login system with Supabase auth
- **Dashboard**: View all bookkeeping records aggregated by reference
- **Details View**: Drill down into specific records with detailed breakdowns
- **Data Management**: Create and manage incoming and expense records
- **Real-time Updates**: Live data fetching from Supabase
- **Responsive Design**: Dark theme with mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL database & authentication)
- **Styling**: Tailwind CSS
- **Testing**: Jest (unit tests), Playwright (E2E tests)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase project with environment variables configured

### Environment Setup

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Authentication

1. Navigate to `/login`
2. Enter your email and password
3. You'll be redirected to the list page upon successful login

### Managing Records

#### View All Records
- Go to `/list` to see all records aggregated by reference period
- Click on any row to view detailed information

#### View Details
- Navigate to `/details/{reference}` to see specific record details
- Shows incomings and expenses for the selected reference period

#### Create New Records
- Go to `/create` to add new incoming or expense records
- Fill in the required fields and submit

### Navigation

- **Login**: `/login` - Authentication page
- **List**: `/list` - Main dashboard with all records
- **Details**: `/details/{reference}` - Detailed view for specific records
- **Create**: `/create` - Add new records

## Testing

### Unit Tests (Jest)

Run unit tests for components and utilities:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### E2E Tests (Playwright)

Run end-to-end tests:

```bash
npm run test:e2e
```

View E2E test report:

```bash
npx playwright show-report
```

**Note**: E2E tests require valid Supabase credentials. Set `TEST_EMAIL` and `TEST_PASSWORD` environment variables for automated login.

## Project Structure

```
app/
├── (protected)/          # Protected routes (require authentication)
│   ├── list/             # List page with aggregated data
│   ├── details/          # Details page for specific records
│   └── create/           # Create new records
├── components/           # Reusable UI components
├── services/             # API service layer (Supabase)
├── lib/                  # Utility functions and configurations
└── login/                # Authentication page

e2e/                      # Playwright E2E tests
├── list.spec.ts         # List page E2E tests
└── details.spec.ts      # Details page E2E tests
```

## Development Notes

- The app uses Supabase SSR for authentication and data fetching
- API calls are made in parallel where possible for better performance
- Loading states are handled with a custom useLoading hook
- The application uses a dark theme with olive-based color scheme

## Troubleshooting

### Authentication Issues
- Ensure your Supabase credentials are correct in `.env.local`
- Check that your Supabase project has email/password auth enabled

### Database Connection
- Verify your Supabase URL and anon key are correct
- Ensure your Supabase project is active

### Test Failures
- Unit tests: Check that all dependencies are installed
- E2E tests: Ensure your dev server is running and credentials are valid
- Rate limiting: E2E tests run sequentially to avoid Supabase rate limits
