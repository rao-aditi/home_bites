import pizzaImg from "../assets/categories/pizza.png";
import burgerImg from "../assets/categories/burger.png";
import biryaniImg from "../assets/categories/biryani.png";
// import sushiImg from "../assets/categories/sushi.png";
import dessertImg from "../assets/categories/dessert.png";
import chineseImg from "../assets/categories/chinese.png";
import southImg from "../assets/categories/south-indian.png";
import saladImg from "../assets/categories/salad.png";
import coffeeImg from "../assets/categories/coffee.png";
import shakesImg from "../assets/categories/shakes.png";
import tacosImg from "../assets/categories/tacos.png";
import pastaImg from "../assets/categories/pasta.png";

export const categories = [
  { id: "pizza", name: "Pizza", image: pizzaImg },
  { id: "burger", name: "Burger", image: burgerImg },
  { id: "biryani", name: "Biryani", image: biryaniImg },
  // { id: "sushi", name: "Sushi", image: sushiImg },
  { id: "dessert", name: "Dessert", image: dessertImg },
  { id: "chinese", name: "Chinese", image: chineseImg },
  { id: "south", name: "South Indian", image: southImg },
  { id: "salad", name: "Salad", image: saladImg },
  { id: "coffee", name: "Coffee", image: coffeeImg },
  { id: "shakes", name: "Shakes", image: shakesImg },
  { id: "tacos", name: "Tacos", image: tacosImg },
  { id: "pasta", name: "Pasta", image: pastaImg },
];

const img = (q, i = 1) =>
  `https://images.unsplash.com/photo-${q}?auto=format&fit=crop&w=800&q=80&sig=${i}`;

// Curated Unsplash food photo IDs
const R = [
  "1552566626-52f8b828add9",
  "1517248135467-4c7edcad34c4",
  "1414235077428-338989a2e8c0",
  "1555396273-367ea4eb4db5",
  "1466978913421-dad2ebd01d17",
  "1559339352-11d035aa65de",
  "1592861956120-e524fc739696",
  "1600891964092-4316c288032e",
  "1481931098730-318b6f776db0",
  "1543353071-10c8ba85a904",
];

const F = [
  "1565299624946-b28f40a0ae38", // pizza
  "1568901346375-23c9450c58cd", // burger
  "1563379091339-03b21ab4a4f8", // biryani
  "1579584425555-c3ce17fd4351", // sushi
  "1551024506-0bccd828d307", // dessert
  "1585032226651-759b368d7246", // chinese
  "1630383249896-4b3f9b3bfe1b", // dosa
  "1512621776951-a57141f2eefd", // salad
  "1509042239860-f550ce710b93", // coffee
  "1553787499-6f9133860278", // shake
  "1565299585323-38d6b0865b47", // tacos
  "1621996346565-e3dbc353d2e5", // pasta
];

const cuisines = [
  "Italian",
  "Indian",
  "Chinese",
  "Japanese",
  "Mexican",
  "American",
  "Thai",
  "Continental",
];

export const restaurants = Array.from({ length: 18 }).map((_, i) => ({
  id: `r${i + 1}`,
  name: [
    "Tandoor Junction",
    "Pizza Palace",
    "Sushi Sensei",
    "Burger Barn",
    "Dragon Wok",
    "Biryani House",
    "The Green Bowl",
    "Taco Fiesta",
    "Pasta Paradise",
    "Curry Kingdom",
    "Sweet Cravings",
    "Cafe Mocha",
    "Grill Master",
    "Noodle Nation",
    "Spice Route",
    "Urban Tadka",
    "Coastal Kitchen",
    "The Waffle Co.",
  ][i],
  image: img(R[i % R.length], i),
  banner: img(R[(i + 3) % R.length], i + 100),
  rating: +(3.8 + Math.random() * 1.1).toFixed(1),
  reviews: 500 + Math.floor(Math.random() * 4500),
  deliveryTime: 20 + Math.floor(Math.random() * 30),
  distance: +(0.5 + Math.random() * 5).toFixed(1),
  priceForTwo: 200 + Math.floor(Math.random() * 800),
  cuisines: [cuisines[i % cuisines.length], cuisines[(i + 2) % cuisines.length]],
  discount: i % 3 === 0 ? "50% OFF up to $10" : i % 3 === 1 ? "20% OFF" : undefined,
  isVeg: i % 4 === 0,
  isBestseller: i % 5 === 0,
  isOpen: i % 7 !== 0,
  address: `${100 + i} Foodie Lane, Downtown District`,
  offers: ["Free delivery over $20", "Flat 15% off with UPI", "Buy 1 Get 1 on desserts"],
}));

const foodNames = [
  "Margherita Pizza",
  "Pepperoni Supreme",
  "Chicken Burger",
  "Veg Whopper",
  "Chicken Biryani",
  "Paneer Tikka",
  "Salmon Nigiri",
  "California Roll",
  "Chocolate Brownie",
  "Tiramisu",
  "Kung Pao Chicken",
  "Veg Manchurian",
  "Masala Dosa",
  "Idli Sambar",
  "Caesar Salad",
  "Cold Brew",
  "Strawberry Shake",
  "Beef Taco",
  "Alfredo Pasta",
  "Butter Chicken",
];

export const foods = [];
restaurants.forEach((r, ri) => {
  for (let j = 0; j < 6; j++) {
    const idx = (ri * 6 + j) % foodNames.length;
    foods.push({
      id: `f${r.id}-${j}`,
      restaurantId: r.id,
      name: foodNames[idx],
      description:
        "Chef's signature preparation with premium ingredients, fresh herbs and slow-cooked flavors.",
      price: 5 + Math.floor(Math.random() * 20),
      originalPrice: Math.random() > 0.5 ? 15 + Math.floor(Math.random() * 15) : undefined,
      image: img(F[idx % F.length], ri * 10 + j),
      rating: +(3.9 + Math.random() * 1.0).toFixed(1),
      isVeg: idx % 2 === 0,
      isBestseller: j < 2,
      category: j < 2 ? "Bestsellers" : j < 4 ? "Recommended" : "Main Course",
    });
  }
});

export const offers = [
  {
    id: "o1",
    code: "WELCOME50",
    title: "50% OFF up to $10",
    subtitle: "On your first order",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "o2",
    code: "FREEDEL",
    title: "Free Delivery",
    subtitle: "Orders above $20",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "o3",
    code: "WEEKEND25",
    title: "25% OFF",
    subtitle: "Weekend special",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "o4",
    code: "SUPER40",
    title: "40% OFF",
    subtitle: "Selected restaurants",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "o5",
    code: "COMBO15",
    title: "$15 OFF",
    subtitle: "On combo meals",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "o6",
    code: "LUNCH30",
    title: "30% OFF Lunch",
    subtitle: "12PM - 3PM",
    color: "from-sky-500 to-blue-500",
  },
];

export const notifications = [
  {
    id: "n1",
    type: "order",
    title: "Order delivered!",
    message: "Your order from Tandoor Junction has been delivered.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "n2",
    type: "offer",
    title: "Flat 50% OFF",
    message: "Use code WELCOME50 on your next order.",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: "n3",
    type: "order",
    title: "Out for delivery",
    message: "Your food is on its way!",
    time: "3 hrs ago",
    unread: false,
  },
  {
    id: "n4",
    type: "promo",
    title: "Weekend Feast 🎉",
    message: "Explore top restaurants near you with special deals.",
    time: "1 day ago",
    unread: false,
  },
];

export const testimonials = [
  {
    id: "t1",
    name: "Sarah Chen",
    role: "Regular customer",
    avatar: "https://i.pravatar.cc/120?img=1",
    text: "Fastest delivery in the city. My food arrives hot every single time.",
  },
  {
    id: "t2",
    name: "Marcus Ong",
    role: "Food blogger",
    avatar: "https://i.pravatar.cc/120?img=12",
    text: "Best UX among food apps. Discovering new restaurants is genuinely fun.",
  },
  {
    id: "t3",
    name: "Priya Nair",
    role: "Home chef",
    avatar: "https://i.pravatar.cc/120?img=32",
    text: "Love the curated collections. The dessert selection is unbeatable.",
  },
];

export const faqs = [
  {
    q: "How long does delivery take?",
    a: "Most orders arrive in 25-40 minutes depending on your location and the restaurant.",
  },
  {
    q: "Can I schedule an order in advance?",
    a: "Yes, you can schedule orders up to 3 days ahead from the cart page.",
  },
  {
    q: "What payment methods are supported?",
    a: "UPI, credit/debit cards, net banking, wallets, and cash on delivery.",
  },
  {
    q: "Can I cancel my order?",
    a: "Orders can be cancelled within 60 seconds of placing. After that contact support.",
  },
  {
    q: "Is there a minimum order value?",
    a: "Minimum order varies by restaurant, typically between $5 and $10.",
  },
];
