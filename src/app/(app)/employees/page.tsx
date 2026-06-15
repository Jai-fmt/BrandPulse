import { createClient } from "@/lib/supabase/server";
import { EmployeeDirectory } from "./employee-directory";

export default async function EmployeesPage() {
  const supabase = await createClient();

  const result = await supabase?.from("employees").select("*").order("total_points", { ascending: false });
  const employees = result?.data ?? [];
  const error = result?.error;

  return <EmployeeDirectory initialEmployees={employees ?? []} error={error?.message} />;
}
