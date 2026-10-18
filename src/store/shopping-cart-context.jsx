import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

const CartContext = createContext({
  items: [],
  addItem: () => {},
  updateItemQuantity: () => {},
});

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const { payload: id } = action;
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === id,
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find((product) => product.id === id);
      updatedItems.push({
        id: id,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      ...state,
      items: updatedItems,
    };
  }
  if (action.type === "UPDATE_QUANTITY") {
    const { productId, amount } = action.payload;
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === productId,
    );
    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };
    updatedItem.quantity += amount;
    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }
    return {
      items: updatedItems,
    };
  }
}

export default function CartContextProvider({ children }) {
  const [shoppingCart, shoppingCartDispatch] = useReducer(cartReducer, {
    items: [],
  });

  function handleAddItemToCart(id) {
    shoppingCartDispatch({ type: "ADD_ITEM", payload: id });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, amount },
    });
  }

  const ctxValues = {
    items: shoppingCart.items,
    addItem: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  };
  return <CartContext value={ctxValues}>{children}</CartContext>;
}
export { CartContext };
