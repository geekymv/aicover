import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function ({ searchParams }: { searchParams: { payment_id: string, status: string} }) {
  const { payment_id, status } = searchParams;  
  console.log(`pay result payment_id:${payment_id}, status:${status}`)
  redirect("/");
}
