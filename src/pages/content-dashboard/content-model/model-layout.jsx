import DashMasterLayout from "../layouts/master";
import SupplierHeader from "./model-header";
import ModelTable from "./model-table";


const ModelLayout = () => {

    const path = [
        {
            label: "Home",
            active: false,
        },
        {
            label: "Supplier",
            active: true,
        }
    ]

    return(
        <DashMasterLayout title="Model"  path={path}>
            <SupplierHeader title="Model Managemanet" />
            <div className="product-table -mt-[50px] z-10 relative rounded-xl overflow-hidden mx-10">
                <ModelTable />
            </div>
        </DashMasterLayout>
    );
};

export default ModelLayout;