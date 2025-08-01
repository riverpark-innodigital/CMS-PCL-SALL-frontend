import DashMasterLayout from "../../layouts/master";
import Banner from "../../../../assets/cms-banner.png";
import SingleForm from "./single-form/single-form";
import MultipleForm from "./multiple-form/multiple-form";
import { useLocation, useParams } from "react-router-dom";

const UserFormLayout = () => {

    const location = useLocation();
    const { id } = useParams();

    return(
        <DashMasterLayout>
            <div className="banner z-0">
                <img src={Banner} alt="" className="relative" />
                <div className="gg flex absolute px-[30px]">
                </div>
            </div>
            <div className="max-w-6xl mx-auto mt-5">
                {
                    location.pathname === '/hierarchy-management/user/create-single' && <SingleForm />
                }
                {
                    location.pathname === `/hierarchy-management/user/update/${id}` && <SingleForm />
                }
                {
                    location.pathname === '/hierarchy-management/user/create-multiple' && <MultipleForm />
                }
            </div>
        </DashMasterLayout>
    );
};

export default UserFormLayout;