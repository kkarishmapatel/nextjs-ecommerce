import { CheckoutProvider } from "@/components/checkout/CheckoutProvider";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CheckoutProvider>
      {children}
    </CheckoutProvider>
  );
}