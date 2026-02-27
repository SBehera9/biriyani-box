// src/data/menuData.ts

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  category_id: number;
  category_name: string;
  available: number;
  image_url: string;
}

export interface Category {
  id: number;
  name: string;
}

// Categories
export const categories: Category[] = [
  { id: 1, name: "Chicken" },
  { id: 2, name: "Veg" },
  { id: 3, name: "Special Items" },
  { id: 4, name: "Add-ons" }
];

// Menu Items with custom images
export const menuItems: MenuItem[] = [
  // Chicken Category (id: 1)
  {
    id: 1,
    name: "Classic Chicken Dum Biriyani",
    price: 180,
    description: "Our signature slow-cooked chicken biriyani with aromatic spices.",
    category_id: 1,
    category_name: "Chicken",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Hyderabadi Chicken Biriyani",
    price: 200,
    description: "Spicier version with extra masala and long grain basmati rice.",
    category_id: 1,
    category_name: "Chicken",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Boneless Chicken Biriyani",
    price: 220,
    description: "Tender boneless chicken pieces layered with fragrant rice.",
    category_id: 1,
    category_name: "Chicken",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Chicken Tikka Biriyani",
    price: 240,
    description: "Smoky chicken tikka pieces cooked in biriyani style.",
    category_id: 1,
    category_name: "Chicken",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },

  // Veg Category (id: 2)
  {
    id: 5,
    name: "Paneer Dum Biriyani",
    price: 160,
    description: "Fresh paneer cubes marinated in spices and slow-cooked with rice.",
    category_id: 2,
    category_name: "Veg",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946603?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Mixed Veg Biriyani",
    price: 140,
    description: "Seasonal vegetables cooked with aromatic spices and basmati rice.",
    category_id: 2,
    category_name: "Veg",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Mushroom Biriyani",
    price: 170,
    description: "Juicy mushrooms layered with fragrant rice and spices.",
    category_id: 2,
    category_name: "Veg",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1604908176997-125f25e8139b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Soya Chaap Biriyani",
    price: 150,
    description: "Protein-rich soya chaap cooked in traditional dum style.",
    category_id: 2,
    category_name: "Veg",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },

  // Special Items (id: 3)
  {
    id: 9,
    name: "Egg Masala Biriyani",
    price: 150,
    description: "Two boiled eggs served with spicy masala and fragrant rice.",
    category_id: 3,
    category_name: "Special Items",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    name: "Chicken 65 (Dry)",
    price: 120,
    description: "Classic spicy deep-fried chicken appetizer.",
    category_id: 3,
    category_name: "Special Items",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 11,
    name: "Chicken Lollipop",
    price: 180,
    description: "Crispy fried chicken wings served with schezwan sauce.",
    category_id: 3,
    category_name: "Special Items",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12,
    name: "Mutton Keema Biriyani",
    price: 320,
    description: "Minced mutton cooked with spices and layered with rice.",
    category_id: 3,
    category_name: "Special Items",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1645112411342-4660a5811d8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },

  // Add-ons (id: 4)
  {
    id: 13,
    name: "Extra Raita",
    price: 20,
    description: "Cool yogurt with onions and cucumbers.",
    category_id: 4,
    category_name: "Add-ons",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 14,
    name: "Double Ka Meetha",
    price: 60,
    description: "Traditional bread pudding dessert with nuts.",
    category_id: 4,
    category_name: "Add-ons",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1621236378699-8597faf6a176?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 15,
    name: "Gulab Jamun (2pcs)",
    price: 40,
    description: "Soft milk solids balls dipped in sugar syrup.",
    category_id: 4,
    category_name: "Add-ons",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1589119908995-f68336d9a59e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 16,
    name: "Cold Drink (500ml)",
    price: 40,
    description: "Assorted chilled soft drinks.",
    category_id: 4,
    category_name: "Add-ons",
    available: 1,
    image_url: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];