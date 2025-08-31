import HeaderPageComponent from "../../components/layouts/HeaderPageComponent";
import { NavbarDashboardComponent } from "../../components/layouts/NavbarDashboardComponent";

function TransparansiKebijakan() {
  return (
    <>
      <NavbarDashboardComponent />
      <HeaderPageComponent
        title=" Transparansi Kebijakan Publik"
        iconClassclassName="fas fa-file-alt"
        showManageProfile={false}
      />
    </>
  );
}

export default TransparansiKebijakan;
