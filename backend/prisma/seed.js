// Deterministic seed — no Math.random() anywhere. Ports the content of the old
// frontend mockData.js (categories/foods/offers/notifications) into the
// single-restaurant schema: the 18-restaurant structure collapses into one
// Business row, and foods are deduplicated into a representative menu grouped
// under real Category rows instead of restaurant-repeated free-text categories.
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function unsplash(id) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;
}

const CATEGORY_DEFS = [
  { key: "pizza", name: "Pizza", image: unsplash("1565299624946-b28f40a0ae38"), sortOrder: 0 },
  { key: "burger", name: "Burger", image: unsplash("1568901346375-23c9450c58cd"), sortOrder: 1 },
  { key: "biryani", name: "Biryani", image: unsplash("1563379091339-03b21ab4a4f8"), sortOrder: 2 },
  { key: "dessert", name: "Dessert", image: unsplash("1551024506-0bccd828d307"), sortOrder: 3 },
  { key: "chinese", name: "Chinese", image: unsplash("1585032226651-759b368d7246"), sortOrder: 4 },
  { key: "south", name: "South Indian", image: unsplash("1630383249896-4b3f9b3bfe1b"), sortOrder: 5 },
  { key: "salad", name: "Salad", image: unsplash("1512621776951-a57141f2eefd"), sortOrder: 6 },
  { key: "coffee", name: "Coffee", image: unsplash("1509042239860-f550ce710b93"), sortOrder: 7 },
  { key: "shakes", name: "Shakes", image: unsplash("1553787499-6f9133860278"), sortOrder: 8 },
  { key: "tacos", name: "Tacos", image: unsplash("1565299585323-38d6b0865b47"), sortOrder: 9 },
  { key: "pasta", name: "Pasta", image: unsplash("1621996346565-e3dbc353d2e5"), sortOrder: 10 },
];

const FOOD_DEFS = [
  // Pizza
  { category: "pizza", name: "Margherita Pizza", description: "Classic tomato, mozzarella and fresh basil on a wood-fired crust.", price: 9.99, originalPrice: 12.99, rating: 4.6, isVeg: true, isBestseller: true, image: "1565299624946-b28f40a0ae38" },
  { category: "pizza", name: "Pepperoni Supreme", description: "Loaded with double pepperoni and a blend of melted cheeses.", price: 12.49, originalPrice: 15.99, rating: 4.7, isVeg: false, isBestseller: true, image: "1517248135467-4c7edcad34c4" },
  { category: "pizza", name: "Farmhouse Pizza", description: "Bell peppers, onions, mushroom and sweet corn on a cheesy base.", price: 10.99, rating: 4.4, isVeg: true, isBestseller: false, image: "1414235077428-338989a2e8c0" },
  // Burger
  { category: "burger", name: "Chicken Burger", description: "Grilled chicken patty with lettuce, tomato and house sauce.", price: 6.99, originalPrice: 8.99, rating: 4.5, isVeg: false, isBestseller: true, image: "1568901346375-23c9450c58cd" },
  { category: "burger", name: "Veg Whopper", description: "Crispy vegetable patty stacked with fresh greens and mayo.", price: 5.99, rating: 4.3, isVeg: true, isBestseller: false, image: "1555396273-367ea4eb4db5" },
  { category: "burger", name: "Classic Cheeseburger", description: "Beef patty, melted cheddar, pickles and ketchup on a soft bun.", price: 6.49, originalPrice: 7.99, rating: 4.4, isVeg: false, isBestseller: false, image: "1466978913421-dad2ebd01d17" },
  // Biryani
  { category: "biryani", name: "Chicken Biryani", description: "Fragrant basmati rice slow-cooked with spiced chicken.", price: 8.49, originalPrice: 10.99, rating: 4.8, isVeg: false, isBestseller: true, image: "1563379091339-03b21ab4a4f8" },
  { category: "biryani", name: "Veg Biryani", description: "Basmati rice layered with mixed vegetables and aromatic spices.", price: 6.99, rating: 4.3, isVeg: true, isBestseller: false, image: "1559339352-11d035aa65de" },
  { category: "biryani", name: "Butter Chicken", description: "Tender chicken simmered in a rich tomato-butter gravy.", price: 9.49, originalPrice: 11.99, rating: 4.7, isVeg: false, isBestseller: true, image: "1592861956120-e524fc739696" },
  { category: "biryani", name: "Paneer Tikka", description: "Chargrilled cottage cheese marinated in smoky tandoori spices.", price: 7.49, rating: 4.5, isVeg: true, isBestseller: false, image: "1600891964092-4316c288032e" },
  // Dessert
  { category: "dessert", name: "Chocolate Brownie", description: "Warm fudgy brownie with a molten chocolate center.", price: 4.49, rating: 4.6, isVeg: true, isBestseller: true, image: "1551024506-0bccd828d307" },
  { category: "dessert", name: "Tiramisu", description: "Layers of coffee-soaked sponge and mascarpone cream.", price: 5.99, originalPrice: 6.99, rating: 4.5, isVeg: true, isBestseller: false, image: "1481931098730-318b6f776db0" },
  { category: "dessert", name: "Gulab Jamun", description: "Soft milk dumplings soaked in rose-cardamom syrup.", price: 3.99, rating: 4.4, isVeg: true, isBestseller: false, image: "1543353071-10c8ba85a904" },
  // Chinese
  { category: "chinese", name: "Kung Pao Chicken", description: "Wok-tossed chicken with peanuts, chilies and scallions.", price: 8.99, originalPrice: 10.49, rating: 4.5, isVeg: false, isBestseller: false, image: "1585032226651-759b368d7246" },
  { category: "chinese", name: "Veg Manchurian", description: "Crispy vegetable balls tossed in a tangy garlic-soy sauce.", price: 6.99, rating: 4.3, isVeg: true, isBestseller: false, image: "1552566626-52f8b828add9" },
  { category: "chinese", name: "Hakka Noodles", description: "Stir-fried noodles with crunchy vegetables and soy seasoning.", price: 6.49, rating: 4.4, isVeg: true, isBestseller: true, image: "1585032226651-759b368d7246" },
  // South Indian
  { category: "south", name: "Masala Dosa", description: "Crisp rice crepe filled with spiced potato masala.", price: 5.49, rating: 4.6, isVeg: true, isBestseller: true, image: "1630383249896-4b3f9b3bfe1b" },
  { category: "south", name: "Idli Sambar", description: "Steamed rice cakes served with lentil sambar and chutney.", price: 4.49, rating: 4.5, isVeg: true, isBestseller: false, image: "1630383249896-4b3f9b3bfe1b" },
  { category: "south", name: "Uttapam", description: "Thick savory pancake topped with onions and tomatoes.", price: 4.99, rating: 4.3, isVeg: true, isBestseller: false, image: "1630383249896-4b3f9b3bfe1b" },
  // Salad
  { category: "salad", name: "Caesar Salad", description: "Crisp romaine, parmesan and croutons in a classic caesar dressing.", price: 6.49, rating: 4.2, isVeg: false, isBestseller: false, image: "1512621776951-a57141f2eefd" },
  { category: "salad", name: "Greek Salad", description: "Cucumber, olives, feta and tomato tossed in olive oil and herbs.", price: 5.99, rating: 4.4, isVeg: true, isBestseller: false, image: "1512621776951-a57141f2eefd" },
  // Coffee
  { category: "coffee", name: "Cold Brew", description: "Slow-steeped, smooth and naturally sweet cold coffee.", price: 3.49, rating: 4.5, isVeg: true, isBestseller: false, image: "1509042239860-f550ce710b93" },
  { category: "coffee", name: "Cappuccino", description: "Espresso topped with steamed milk foam.", price: 3.99, rating: 4.6, isVeg: true, isBestseller: true, image: "1509042239860-f550ce710b93" },
  { category: "coffee", name: "Latte", description: "Smooth espresso with steamed milk and a light foam layer.", price: 3.79, rating: 4.4, isVeg: true, isBestseller: false, image: "1509042239860-f550ce710b93" },
  // Shakes
  { category: "shakes", name: "Strawberry Shake", description: "Creamy shake blended with real strawberries.", price: 4.99, rating: 4.5, isVeg: true, isBestseller: false, image: "1553787499-6f9133860278" },
  { category: "shakes", name: "Chocolate Shake", description: "Rich chocolate shake topped with whipped cream.", price: 4.99, rating: 4.6, isVeg: true, isBestseller: true, image: "1553787499-6f9133860278" },
  { category: "shakes", name: "Oreo Shake", description: "Cookies-and-cream shake loaded with crushed Oreo.", price: 5.49, rating: 4.5, isVeg: true, isBestseller: false, image: "1553787499-6f9133860278", isAvailable: false },
  // Tacos
  { category: "tacos", name: "Beef Taco", description: "Seasoned beef, fresh salsa and cheese in a crisp taco shell.", price: 4.49, rating: 4.3, isVeg: false, isBestseller: false, image: "1565299585323-38d6b0865b47" },
  { category: "tacos", name: "Veg Taco", description: "Grilled vegetables and beans with salsa in a soft taco shell.", price: 3.99, rating: 4.2, isVeg: true, isBestseller: false, image: "1565299585323-38d6b0865b47" },
  { category: "tacos", name: "Chicken Taco", description: "Spiced grilled chicken with pico de gallo and lime crema.", price: 4.29, rating: 4.4, isVeg: false, isBestseller: false, image: "1565299585323-38d6b0865b47" },
  // Pasta
  { category: "pasta", name: "Alfredo Pasta", description: "Fettuccine tossed in a creamy parmesan alfredo sauce.", price: 8.99, originalPrice: 10.99, rating: 4.5, isVeg: true, isBestseller: true, image: "1621996346565-e3dbc353d2e5" },
  { category: "pasta", name: "Arrabiata Pasta", description: "Penne in a spicy tomato and garlic sauce.", price: 7.99, rating: 4.4, isVeg: true, isBestseller: false, image: "1621996346565-e3dbc353d2e5" },
];

const OFFER_DEFS = [
  { code: "WELCOME50", title: "50% OFF up to $10", subtitle: "On your first order", color: "from-orange-500 to-red-500", discountType: "percent", value: 50 },
  { code: "FREEDEL", title: "Free Delivery", subtitle: "Orders above $20", color: "from-pink-500 to-rose-500", discountType: "free_delivery", value: 0 },
  { code: "WEEKEND25", title: "25% OFF", subtitle: "Weekend special", color: "from-purple-500 to-indigo-500", discountType: "percent", value: 25 },
  { code: "SUPER40", title: "40% OFF", subtitle: "Selected items", color: "from-amber-500 to-orange-500", discountType: "percent", value: 40 },
  { code: "COMBO15", title: "$15 OFF", subtitle: "On combo meals", color: "from-emerald-500 to-teal-500", discountType: "flat", value: 15 },
  { code: "LUNCH30", title: "30% OFF Lunch", subtitle: "12PM - 3PM", color: "from-sky-500 to-blue-500", discountType: "percent", value: 30 },
];

// Relative-time notifications for the demo user (minutes ago), mirroring the old
// mock "2 min ago" / "1 hr ago" copy but rewritten for a single restaurant
// (no more "delivered from Tandoor Junction").
const NOTIFICATION_DEFS = [
  { type: "order", title: "Order delivered!", message: "Your order has been delivered. Enjoy your meal!", unread: true, minutesAgo: 2 },
  { type: "offer", title: "Flat 50% OFF", message: "Use code WELCOME50 on your next order.", unread: true, minutesAgo: 60 },
  { type: "order", title: "Out for delivery", message: "Your food is on its way!", unread: false, minutesAgo: 180 },
  { type: "promo", title: "Weekend Feast", message: "Check out this weekend's special deals and combos.", unread: false, minutesAgo: 1440 },
];

async function main() {
  console.log("Seeding database...");

  await prisma.notification.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.address.deleteMany();
  await prisma.food.deleteMany();
  await prisma.category.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  await prisma.business.create({
    data: {
      name: "HomeBites",
      tagline: "Home-style meals, delivered fast",
      description:
        "HomeBites is a single-kitchen home-food delivery service serving fresh, chef-prepared meals across town — from comfort classics to weekend indulgences.",
      logo: unsplash("1414235077428-338989a2e8c0"),
      banner: unsplash("1517248135467-4c7edcad34c4"),
      phone: "+1 (555) 123-4567",
      address: "42 Foodie Lane, Downtown District",
      openingHours: "9:00 AM - 11:00 PM, daily",
      rating: 4.6,
      reviewsCount: 2450,
      avgDeliveryTime: 32,
      minOrderValue: 5,
      deliveryFee: 2.99,
      isOpen: true,
    },
  });

  const categoryIdByKey = {};
  for (const def of CATEGORY_DEFS) {
    const category = await prisma.category.create({
      data: { name: def.name, image: def.image, sortOrder: def.sortOrder },
    });
    categoryIdByKey[def.key] = category.id;
  }

  for (const food of FOOD_DEFS) {
    await prisma.food.create({
      data: {
        name: food.name,
        description: food.description,
        price: food.price,
        originalPrice: food.originalPrice ?? null,
        image: unsplash(food.image),
        categoryId: categoryIdByKey[food.category],
        rating: food.rating,
        isVeg: food.isVeg,
        isBestseller: food.isBestseller,
        isAvailable: food.isAvailable ?? true,
      },
    });
  }

  for (const offer of OFFER_DEFS) {
    await prisma.offer.create({ data: offer });
  }

  const passwordHash = await bcrypt.hash("password123", 10);
  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@homebites.app",
      passwordHash,
      phone: "+1 (555) 987-6543",
    },
  });

  await prisma.address.create({
    data: {
      userId: demoUser.id,
      label: "Home",
      line1: "12 Maple Street, Apt 4B",
      city: "Springfield",
      phone: "+1 (555) 987-6543",
      isDefault: true,
    },
  });

  const now = Date.now();
  for (const n of NOTIFICATION_DEFS) {
    await prisma.notification.create({
      data: {
        userId: demoUser.id,
        type: n.type,
        title: n.title,
        message: n.message,
        unread: n.unread,
        createdAt: new Date(now - n.minutesAgo * 60 * 1000),
      },
    });
  }

  console.log(`Seeded ${CATEGORY_DEFS.length} categories, ${FOOD_DEFS.length} foods, ${OFFER_DEFS.length} offers.`);
  console.log(`Demo login -> email: demo@homebites.app, password: password123`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
