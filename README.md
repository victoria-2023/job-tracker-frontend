# Job Tracker Frontend

![WhatsApp Image 2025-04-17 at 12 23 58_904e3722](https://github.com/user-attachments/assets/ab90f7b3-4c4e-4ed6-a02e-a46e40b8f5fb)


React frontend application for managing job applications with a modern Material-UI interface.

## Technology Stack

- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- React Query
- React Router
- React Hot Toast

## Features

- Modern, responsive UI
- Real-time form validation
- Toast notifications
- Job status filtering
- Clean Material Design
- Dark/Light theme support

## Component Structure

```
src/
├── components/
│   ├── JobList.tsx        # Main job listing component
│   ├── JobForm.tsx        # Form for creating/editing jobs
│   └── ...
├── hooks/
│   └── useJobs.ts         # Custom hook for job operations
├── types/
│   └── job.ts            # TypeScript interfaces
└── App.tsx               # Main application component
```

## Setup & Development

1. Requirements:
   - Node.js 16+
   - npm/yarn

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Environment Variables

Create `.env` file in the root:
```
VITE_API_URL=http://localhost:8080/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests 
