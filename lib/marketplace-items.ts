export interface MarketplaceItem {
  id: string
  name: string
  description: string
  cost: number // Karma Points
  category: string
  imageUrl: string
  stock?: number // Optional stock count
}

export const marketplaceItems: MarketplaceItem[] = [
  {
    id: "MP-001",
    name: "Movie Ticket",
    description: "Redeem for one standard movie ticket at participating theaters",
    cost: 250,
    category: "Entertainment",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop",
    stock: 50,
  },
  {
    id: "MP-002",
    name: "Food Coupon",
    description: "Get 20% off at select restaurants and cafes in your area",
    cost: 180,
    category: "Food",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    stock: 100,
  },
  {
    id: "MP-003",
    name: "Clothing Discount",
    description: "Enjoy 30% off on clothing and accessories at partner stores",
    cost: 320,
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
    stock: 75,
  },
  {
    id: "MP-004",
    name: "Book Voucher",
    description: "Redeem for books worth up to $25 at participating bookstores",
    cost: 200,
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
    stock: 60,
  },
  {
    id: "MP-005",
    name: "Gift Card",
    description: "Multi-purpose gift card redeemable at various retail partners",
    cost: 400,
    category: "General",
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    stock: 30,
  },
  {
    id: "MP-006",
    name: "Coffee Coupon",
    description: "Free coffee or beverage at partner coffee shops (up to $6 value)",
    cost: 150,
    category: "Food",
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    stock: 120,
  },
  {
    id: "MP-007",
    name: "Sports Pass",
    description: "Access to local sports events and gym facilities for one month",
    cost: 500,
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    stock: 40,
  },
  {
    id: "MP-008",
    name: "Event Ticket",
    description: "General admission ticket to community events and concerts",
    cost: 280,
    category: "Entertainment",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
    stock: 80,
  },
]
