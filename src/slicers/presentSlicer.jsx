import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstanceMultipart } from "../hooks/AxiosInstance";

export const createNewPresentFile = createAsyncThunk('presentfile/createNewPresentFile', async (data) => {
    try {
        const response = await AxiosInstanceMultipart.post('/presentation/presentationFile', data);

        return { status: true, data: response.data.body };
    } catch (error) {
         return { status: false, error: error.response?.data?.error || error.message };
    }
})

const presentFileSlice = createSlice({
    name: 'presentfile',
    initialState: {
        presentfile: [],
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
                if (action.type.includes('createNewPresentFile')) {
                    state.presentfile = action.payload.data;
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

export default presentFileSlice.reducer;