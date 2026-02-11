import AdminNav from "@/components/admin-nav";
import AdminProtect from "@/components/admin-protect";
import RichiesteManager from "@/components/richieste-manager";

export default function Page() {
  return <AdminProtect><section className="container-page py-10"><h1 className="mb-4 text-2xl font-bold">Richieste</h1><AdminNav /><RichiesteManager /></section></AdminProtect>;
}
