# Karma to ETH Conversion Setup Guide

## ✅ What's Been Implemented

1. **Backend API Route** (`app/api/karma/claim/route.ts`)
   - Handles ETH transfers from treasury wallet
   - Sends ETH on Arbitrum Sepolia testnet
   - Returns transaction hash

2. **Updated Frontend**
   - Calls API when user clicks "Claim ETH"
   - Shows transaction hash and explorer link
   - Better error handling

---

## 🔧 Setup Instructions

### Step 1: Get Your Treasury Wallet Private Key

You need the private key for wallet: `0xb6ad1ad1637ad0f5c8dd7be68876f508e7e368f9`

**⚠️ SECURITY WARNING**: Never share or commit your private key!

### Step 2: Add Environment Variable Locally

Create or update `.env.local` file in your project root:

```env
TREASURY_PRIVATE_KEY=your_private_key_here_without_0x_prefix

# Your existing Supabase vars
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: 
- Don't include `0x` prefix in the private key
- The `.env.local` file is already in `.gitignore` (won't be committed)

### Step 3: Add Environment Variable to Vercel (for Production)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Name**: `TREASURY_PRIVATE_KEY`
   - **Value**: Your private key (without 0x)
   - **Environment**: Production, Preview, Development (check all)

### Step 4: Test the Setup

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Go to** `/karma` page
3. **Connect your wallet**
4. **Enter karma amount** (e.g., 1000)
5. **Click "Claim ETH on Arbitrum Sepolia"**
6. **You should see**:
   - Processing message
   - Success message with transaction hash
   - Link to view transaction on Arbitrum Sepolia Explorer

---

## 🔍 How It Works Now

1. **User clicks "Claim ETH"**
   - Frontend switches MetaMask to Arbitrum Sepolia
   - Calls `/api/karma/claim` API endpoint

2. **Backend API**:
   - Uses treasury private key to create wallet
   - Connects to Arbitrum Sepolia RPC
   - Checks treasury balance
   - Sends ETH from treasury to user's address
   - Returns transaction hash

3. **Frontend displays**:
   - Success message with transaction hash
   - Link to view transaction on explorer

---

## 🐛 Troubleshooting

### Error: "Treasury private key not configured"
- **Solution**: Add `TREASURY_PRIVATE_KEY` to your `.env.local` file

### Error: "Insufficient funds in treasury"
- **Solution**: Add ETH to your treasury wallet on Arbitrum Sepolia
- Get testnet ETH from: https://faucet.quicknode.com/arbitrum/sepolia

### Error: "Failed to send ETH from treasury"
- Check your private key is correct
- Make sure treasury wallet has ETH on Arbitrum Sepolia
- Check network connectivity

### Transaction not showing in wallet
- Wait a few seconds for transaction to be mined
- Check the transaction hash on Arbitrum Sepolia Explorer
- The ETH will appear in your wallet automatically once confirmed

---

## 📝 Important Notes

1. **Security**: The private key is stored server-side (in environment variables)
2. **Testnet Only**: This is on Arbitrum Sepolia testnet
3. **Gas Fees**: Treasury wallet pays for gas
4. **No User Signature**: Users don't need to sign anything - ETH is sent directly

---

## ✅ After Setup

Once you've added the `TREASURY_PRIVATE_KEY` environment variable:
- Transactions will execute automatically
- ETH will be sent from treasury wallet to user's wallet
- Transaction hash will be displayed
- Users can view transactions on Arbitrum Sepolia Explorer

**The system is ready to use!** 🚀
