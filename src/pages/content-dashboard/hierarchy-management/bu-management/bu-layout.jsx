import DashMasterLayout from "../../layouts/master";
import CompanyHeader from "./bu-header";
import CompanyBody from "./bu-body";

const BusinessUnitLayout = () => {
    return(
        <DashMasterLayout title="Business Unit">
            <CompanyHeader title="Business Unit Managemanet" />
            <div className="product-table -mt-[100px] z-10 relative rounded-xl overflow-hidden mx-10">
                <CompanyBody />
            </div>
        </DashMasterLayout>
    );
};

export default BusinessUnitLayout;