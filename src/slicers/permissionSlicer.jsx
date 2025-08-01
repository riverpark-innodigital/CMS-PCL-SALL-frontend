import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from "../hooks/AxiosInstance";

export const gettingAllGroupPermissins = createAsyncThunk('permission/gettingAllGroupPermissins', async () => {
    try {
        const response = await AxiosInstance.get('/permission/group_permission');

        return { status: true, data: response.data.body };
    } catch (e) {
        return { status: false, message: e.response?.data?.error };
    }
});

export const createNewGroupPermissions = createAsyncThunk('permission/createNewGroupPermissions', async (data) => {
    try {
        const response = await AxiosInstance.post('/permission/group_permission', data);

        return { status: true, data: response.data.body };
    } catch (e) {
        return { status: false, message: e.response?.data?.error };
    }
});

export const updateGroupPermissions = createAsyncThunk('permission/updateGroupPermissions', async (data) => {
    try {
        const response = await AxiosInstance.put(`/permission/group_permission/${data.id}`, data.data);

        return { status: true, data: response.data.body };
    } catch (e) {
        return { status: false, message: e.response?.data?.error };
    }
});

export const gettingGroupPermissionByID = createAsyncThunk('permission/gettingGroupPermissionByID', async (id) => {
    try {
        const response = await AxiosInstance.get(`/permission/group_permission/${id}`);

        return { status: true, data: response.data.body };
    } catch (e) {
        return { status: false, message: e.response?.data?.error };
    }
});

export const addNewPermissions = createAsyncThunk('permission/addNewPermissions', async (data) => {
    try {
        const response = await AxiosInstance.post('/permission/permission', {
            GroupPermissionID: data.groupPermissions,
            UserId: data.userId
        });

        return { status: true, data: response.data.body };
    } catch (e) {
        return { status: false, message: e.response?.data?.error };
    }
});

const permissionSlice = createSlice({
    name: 'permission',
    initialState: {
        groupPermissions: [],
        currentGroupPermissions: [],
        permissions: [],
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
                if (action.type.includes('gettingAllGroupPermissins')) {
                    state.groupPermissions = action.payload.data;
                } else if (action.type.includes('gettingGroupPermissionByID')) {
                    state.currentGroupPermissions = action.payload.data;
                } else if (action.type.includes('updateGroupPermissions')) {
                    state.groupPermissions = state.groupPermissions.map((grouppermission) => grouppermission.id === action.payload.data.id ? action.payload.data : grouppermission)
                } else if (action.type.includes('createNewGroupPermissions')) {
                    state.groupPermissions = [...state.groupPermissions, action.payload.data];
                } else if (action.type.includes('addNewPermissions')) {
                    state.permissions = action.payload.data;
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

export default permissionSlice.reducer;