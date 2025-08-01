import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from "../hooks/AxiosInstance";

export const GettingAllBU = createAsyncThunk('bu/GettingAllBU', async () => {
    try {
        const response = await AxiosInstance.get('/bumanagement/businessunit');

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response.data.error };
    }
});

export const CreateNewBU = createAsyncThunk('bu/CreateNewBU', async (data) => {
    try {
        const response = await AxiosInstance.post('/bumanagement/businessunit', data);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response.data.error };
    }
});

export const GettingCurrentBU = createAsyncThunk('bu/GettingCurrentBU', async (id) => {
    try {
        const response = await AxiosInstance.get(`/bumanagement/businessunit/${id}`);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response.data.error };
    }
});

export const GettingComAndBu = createAsyncThunk('bu/GettingComAndBu', async() => {
    try {
        const response = await AxiosInstance.get(`/bumanagement/company_bu`);        

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response.data.error }; 
    }
});

export const UpdatingBU = createAsyncThunk('bu/UpdatingBU', async (data) => {
    try {
        const response = await AxiosInstance.put(`/bumanagement/businessunit/${data.id}`, data.data);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response.data.error };
    }
})

const businessunitSlicer = createSlice({
    name: 'bu',
    initialState: {
        bus: [],
        com_bu: [],
        currentbu: null,
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
                if (action.type.includes('GettingAllBU')) {
                    state.bus = action.payload.data;
                } else if (action.type.includes('CreateNewBU')) {
                    if (action.payload.data) state.bus = [
                        ...state.bus.filter(bus => bus.BusinessUnitId !== action.payload.data.BusinessUnitId),
                        action.payload.data
                    ].sort((a, b) => b.BusinessUnitId - a.BusinessUnitId);
                } else if (action.type.includes('GettingCurrentBU')) {
                    state.currentbu = action.payload.data;
                } else if (action.type.includes('UpdatingBU')) {
                    if (action.payload.data) {
                        state.bus = state.bus.map((bus) => bus.BusinessUnitId === action.payload.data.BusinessUnitId ? action.payload.data : bus).sort((a, b) => Number(b.BusinessUnitId) - Number(a.BusinessUnitId));
                        state.currentbu = action.payload.data;
                    }
                } else if (action.type.includes('GettingComAndBu')) {
                    state.com_bu = action.payload.data;
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

export default businessunitSlicer.reducer;