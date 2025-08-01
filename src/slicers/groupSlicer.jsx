import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance, AxiosInstanceMultipart } from "../hooks/AxiosInstance";

export const fetchAllGroups = createAsyncThunk('productGroup/fetchAllGroups', async () => {
    try {
        const response = await AxiosInstance.get(`/productGroup/groups`);
        // console.log("fetchAllGroups ->", response);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const getGroupById = createAsyncThunk('productGroup/getGroupById', async (groupId) => {
    try {
        const response = await AxiosInstance.get(`/productGroup/group/${groupId}`);
        // console.log(
        //     "params {groupId} ->", groupId, "\n",
        //     "getGroupById ->", response
        // );

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const createGroup = createAsyncThunk('productGroup/createGroup', async (data) => {
    try {
        // console.log("params {data} ->", data);
        
        const response = await AxiosInstanceMultipart.post(`/productGroup/group`, data);
        // console.log(
        //     "params {data} ->", data, "\n",
        //     "createGroup ->", response
        // );    

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const updateGroupById = createAsyncThunk('productGroup/updateGroupById', async (data) => {
    try {
        // console.log(data);
        
        const response = await AxiosInstanceMultipart.put(`/productGroup/group/${data.data.groupId}`, data.data.data);
        // console.log(
        //     "params {data} ->", data, "\n",
        //     "updateGroupById ->", response
        // );    
        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const deleteGroupById = createAsyncThunk('productGroup/deleteGroupById', async (groupId) => {
    try {
        // console.log(groupId);
        
        const response = await AxiosInstance.delete(`/productGroup/group/${groupId}`);
        // console.log(
        //     "params {groupId} ->", groupId, "\n",
        //     "deleteGroupById ->", response
        // );    

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const getGroupBySupId = createAsyncThunk('productGroup/getGroupBySupId', async (data) => {
    try {
        const response = await AxiosInstance.get(`productGroup/groupbysup/${data}`);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
})

const initialState = {
    groups: [],
    group: null,
    loading: false,
    error: null,
};

const groupSlice = createSlice({
    name: 'group',
    initialState,
    extraReducers: (builder) => {
        builder
            // fetchAllGroups
            .addCase(fetchAllGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllGroups.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.loading = false;
                if (action.payload.status === true) {
                    state.groups = action.payload.data.sort(
                        (a, b) => new Date(b.UpdateDate) - new Date(a.UpdateDate)
                    );
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(fetchAllGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            })
            .addCase(getGroupBySupId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getGroupBySupId.fulfilled, (state, action) => {
                // console.log(action.payload);
                state.loading = false;
                if (action.payload.status === true) {
                    state.groups = action.payload.data;
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(getGroupBySupId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            })

            // getGroupById
            .addCase(getGroupById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getGroupById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status) {
                    state.group = action.payload.data;
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(getGroupById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            })

            // createGroup
            .addCase(createGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status) {
                    state.groups.push(action.payload.data);
                    state.groups.sort((a, b) => new Date(b.UpdateDate) - new Date(a.UpdateDate));
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            })

            // updateGroupById
            .addCase(updateGroupById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGroupById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status) {
                    state.groups = state.groups.map((groups) => groups.GroupProductId === action.payload.data.GroupProductId ? action.payload.data : groups).sort(
                        (a, b) => new Date(b.UpdateDate) - new Date(a.UpdateDate)
                    );
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(updateGroupById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            })

            // deleteGroupById
            .addCase(deleteGroupById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGroupById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status) {
                    state.groups = state.groups.filter(group => group.id !== action.payload.data.id);
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(deleteGroupById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            });
    }
});

export default groupSlice.reducer;
