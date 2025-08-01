import DashMasterLayout from "../../layouts/master";
import GroupPermissionContent from "./grouppermission-content";
import GroupPermissionHeader from "./grouppermission-header";

const GroupPermissionManagement = () => {


    const path = [
        {
            label: "Home",
            active: false,
        },
        {
            label: "Dashboard",
            active: true,
        }
    ]

    return(
        <DashMasterLayout title="Group & Sale team"  path={path}>
            <GroupPermissionHeader title="Group & Sale team" />
            <div className="product-table -mt-[100px] z-10 relative rounded-xl overflow-hidden mx-10">
                <GroupPermissionContent />
            </div>
        </DashMasterLayout>
    );
};

export default GroupPermissionManagement;