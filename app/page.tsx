import Link from "next/link";

import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div>
      <Button asChild>
        <Link href="/consulta">Consultar</Link>
      </Button>
    </div>
  );
};

export default Home;
