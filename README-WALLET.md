# MetaMask Wallet Integration

This project includes a complete MetaMask wallet integration with React context, hooks, and UI components.

## Features

- ✅ MetaMask detection and connection
- ✅ Account and balance display
- ✅ Network detection and switching
- ✅ Persistent connection state
- ✅ Error handling and user feedback
- ✅ Mobile responsive design
- ✅ TypeScript support

## Usage

### Basic Wallet Connection

The wallet connection is handled automatically through the `WalletProvider` in the app layout. Users can connect their wallet using the "Connect Wallet" button in the navbar.

### Using the Wallet Context

```tsx
import { useWallet } from "@/contexts/wallet-context"

function MyComponent() {
  const { 
    isConnected, 
    address, 
    balance, 
    chainId, 
    connect, 
    disconnect 
  } = useWallet()

  return (
    <div>
      {isConnected ? (
        <p>Connected: {address}</p>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  )
}
```

### Using the Enhanced Hook

```tsx
import { useWalletIntegration } from "@/hooks/use-wallet-integration"

function MyComponent() {
  const { 
    isConnected,
    address,
    formatAddress,
    formatBalance,
    getNetworkName,
    isMainnet,
    connectWithErrorHandling
  } = useWalletIntegration()

  const handleConnect = async () => {
    const { success, error } = await connectWithErrorHandling()
    if (!success) {
      console.error("Connection failed:", error)
    }
  }

  return (
    <div>
      {isConnected && address && (
        <div>
          <p>Address: {formatAddress(address)}</p>
          <p>Network: {getNetworkName(chainId!)}</p>
          <p>Mainnet: {isMainnet ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  )
}
```

## Components

### WalletStatus Component

Shows detailed wallet information when connected:

```tsx
import WalletStatus from "@/components/wallet-status"

function MyPage() {
  return (
    <div>
      <WalletStatus />
    </div>
  )
}
```

## Supported Networks

- Ethereum Mainnet (Chain ID: 1)
- Goerli Testnet (Chain ID: 5)
- Sepolia Testnet (Chain ID: 11155111)
- Polygon Mainnet (Chain ID: 137)
- Polygon Mumbai (Chain ID: 80001)
- BSC Mainnet (Chain ID: 56)
- BSC Testnet (Chain ID: 97)

## Error Handling

The wallet integration includes comprehensive error handling:

- MetaMask not installed
- User rejection of connection
- Network switching failures
- Account changes
- Connection timeouts

## Security Considerations

- Never store private keys or sensitive data
- Always validate transactions on the frontend
- Use HTTPS in production
- Implement proper CORS policies
- Validate all user inputs

## Dependencies

- `ethers`: Ethereum library for blockchain interactions
- `@metamask/detect-provider`: MetaMask provider detection
- `next`: Next.js framework
- `react`: React library

## Browser Support

- Chrome/Chromium with MetaMask extension
- Firefox with MetaMask extension
- Edge with MetaMask extension
- Brave browser with built-in wallet
- Mobile browsers with MetaMask mobile app
