import DashMasterLayout from "../layouts/master";
import CompanyHeader from "./company-header";
import CompanyBody from "./company-body";

const CompanyLayout = () => {
    return(
        <DashMasterLayout title="Company">
            <CompanyHeader title="Company Managemanet" />
            <div className="product-table -mt-[100px] z-10 relative rounded-xl overflow-hidden mx-10">
                <CompanyBody />
            </div>
        </DashMasterLayout>
    );
};

export default CompanyLayout;