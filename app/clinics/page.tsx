import { Dialog } from "@/components/ui/dialog";

import ClinicsForm from "./components/clinicsForm";

const ClinicsPage = () => {
  return (
    <section>
      <Dialog open>
        <ClinicsForm />
      </Dialog>
    </section>
  );
};

export default ClinicsPage;
