
import { Routes, Route } from "react-router-dom";

import AuthProvider from "./hooks/AuthProvider";
import PrivateRoute from "./hooks/PrivateRoute";
import PublicRoute from "./hooks/PublicRoute";

import SigninView from "./pages/content-authenticate/signin";
import PageNotFound from "./pages/content-error/404-notfound";

// Supplier
import SupplierLayout from "./pages/content-dashboard/content-supplier/supplier-layout";
// Product
import ProductLayout from "./pages/content-dashboard/content-product/product-layout";
import ProductFormCreate from "./pages/content-dashboard/content-product/product-layout-create";
// Product
import ModelLayout from "./pages/content-dashboard/content-model/model-layout";
import GroupLayout from "./pages/content-dashboard/content-group/group-layout";

// companys
import CompanyLayout from "./pages/content-dashboard/content-company/company-layout";

import Dashboard from "./pages/content-dashboard/content-dashboard/dashboard-body";

//hierarchy management
import UserManagement from "./pages/content-dashboard/hierarchy-management/user-management/user-body";
import GroupPermissionManagement from "./pages/content-dashboard/hierarchy-management/groupPermission-management/grouppermission-body";
import UserFormLayout from "./pages/content-dashboard/hierarchy-management/user-management/user-formlayout";
import BusinessUnitLayout from "./pages/content-dashboard/hierarchy-management/bu-management/bu-layout";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Route  */}
        <Route element={<PublicRoute />}>
          <Route path="/" index element={<SigninView />} />
          <Route path="/authenticate/:type" element={<SigninView />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />

        {/* Private Route   */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/supplier" element={<SupplierLayout />} />
          <Route path="/product" element={<ProductLayout />} />
          <Route path="/product/create" element={<ProductFormCreate />} />
          <Route path="/product/update/:id" element={<ProductFormCreate />} />
          <Route path="/model" element={<ModelLayout />} />
          <Route path="/group" element={<GroupLayout />} />
          <Route path="/company" element={<CompanyLayout />} />
          <Route path="/hierarchy-management/user" element={<UserManagement />} />
          <Route path="/hierarchy-management/user/create-single" element={<UserFormLayout />} />
          <Route path="/hierarchy-management/user/update/:id" element={<UserFormLayout />} />
          <Route path="/hierarchy-management/user/create-multiple" element={<UserFormLayout />} />
          <Route path="/hierarchy-management/saleteam" element={<GroupPermissionManagement />} />
          <Route path="/hierarchy-management/bu" element={<BusinessUnitLayout />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
export default App;