import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstanceMultipart} from "../hooks/AxiosInstance";

const baseRouter = '/productManage'

export const getFolderById = createAsyncThunk('productManage/getFolderById', async (productId) => {
    try {
        const res = await AxiosInstanceMultipart.get(`${baseRouter}/productFolder/${productId.productId}`);
        // console.log("getFolderById ->",res);
        
        return { status:'success', data: res.data.body };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
});

export const getFileByFolder = createAsyncThunk('productManage/getFileByFolder', async (folderId) => {
    try {
        const res = await AxiosInstanceMultipart.get(`${baseRouter}/productFile/${folderId.folderId}`);
        // console.log("getFileByFolder ->",res);
        
        return { status:'success', data: res.data.body };
    } catch (error) {
        return { status: 'error', message: error.message };
    }
});


const productfileSlice = createSlice({
    name: 'productfile',
    initialState: {
        productfile: null,
        loading: false,
        error: null,
        productfiles: [],
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
                if (action.type.includes('getFolderById')) {
                    state.productfiles = action.payload.data !== undefined ? action.payload.data : [];
                } else if (action.type.includes('getFileByFolder')) {
                    state.productfile = action.payload.data !== undefined ? action.payload.data : null;
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

export default productfileSlice.reducer;