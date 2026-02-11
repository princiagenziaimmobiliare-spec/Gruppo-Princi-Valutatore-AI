import AdminNav from "@/components/admin-nav";
import AdminProtect from "@/components/admin-protect";
import LocalitaManager from "@/components/localita-manager";

export default function Page() {
  return <AdminProtect><section className="container-page py-10"><h1 className="mb-4 text-2xl font-bold">Località e Zone</h1><AdminNav /><LocalitaManager /></section></AdminProtect>;
}
