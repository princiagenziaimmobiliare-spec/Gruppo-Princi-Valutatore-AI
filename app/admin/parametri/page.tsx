import AdminNav from "@/components/admin-nav";
import AdminProtect from "@/components/admin-protect";
import ParametriManager from "@/components/parametri-manager";

export default function Page() {
  return <AdminProtect><section className="container-page py-10"><h1 className="mb-4 text-2xl font-bold">Parametri e Coefficienti</h1><AdminNav /><ParametriManager /></section></AdminProtect>;
}
