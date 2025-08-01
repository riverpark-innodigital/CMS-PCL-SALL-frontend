import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from "../hooks/AxiosInstance";

export const fetchAllModels = createAsyncThunk('productModel/fetchAllModels', async () => {
    try {
        const response = await AxiosInstance.get(`/productModel/models`);
        // console.log("fetchAllModels ->", response);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const getModelById = createAsyncThunk('productModel/getModelById', async (modelId) => {
    try {
        const response = await AxiosInstance.get(`/productModel/model/${modelId}`);
        // console.log(
        //     "params {modelId} ->", modelId, "\n",
        //     "getModelById ->", response
        // );

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const createModel = createAsyncThunk('productModel/createModel', async (data) => {
    try {
        // console.log("params {data} ->", data);
        
        const response = await AxiosInstance.post(`/productModel/model`, data);
        // console.log(
        //     "params {data} ->", data, "\n",
        //     "createModel ->", response
        // );    

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const updateModelById = createAsyncThunk('productModel/updateModelById', async (data) => {
    try {
        // console.log(data);
        
        const response = await AxiosInstance.put(`/productModel/model/${data.data.modelId}`, data.data.data);
        // console.log(
        //     "params {data} ->", data, "\n",
        //     "updateModelById ->", response
        // );    
        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const deleteModelById = createAsyncThunk('productModel/deleteModelById', async (modelId) => {
    try {
        // console.log(modelId);
        
        const response = await AxiosInstance.delete(`/productModel/model/${modelId}`);
        // console.log(
        //     "params {modelId} ->", modelId, "\n",
        //     "deleteModelById ->", response
        // );    

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const getModelBySup = createAsyncThunk('productModel/getModelBySupId', async (data) => {
    try {
        const response = await AxiosInstance.get(`productModel/modelbysup/${data}`);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
})

const initialState = {
    models: [],
    model: null,
    loading: false,
    error: null,
};

const modelSlice = createSlice({
    name: 'model',
    initialState,
    extraReducers: (builder) => {
        builder
            // fetchAllModels
            .addCase(fetchAllModels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllModels.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.loading = false;
                if (action.payload.status === true) {
                    state.models = action.payload.data;
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(fetchAllModels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            })

            // fetchModels by sup
            .addCase(getModelBySup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getModelBySup.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.loading = false;
                if (action.payload.status === true) {
                    state.models = action.payload.data;
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(getModelBySup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            })

            // getModelById
            .addCase(getModelById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getModelById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status) {
                    state.model = action.payload.data;
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(getModelById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            })

            // createModel
            .addCase(createModel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createModel.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status) {
                    state.models.push(action.payload.data);
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(createModel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            })

            // updateModelById
            .addCase(updateModelById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateModelById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status) {
                    state.models = state.models.map((models) => models.ModelProductId === action.payload.data.ModelProductId ? action.payload.data : models);
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(updateModelById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            })

            // deleteModelById
            .addCase(deleteModelById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteModelById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status) {
                    state.models = state.models.filter(model => model.id !== action.payload.data.id);
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(deleteModelById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            });
    }
});

export default modelSlice.reducer;
