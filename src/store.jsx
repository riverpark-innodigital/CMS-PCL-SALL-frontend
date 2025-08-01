import { configureStore } from "@reduxjs/toolkit";
import authenticateSlice from "./slicers/authenticateSlicer";
import productsaleSlice from "./slicers/productsaleSlicer";
import supplierSlice from "./slicers/supplierSlicer";
import productfileSlice from "./slicers/productfileSlicer";
import modelSlice from "./slicers/modelSlicer";
import groupSlice from "./slicers/groupSlicer";
import companySlice from "./slicers/companySlicer";
import dashboardSlice from "./slicers/dashboardSlicer";
import usermanageSlice from './slicers/usermanageSlicer';
import permissionSlice from './slicers/permissionSlicer';
import businessunitSlicer from './slicers/businessuintSlicer';

export const store = configureStore({
    reducer: {
        auth: authenticateSlice,
        productsale: productsaleSlice,
        supplier: supplierSlice,
        productfile: productfileSlice,
        model: modelSlice,
        group: groupSlice,
        company: companySlice,
        dashboard: dashboardSlice,
        usermanage: usermanageSlice,
        permission: permissionSlice,
        bu: businessunitSlicer, 
    },
});
