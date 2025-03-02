# Expense Tracker App

A modern React.js application for tracking personal expenses and income.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CashBook/       # CashBook-specific components
│   ├── Header/         # App header components
│   └── Tabs/           # Navigation tab components
├── pages/              # Route-level components
│   └── CashBook/       # CashBook page
├── config/             # Configuration files
├── constants/          # Application constants
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/            # Static assets (images, icons)
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Environment Setup

1. Create the following environment files in the root directory:
   - `.env.development`
   - `.env.production`
   - `.env.staging`
   - `.env.local`

2. Add the required environment variables:
   ```
   REACT_APP_API_URL=http://localhost:3000
   REACT_APP_ENV=development
   ```

## Adding New Features

1. **Components**
   - Create new components in the appropriate directory under `src/components/`
   - Follow the existing component structure and naming conventions
   - Use TypeScript interfaces for props

2. **Pages**
   - Add new pages under `src/pages/`
   - Use the existing page structure as a template
   - Implement routing in `App.tsx`

3. **Styles**
   - Use Material-UI's styled components for component-specific styles
   - Add global styles to `index.css`
   - Follow the existing theme configuration in `App.tsx`

## Dependencies

- React 18+
- TypeScript
- Material-UI
- React Router DOM
- Styled Components

## Best Practices

1. Follow TypeScript best practices
2. Use functional components with hooks
3. Implement proper error handling
4. Write meaningful component and variable names
5. Keep components small and focused
6. Use proper code formatting and linting
