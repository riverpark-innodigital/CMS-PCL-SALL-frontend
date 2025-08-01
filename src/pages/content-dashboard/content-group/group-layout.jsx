import DashMasterLayout from "../layouts/master";
import SupplierHeader from "./group-header";
import GroupModel from "./group-table";


const ModelLayout = () => {

    const path = [
        {
            label: "Home",
            active: false,
        },
        {
            label: "Group",
            active: true,
        }
    ]

    return(
        <DashMasterLayout title="Product Group" path={path}>
            <SupplierHeader title="Group Managemanet" />
            <div className="product-table -mt-[100px] z-10 relative rounded-xl overflow-hidden mx-10">
                <GroupModel />
            </div>
        </DashMasterLayout>
    );
};

export default ModelLayout;