import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard/my-tasks");
}
