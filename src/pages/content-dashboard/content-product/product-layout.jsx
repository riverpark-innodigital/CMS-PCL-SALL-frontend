import DashMasterLayout from "../layouts/master";
import ProductBody from "./product-body";

import ProductHeader from "./product-header";

const ProductLayout = () => {

    const path = [
        {
            label: "Home",
            active: false,
        },
        {
            label: "Product",
            active: true,
        }
    ]

    return (
        <DashMasterLayout title="Product" path={path}>
            <ProductHeader title="Product Managemanet" className="border duration-100 ease-in-out" />
            <div className="product-table -mt-[100px] z-10 relative rounded-xl overflow-hidden mx-10">
                <ProductBody />
            </div>
        </DashMasterLayout>
    );
};

export default ProductLayout;