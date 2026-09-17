"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type CheckoutContextValue = {
  selectedAddressId: string | null;
  setSelectedAddressId: (
    addressId: string
  ) => void;
};

const CheckoutContext =
  createContext<CheckoutContextValue | null>(
    null
  );

export function CheckoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState<string | null>(null);

  return (
    <CheckoutContext.Provider
      value={{
        selectedAddressId,
        setSelectedAddressId,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(
    CheckoutContext
  );

  if (!context) {
    throw new Error(
      "useCheckout must be used inside CheckoutProvider"
    );
  }

  return context;
}
