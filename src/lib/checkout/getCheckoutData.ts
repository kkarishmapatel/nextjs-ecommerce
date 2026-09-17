import { getCurrentCustomer } from "@/lib/customers/getCurrentCustomer";
import { getCurrentCart } from "@/lib/cart/getCurrentCart";

export async function getCheckoutData() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    return null;
  }

  const cart = await getCurrentCart();

  if (!cart || cart.items.length === 0) {
    return {
      customer,
      cart: null,
      addresses: customer.addresses,
    };
  }

  return {
    customer,
    cart,
    addresses: customer.addresses,
  };
}