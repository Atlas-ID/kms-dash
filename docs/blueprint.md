# **App Name**: KeyMaster Dashboard

## Core Features:

- Login Authentication: Secure login using ADMIN_API_KEY with localStorage persistence and validation against the /keys/stats endpoint.
- API Key List View: Display API keys in a responsive table with name, masked key, scopes, creation date, last used date, and status. Includes filtering and sorting.
- Create API Key: Modal form to create a new API key with name, scopes, and description. Displays the full key only once in a success modal.
- API Key Details: Detailed view of a single API key, including history, options to regenerate, update scopes, deactivate/activate, and delete.
- Statistics Dashboard: Dashboard displaying key statistics, including total active keys, request counts, usage graphs, and most used keys.
- Configuration Settings: Settings page to change ADMIN_API_KEY, API URL, theme, and logout.
- Key Suggestion Tool: AI-powered tool to suggest optimal API key scopes and permissions based on the provided description using reasoning.

## Style Guidelines:

- Primary color: Vivid blue (#3b82f6) to maintain consistency with the project and signal trustworthiness and reliability.
- Background color: Light blue (#E0F7FA), desaturated from the primary to ensure it's easy on the eye, reinforcing a sense of calmness.
- Accent color: Cyan (#22D3EE), providing a contrast that highlights important interactive elements without clashing.
- Headline font: 'Space Grotesk' sans-serif for headlines and short amounts of body text, and 'Inter' for body text. Note: currently only Google Fonts are supported.
- Use simple, consistent icons from a library like Phosphor or Tabler Icons.
- Mobile-first responsive design using Tailwind CSS grid and flexbox.
- Subtle transitions and loading animations to provide feedback.