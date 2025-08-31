import React from "react";
import { NavbarDashboardComponent } from "../components/layouts/NavbarDashboardComponent";
import FooterComponent from "../components/layouts/FooterComponent";
import HeaderHomeComponent from "../components/layouts/HeaderComponent";
import NavbarComponent from "../components/layouts/NavbarComponent";

function PetaAspirasi() {
  return (
    <>
      <NavbarDashboardComponent />
      <HeaderHomeComponent
        image="/images/kota-malang.jpg"
        title="Peta Aspirasi Interaktif"
        description="Visualisasi aspirasi dan isu masyarakat Kota Malang dalam peta interaktif untuk memahami kebutuhan setiap wilayah."
      />
      <NavbarComponent />
      <FooterComponent />
    </>
  );
}

export default PetaAspirasi;
