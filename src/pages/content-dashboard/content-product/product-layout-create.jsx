import DashMasterLayout from "../layouts/master";
import Banner from '../../../assets/cms-banner.png';
import ProductForm from "./forms/product";

const ProductFormCreate = () => {
    return(
        <DashMasterLayout>
            <div className="banner z-0">
                <img src={Banner} alt="" className="relative" />
                <div className="gg flex absolute px-[30px]">
                </div>
            </div>
            <div className="max-w-6xl mx-auto mt-5">
                <ProductForm />
            </div>
        </DashMasterLayout>
    );
};

export default ProductFormCreate;