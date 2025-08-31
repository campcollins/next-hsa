# Next HSA: A Modern Health Savings Account Application

## Demo Video
https://www.loom.com/share/e62efc03d7584896ae511d45d6952ed2

## Getting Started

Follow these steps to run the Next HSA application locally:

1. **Clone the repository and navigate to the project directory**
   ```bash
   git clone https://github.com/campcollins/next-hsa.git
   cd next-hsa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **View the application in your browser**
   Open your browser and navigate to `http://localhost:3000`. If this port is in use, the terminal will show an alternative port number (e.g., `http://localhost:3001`).

## Project Overview

Next HSA is a web application that simulates the complete lifecycle of a Health Savings Account (HSA). The application provides a simplified experience for managing HSA funds, including account creation, funding through deposits, virtual card issuance, and transaction processing with automatic validation of (simulated) medical expenses based on IRS guidelines.

## Key Features

- **Account Management**: Complete user registration, secure login, and a dynamic dashboard displaying account information
- **Simulated Transactions**: Realistic transaction validation based on Merchant Category Codes (MCCs) to determine qualified medical expenses
- **HSA Lifecycle**: Functional flow for deposits, virtual card issuance, and expense processing with real-time balance updates
- **Responsive UI**: Modern, single-page application with dynamic header and footer, optimized for all device sizes

## Technical Stack

- **Frontend**: React with Next.js 15 for modern component-based development and server-side rendering
- **Backend**: Next.js API Routes (Serverless Functions) for efficient, scalable backend operations
- **Database**: SQLite (file-based database) for simple, reliable data persistence
- **Styling**: Tailwind CSS for rapid, utility-first styling with consistent design system

## Additional Features

### Database Management
- **Setup**: Run `npm run db:setup` to initialize the database schema
- **Reset User Data**: Use `npm run reset-user <email>` to clear user transactions and reset balance to $0 quickly during testing

### Medical Expense Validation
The application includes comprehensive IRS-compliant medical expense categories:
- **Qualified Expenses**: Doctor visits, prescriptions, dental care, vision care, hospital services
- **Non-Qualified Expenses**: Cosmetic procedures, gym memberships, over-the-counter medications

**Data Sources:**
- **`data/acceptedMCCs.json`**: Contains the approved Merchant Category Codes (MCCs) and their descriptions for IRS-compliant medical expenses
- **`data/sampleTransactions.json`**: Provides sample transaction data used for expense simulation, including various merchant types and MCC codes
- **`lib/medical-expenses.ts`**: Contains the validation logic that determines whether transactions qualify as medical expenses based on MCC codes

### Security Features
- Password hashing with bcryptjs
- Session-based authentication
- Input validation and sanitization
- Secure API endpoints

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:setup` - Initialize database
- `npm run reset-user <email>` - Reset user data

### Project Structure
```
hsa/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── database.ts        # Database connection
│   ├── medical-expenses.ts # Medical expense validation
│   └── types.ts           # TypeScript definitions
├── scripts/               # Setup and utility scripts
└── data/                  # Static data files
```

## License

This project is for educational and demonstration purposes only. 
