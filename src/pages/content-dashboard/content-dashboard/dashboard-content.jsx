// import ProductTotalContent from "./components/productotal-content";
// import SupplierTotalContent from "./components/suppliertotal-content";
// import MostSuplierContent from "./components/mostsupplier-content";
// import PopularProductContent from "./components/popularproduct-content";
import KPIOverview from "./components/kpi-overview";
import OverviewContent from "./components/overview-content";
import TopProduct from "./components/top-product";
import FunnelStage from "./components/funnel-strage";
import AllPresentation from "./components/all-presentation";

const DashboardContent = () => {
    return(
        <div className="w-full p-10">
            {/* <div className="w-full flex justify-between gap-[16px]">
                <div className="w-[60%]">
                    <div className="w-full flex gap-x-[16px] mb-[16px] justify-between">
                        <ProductTotalContent />
                        <SupplierTotalContent />
                    </div>
                    <PopularProductContent />
                </div>
                <div className="w-[40%] border">
                    <div className="w-full h-full">
                        <MostSuplierContent />
                    </div>
                </div>
            </div> */}
            <div className="w-full flex justify-between gap-[16px]">
                <div className="w-full grid-cols-1 grid gap-[16px]">
                    <KPIOverview />
                    <TopProduct />
                </div>
                <FunnelStage />
                <AllPresentation />
            </div>
            <div className="w-full my-[40px]">
                <OverviewContent />
            </div>
        </div>
    );
};

export default DashboardContent;