# PropFirm Copier Setup Guide

## 🚀 Quick Setup

### 1. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

### 2. Database Setup
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb propfirm_copier

# Create user (optional)
sudo -u postgres createuser --interactive

# Update DATABASE_URL in .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/propfirm_copier"
```

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:3000`
6. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Secret to `.env.local`

### 4. Trading API Setup

#### MetaAPI (Free for demo accounts)
1. Sign up at [MetaAPI](https://metaapi.cloud/)
2. Get free API token
3. Add to `.env.local`: `META_API_TOKEN="your-token"`

#### Alternative Free Forex Data
- **Alpha Vantage**: 5 calls/minute free
- **Fixer.io**: 100 calls/month free  
- **ExchangeRate-API**: 1500 calls/month free

### 5. Database Migration
```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate
```

### 6. Start Development
```bash
npm run dev
```

## 📋 Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/propfirm_copier"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Trading APIs
META_API_TOKEN="your-meta-api-token"
```

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:generate    # Generate migrations
npm run db:migrate     # Apply migrations
npm run db:studio      # Open Drizzle Studio

# Linting
npm run lint
```

## 🏗️ Project Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── accounts/      # Account management
│   │   ├── trades/        # Trade operations
│   │   └── risk-settings/ # Risk management
│   ├── auth/              # Authentication pages
│   └── page.tsx           # Main dashboard
├── components/            # React components
│   ├── dashboard.tsx      # Main dashboard
│   ├── trading-chart.tsx  # Chart component
│   ├── trade-journal.tsx  # Journal component
│   └── risk-settings.tsx  # Risk management UI
└── lib/                   # Core libraries
    ├── db/                # Database schema & connection
    ├── trading/           # Trading integrations
    └── risk/              # Risk management logic
```

## 🔐 Security Features

- **Encrypted API Credentials**: All trading API keys encrypted in database
- **Risk Setting Locks**: Prevent emotional trading decisions
- **Session Management**: Secure authentication with NextAuth
- **Rate Limiting**: Prevent API abuse
- **Audit Logging**: Track all trading activities

## 📊 Trading Platform Integrations

### Supported Platforms
- ✅ **MetaTrader 4/5** (via MetaAPI)
- ✅ **cTrader** (via cTrader Open API)
- 🔄 **Match Trader** (coming soon)
- 🔄 **TradeLocker** (coming soon)

### Propfirm Compatibility
- ✅ **FTMO** - Allows copy trading
- ✅ **5%ers** - Allows copy trading  
- ✅ **MyForexFunds** - Allows copy trading
- ❌ **The Funded Trader** - Restricted
- ❌ **FTUK** - Restricted

## 🚨 Important Notes

1. **Demo Accounts**: Most propfirm accounts are demo accounts, making API access free
2. **Latency**: Copy trading speed depends on API response times
3. **Risk Management**: Always test with small amounts first
4. **Compliance**: Check propfirm rules before enabling copy trading
5. **Backup**: Regular database backups recommended

## 📞 Support

- **Documentation**: Check README.md for detailed info
- **Issues**: Create GitHub issues for bugs
- **Features**: Submit feature requests via GitHub

## 🎯 Next Steps

1. Complete environment setup
2. Add your first propfirm account
3. Configure risk settings
4. Test copy trading with small amounts
5. Set up monitoring and alerts

Happy Trading! 🚀
