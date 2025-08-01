import DashMasterLayout from "../layouts/master";
import DashboardHeader from "./dashboard-header";
import DashboardContent from "./dashboard-content";

const Dashboard = () => {


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
        <DashMasterLayout title="Dashboard"  path={path}>
            <DashboardHeader title="Dashboard" />
            <DashboardContent />
        </DashMasterLayout>
    );
};

export default Dashboard;