import { createContext } from "react";

const CartContext = createContext({
  items: [],
  addItem: () => {},
  updateItemQuantity: () => {},
});

export default CartContext;
