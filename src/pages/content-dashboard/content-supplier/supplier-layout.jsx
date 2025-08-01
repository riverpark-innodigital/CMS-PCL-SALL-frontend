import DashMasterLayout from "../layouts/master";
import SupplierHeader from "./supelier-header";
import SupplierBody from "./supplier-body";

const SupplierLayout = () => {

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
        <DashMasterLayout title="Supplier"  path={path}>
            <SupplierHeader title="Supplier Managemanet" />
            <div className="product-table -mt-[100px] z-10 relative rounded-xl overflow-hidden mx-10">
                <SupplierBody />
            </div>
        </DashMasterLayout>
    );
};

export default SupplierLayout;