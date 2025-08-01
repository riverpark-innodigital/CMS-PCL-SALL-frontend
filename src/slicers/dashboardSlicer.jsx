import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from "../hooks/AxiosInstance";

export const fecthProductTotal = createAsyncThunk('dashboard/fecthProductTotal', async () => {
    try {
        const response = await AxiosInstance.get(`/Dashboard/getProductsTotal`);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const fecthSupplierTotal = createAsyncThunk('dashboard/fecthSupplierTotal', async () => {
    try {
        const response = await AxiosInstance.get('/Dashboard/getSuppliersTotal');

        return { status: true, data: response.data.body };
    } catch (e) {
        return { status: false, error: e.response?.data?.error || e.message };
    }
});

export const MostviewProduct = createAsyncThunk('dashboard/mostviewProduct', async () => {
    try {
        const response = await AxiosInstance.get('/Dashboard/getMostViewProduct');

        return { status: true, data: response.data.body };
    } catch (e) {
        return { status: false, error: e.response?.data?.error || e.message };
    }
});

export const fetchTopSupplier = createAsyncThunk('dashboard/fetchTopSupplier', async () => {
    try {
        const response = await AxiosInstance.get('/Dashboard/getTop5Suppliers');

        return { status: true, data: response.data.body };
    } catch (e) {
        return { status: false, error: e.response?.data?.error || e.message };
    }
});

export const fectOverview = createAsyncThunk('dashboard/fectOverview', async () => {
    try {
        const response = await AxiosInstance.get('/Dashboard/get_product_overview');

        return { status: true, data: response.data.body };
    } catch (e) {
        return { status: false, error: e.response?.data?.error || e.message };
    }
});

export const GettingAllPresent = createAsyncThunk('dashboard/GettingAllPresent', async () => {
    try {
        const response = await AxiosInstance.get('/Dashboard/getallpresent');

        return { status: true, data: response.data.body };
    } catch (e) {
        return { status: false, error: e.response?.data?.error || e.message }; 
    }
});


const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        productTotal: [],
        supplierTotal: [],
        productMostView: [],
        topSupplier: [],
        overview: [],
        allproductpresent: [],
        loading: false,
        error: null,
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
                if (action.type.includes('fecthProductTotal')) {
                    state.productTotal = action.payload.data;
                } else if (action.type.includes('fecthSupplierTotal')) {
                    state.supplierTotal = action.payload.data;
                } else if (action.type.includes('mostviewProduct')) {
                    state.productMostView = action.payload.data;
                } else if (action.type.includes('fetchTopSupplier')) {
                    state.topSupplier = action.payload.data;
                } else if (action.type.includes('fectOverview')) {
                    state.overview = action.payload.data;
                } else if (action.type.includes('GettingAllPresent')) {
                    state.allproductpresent = action.payload.data;
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

export default dashboardSlice.reducer;