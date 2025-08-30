import HeaderPageComponent from "../components/layouts/HeaderPageComponent";
import { NavbarDashboardComponent } from "../components/layouts/NavbarDashboardComponent";
import FooterComponent from "../components/layouts/FooterComponent";

function ProfilWakilRakyat() {
  return (
    <>
      <NavbarDashboardComponent />
      <HeaderPageComponent
        title="Daftar Wakil Rakyat"
        iconClass="fas fa-users"
        showManageProfile={true}
        manageProfileLink="/wakil-rakyat/profile"
        manageProfileText="Kelola Profil Saya"
      />
      <FooterComponent />
    </>
  );
}

export default ProfilWakilRakyat;
