import DashMasterLayout from "../../layouts/master";
import UserHeader from "./user-header";
import UserContent from "./user-content";

const UserManagement = () => {


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
        <DashMasterLayout title="User Management"  path={path}>
            <UserHeader title="User Management" />
            <div className="product-table -mt-[100px] z-10 relative rounded-xl overflow-hidden mx-10">
                <UserContent />
            </div>
        </DashMasterLayout>
    );
};

export default UserManagement;