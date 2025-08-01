import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {AxiosInstance, AxiosInstanceMultipart} from "../hooks/AxiosInstance";

export const createNewSupplier = createAsyncThunk('supplier/createNewSupplier', async (data) => {
    try {
        const res = await AxiosInstanceMultipart.post('/supplier', data);
        // console.log("createNewSupplier ->",res);
    
        return { status: 'success', data: res.data.body };
    } catch (e) {
        return { status: 'error', message: e.response?.data?.error };
    }
});

export const fetchAllSupplier = createAsyncThunk('supplier/fetchAllSupplier', async () => {
    try {
        const res = await AxiosInstance.get('/supplier');
        // console.log("fetchAllSupplier ->",res);

        return { status: 'success', data: res.data.body };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
});

export const fecthSupplierByID = createAsyncThunk('supplier/fecthSupplierByID', async (data) => {
    try {
        const res = await AxiosInstance.get(`/supplier/${data.id}`);
        // console.log("fecthSupplierByID ->",res);

        return { status: 'success', data: res.data.body };
    } catch (e) {
        return { status: 'error', message: e.message };
    }
});

export const updateSupplier = createAsyncThunk('supplier/updateSupplier', async (data) => {
    try {     
        const res = await AxiosInstanceMultipart.put(`/supplier/${data.id}`, data.DataformData);
        // console.log("updateSupplier ->",res);

        return { status:'success', data: res.data.body };
    } catch (error) {
        return {  status: false, error: error.response?.data?.error || error.message };
    }
});

export const deleteSuppplier = createAsyncThunk('supplier/deleteSuppplier', async (data) => {
    try {
        const res = await AxiosInstance.delete(`/supplier/${data}`);
        // console.log("deleteSuppplier ->",res);

        return { status:'success', data: res.data.body };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
});

export const getSupplierByCompanyId = createAsyncThunk('supplier/getSupplierByCompanyId', async (data) => {
    try {
        const res = await AxiosInstance.get(`/supplierManage/supplier_comid/${data}`);

        return { status: 'success', data: res.data.body };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
});


export const GettingSupByGroup = createAsyncThunk('supplier/GettingSupByGroup', async (data) => {
    try {
        const res = await AxiosInstance.get(`supplierManage/supbypgroup/${data}`);

        return { status: 'success', data: res.data.body }; 
    } catch (error) {
        return { status: 'error', message: error.message };
    }
});


const supplierSlice = createSlice({
    name: 'supplier',
    initialState: {
        currentSupplier: null,
        supbypgroup: [],
        loading: false,
        error: null,
        suppliers: [],
        suppliersBycom: [],
    },
    extraReducers: (builder) => {
        builder
        .addMatcher(
            (action) => action.type.endsWith("/pending"),
            (state) => {
                state.loading = true;
                state.error = null;
            },
        )
        .addMatcher(
            (action) => action.type.endsWith("fulfilled"),
            (state, action) => {
                state.loading = false;
                if (action.type.includes('createNewSupplier')) {
                    state.suppliers = [...state.suppliers, action.payload.data].sort((a, b) => b.SupplierId - a.SupplierId);
                } else if (action.type.includes('fetchAllSupplier')) {
                    state.suppliers = action.payload.data !== undefined ? action.payload.data : [];
                } else if (action.type.includes('fecthSupplierByID')) {
                    state.currentSupplier = action.payload.data;
                } else if (action.type.includes('updateSupplier')) {
                    if (action.payload.data !== undefined) {
                        state.suppliers = state.suppliers.map((suppliers) => suppliers.SupplierId === action.payload.data.SupplierId ? action.payload.data : suppliers)
                        state.currentSupplier = action.payload.data;
                    }
                } else if (action.type.includes('deleteSuppplier')) {
                    state.suppliers = state.suppliers.filter((suppliers) => suppliers.SupplierId !== action.payload.data.SupplierId)
                } else if (action.type.includes('getSupplierByCompanyId')) {
                    state.suppliersBycom = action.payload.data !== undefined ? action.payload.data : [];
                } else if (action.type.includes('GettingSupByGroup')) {
                    state.supbypgroup = action.payload.data;
                }
            }
        )
        .addMatcher(
            (action) => action.type.endsWith("/rejected"),
            (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
        )
    }
});

export default supplierSlice.reducer;