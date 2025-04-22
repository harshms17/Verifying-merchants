import SignIn from "@/components/SignIn";
export default function LoginPage() {
  return <SignIn role="Merchant" api="/api/merchant/login" nextPage="/merchant"/>;
}
