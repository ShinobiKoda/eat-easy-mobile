export type Nutrient = {
  amount: string;
  unit: string;
}

export type Ingredient = {
  ingname: string;
  ingimage: string;
}

export type Topping = {
  id: number;
  name: string;
  price: number;
}

export type FoodTag =
  | "Most Popular"
  | "Salad"
  | "Pizza"
  | "Pasta"
  | "Dessert"
  | "Burger"
  | "Soup"
  | "Soda"
  | "Energy"
  | "Milk Drinks"
  | "Grill"
  | "Vegan"
  | "Chicken"
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Classic"
  | "Italian"
  | "Creamy"
  | "Seafood"
  | "British"
  | "Indian"
  | "Spicy"
  | "Mexican"
  | "Mediterranean"
  | "Premium"
  | "Sweet"
  | "BBQ"
  | "Smoothie"
  | "Healthy"
  | "Refreshing"
  | "Coffee"
  | "Cold"
  | "Tea"
  | "Detox"
  | "Hot"
  | "Tropical"
  | "Relaxing"
  | "Strong"
  | "Juice"
  | "Simple"
  | "Natural"
  | "Antioxidant"
  | "Chocolate"
  | "Cake"
  | "French"
  | "Pie"
  | "Cheesecake"
  | "Ice Cream"
  | "Protein"
  | "Comfort"
  | "Comfort Food"
  | "Light"
  | "Steak"
  | "Sandwich"
  | "Quick"
  | "Eggs"
  | "Asian"
  | "Rice";

export type PropType = {
  id: number;
  image: string;
  name: string;
  rating: number;
  reviews: number;
  price: number;
  text?: string;
  nutrients: Nutrient[];
  ingredients: Ingredient[];
  toppings: Topping[];
  tag?: FoodTag[];
};

export type Restaurant = {
  id: string;
  name: string;
  // add other fields as needed
};
