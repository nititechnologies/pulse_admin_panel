# Pulse Admin Panel

A modern, responsive admin panel built with Next.js 14, TypeScript, and Tailwind CSS. This admin panel provides comprehensive management tools for news articles, advertising campaigns, and user support tickets.

## Features

### 🏠 Dashboard
- Overview statistics and metrics
- Recent activity feed
- Quick action buttons
- Analytics overview

### 📰 News Management
- **Upload News**: Create and publish new articles
- **Manage News**: Edit, delete, and organize existing articles
- **Analytics**: View performance metrics and insights

### 📢 Ads Management
- **Create Ad**: Design and launch new advertising campaigns
- **Manage Ads**: Edit, pause, and organize existing campaigns

### 🎫 Support & Helpdesk
- **Support**: Manage user support requests and inquiries
- **Helpdesk**: Handle technical support and user assistance requests
- Firebase integration for ticket management

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pulse_admin_panel
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── news/              # News management pages
│   │   ├── upload/        # Upload news page
│   │   ├── manage/        # Manage news page
│   │   └── analytics/     # News analytics page
│   ├── ads/               # Ads management pages
│   │   ├── create/        # Create ad page
│   │   └── manage/        # Manage ads page
│   ├── support/           # Support tickets page
│   ├── helpdesk/          # Helpdesk tickets page
│   └── page.tsx           # Dashboard home page
├── components/            # Reusable components
│   ├── Layout.tsx         # Main layout wrapper
│   ├── Sidebar.tsx        # Navigation sidebar
│   └── Header.tsx         # Top header bar
└── lib/                   # Utility libraries
    └── firebase.ts        # Firebase configuration
```

## Features Overview

### Sidebar Navigation
- Collapsible sidebar with smooth animations
- Expandable submenus for News and Ads sections
- Active state indicators
- User profile section

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Adaptive sidebar behavior
- Touch-friendly interactions

### Data Management
- Search and filtering capabilities
- Pagination for large datasets
- Status indicators and badges
- Action buttons for CRUD operations

### Firebase Integration
- Firestore database for data storage
- Real-time updates for tickets
- User authentication ready
- Scalable data structure

## Customization

### Styling
The project uses Tailwind CSS for styling. You can customize:
- Color scheme in `tailwind.config.js`
- Component styles in individual files
- Global styles in `globals.css`

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Set up authentication (optional)
4. Copy your config values to `.env.local`

### Adding New Features
1. Create new pages in the `app/` directory
2. Add navigation items to `Sidebar.tsx`
3. Update the layout as needed
4. Add any required Firebase collections

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ using Next.js and Tailwind CSS