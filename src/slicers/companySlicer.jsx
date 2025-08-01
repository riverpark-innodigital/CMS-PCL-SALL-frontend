import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {AxiosInstance, AxiosInstanceMultipart} from "../hooks/AxiosInstance";

export const GettingAllCompany = createAsyncThunk('companys/GettingAllCompany', async () => {
    try {
        const response = await AxiosInstance.get(`companyManage/compamy`);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response.data.error };
    }
});

export const GettingCompanyById = createAsyncThunk('companys/GettingCompanyById', async (data) => {
    try {
        const response = await AxiosInstance.get(`companyManage/compamy/${data}`);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response.data.error };
    }
})

export const CreateCompanys = createAsyncThunk('companys/CreateCompany', async (data) => {
    try {
        const response = await AxiosInstanceMultipart.post('companyManage/compamy', data);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response.data.error };
    }
});

export const UpdateCompanyById = createAsyncThunk('companys/UpdateCompany', async (data) => {
    try {
        const response = await AxiosInstanceMultipart.put(`companyManage/compamy/${data.comId}`, data.formData);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response.data.error };
    }
});

export const DeleteCompanyById = createAsyncThunk('companys/DeleteCompanyById', async (data) => {
    try {
        const response = await AxiosInstance.delete(`companyManage/compamy/${data}`);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response.data.error };
    }
});

export const GettingCompanyBySup = createAsyncThunk('companys/GettingCompanyBySup', async(data) => {
    try {
        const response = await AxiosInstance.get(`companyManage/companybysup/${data}`);
        
        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response.data.error };
    }
})

const companySlice = createSlice({
    name: 'companys',
    initialState: {
        companys: [],
        currentCompany: null,
        companybysup: [],
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
            (action) => action.type.endsWith("/fulfilled"),
            (state, action) => {
                state.loading = false;
                if (action.type.includes('GettingAllCompany')) {
                    state.companys = action.payload.data.sort(
                        (a, b) => new Date(b.UpdateDate) - new Date(a.UpdateDate)
                    );
                } else if (action.type.includes('CreateCompany')) {
                    if (action.payload.data) state.companys = [...state.companys, action.payload.data].sort(
                        (a, b) => new Date(b.UpdateDate) - new Date(a.UpdateDate)
                    );
                } else if (action.type.includes('GettingCompanyById')) {
                    state.currentCompany = action.payload.data;
                } else if (action.type.includes('UpdateCompany')) {
                    state.companys = state.companys.map((companys) => companys.CompanyId === action.payload.data.CompanyId ? action.payload.data : companys).sort((a, b) => b.UpdateDate - a.UpdateDate);
                    state.currentCompany = action.payload.data;
                } else if (action.type.includes('DeleteCompanyById')) {
                    state.companys = state.companys.filter((companys) => companys.CompanyId !== action.payload.data.CompanyId)
                } else if (action.type.includes('GettingCompanyBySup')) {
                    state.companybysup = action.payload.data;
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

export default companySlice.reducer;