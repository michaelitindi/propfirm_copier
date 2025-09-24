# PropFirm Copier

A professional copy trading platform for forex propfirm accounts with advanced risk management and journaling tools.

## Features

- **Copy Trading**: Master/slave account architecture for seamless trade copying
- **Risk Management**: Configurable risk limits with emotional trading prevention
- **Trade Journaling**: Automatic screenshots, notes, and performance analytics
- **Multi-Platform Support**: MetaTrader 4/5, cTrader, Match Trader, TradeLocker
- **Real-time Charts**: Live forex data with integrated trading interface
- **Propfirm Compliance**: Built-in whitelist system for compliant brokers

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL, Drizzle ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Trading APIs**: MetaAPI, cTrader API, custom integrations
- **Charts**: Lightweight Charts by TradingView
- **Payments**: Lemon Squeezy

## Quick Start

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd propfirm_copier
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Set up database**:
   ```bash
   # Create PostgreSQL database
   createdb propfirm_copier
   
   # Generate and run migrations
   npm run db:generate
   npm run db:migrate
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Configuration

### Database Setup

1. Install PostgreSQL
2. Create a database: `createdb propfirm_copier`
3. Update `DATABASE_URL` in `.env.local`

### Authentication Setup

1. Create a Google OAuth application
2. Add your domain to authorized origins
3. Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### Trading API Setup

#### MetaAPI (MetaTrader)
1. Sign up at [MetaAPI](https://metaapi.cloud/)
2. Get your API token
3. Update `META_API_TOKEN` in environment

#### cTrader API
1. Register at cTrader Open API
2. Create application and get credentials
3. Configure in trading integrations

### Forex Data

The app uses free forex data sources. Configure your preferred provider:
- Alpha Vantage (free tier available)
- Fixer.io
- ExchangeRate-API

## Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   └── page.tsx        # Main dashboard
├── components/         # React components
│   ├── dashboard.tsx   # Main dashboard
│   ├── trading-chart.tsx
│   ├── trade-journal.tsx
│   └── risk-settings.tsx
├── lib/
│   ├── db/             # Database schema and connection
│   ├── trading/        # Trading engine and API integrations
│   └── risk/           # Risk management system
```

## Key Components

### Copy Trading Engine
- Monitors master account for new trades
- Calculates appropriate lot sizes for slave accounts
- Executes trades with minimal latency
- Handles different account balances proportionally

### Risk Management
- Configurable risk limits per trade and daily
- Emotional trading prevention (locked settings)
- Emergency contact system for setting changes
- Real-time validation before trade execution

### Trade Journaling
- Automatic screenshot capture
- Trade notes and analysis
- Performance metrics and win rates
- Pattern recognition tools

## API Integrations

### Supported Platforms
- **MetaTrader 4/5**: Via MetaAPI
- **cTrader**: Via cTrader Open API
- **Match Trader**: Custom integration
- **TradeLocker**: Custom integration

### Propfirm Compliance
The app includes a whitelist system to ensure compliance with propfirm rules:
- FTMO: ✅ Allows copy trading
- 5%ers: ✅ Allows copy trading
- The Funded Trader: ❌ Restricted
- (Configurable via admin panel)

## Development

### Database Operations
```bash
# Generate new migration
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio
npm run db:studio
```

### Adding New Trading Platforms
1. Create integration in `src/lib/trading/`
2. Implement standard interface methods
3. Add to copy trading engine
4. Update UI components

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### Docker
```bash
# Build image
docker build -t propfirm-copier .

# Run container
docker run -p 3000:3000 propfirm-copier
```

## Security Considerations

- API credentials are encrypted in database
- Risk settings can be locked to prevent emotional changes
- Rate limiting on trading endpoints
- Audit logging for all trades
- Secure session management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and feature requests, please contact [support@propfirmcopier.com](mailto:support@propfirmcopier.com).