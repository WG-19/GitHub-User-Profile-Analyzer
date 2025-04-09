# GitHub User Profile Analyzer

A modern web application that analyzes GitHub user profiles and displays their activity metrics using React, Shadcn UI, and TypeScript.

## Technologies Used

- **React** - Frontend framework
- **Shadcn UI** - UI component library (built on Radix UI)
- **TypeScript** - For type safety and better development experience
- **GitHub API** - For fetching user data

## Features

- Search for GitHub users by username
- Display user profile information (name, avatar, repositories, followers, following)
- Show repository list with star and fork counts
- Display daily commit history with a line chart
- Error handling for invalid usernames
- Responsive design that works on all devices

## Project Structure

```
src/
├── api/         # API integration with GitHub
│   └── api.ts   # GitHub API calls
├── components/  # React components
│   └── ui/      # Shadcn UI components
└── App.tsx      # Main application component
```

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd user-profile-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will start at `http://localhost:5173`

## Usage

1. Enter a GitHub username in the search input
2. Click the "Search" button or press Enter
3. View the user's profile information, repositories, and commit history

## Error Handling

- Shows an error message if the username is not found
- Automatically clears error messages when a new search is initiated
- Handles API rate limiting gracefully

## API Endpoints

The application uses the following GitHub API endpoints:

- User data: `https://api.github.com/users/{username}`
- Repositories: `https://api.github.com/users/{username}/repos`
- Events: `https://api.github.com/users/{username}/events/public`

## Development

The project is built with React(+Vite) and uses TypeScript for type safety. All components are built using Shadcn UI, which provides a consistent and accessible design system.

## License

MIT License
