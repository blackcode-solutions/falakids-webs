import PatientProfilePage from "@/components/screens/PatientProfilePage";
import FonoLayout from "@/components/FonoLayout";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  return <FonoLayout><PatientProfilePage params={params} /></FonoLayout>;
}
