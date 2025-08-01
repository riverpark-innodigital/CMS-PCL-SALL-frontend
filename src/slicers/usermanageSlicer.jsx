import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from "../hooks/AxiosInstance";

export const gettingAlluser = createAsyncThunk('usermanage/gettingAlluser', async () => {
    try {
        const res = await AxiosInstance.get('/usermanagement/users');

        return { status: 'success', data: res.data.body };
    } catch (e) {
        return { status: 'error', message: e.response?.data?.error };
    }
});

export const GetiingAllUserDerectory = createAsyncThunk('usermanage/GetiingAllUserDerectory', async () => {
    try {
        const res = await AxiosInstance.get('/usermanagement/userdirectory');

        return { status: true, data: res.data.body };
    } catch (e) {
        return { status: false, message: e.response?.data?.error };
    }
});

export const GettingUserByID = createAsyncThunk('usermanage/GettingUserByID', async (id) => {
    try {
        const res = await AxiosInstance.get(`/usermanagement/users/${id}`);

        return { status: true, data: res.data.body };
    } catch (e) {
        return { status: false, message: e.response?.data?.error };
    }
});

export const GettingAllRoles = createAsyncThunk('usermanage/GettingAllRoles', async () => {
    try {
        const res = await AxiosInstance.get('/roles/userroles');

        return { status: true, data: res.data.body };
    } catch (e) {
        return { status: false, message: e.response?.data?.error };
    }
});

export const AddnewSingleLdapUser = createAsyncThunk('usermanage/AddnewSingleLdapUser', async (data) => {
    try {
        const response = await AxiosInstance.post('/usermanagement/single_user', {
            ldapUsername: data.ldapUsername,
            ldapName: data.ldapName,
            email: data.email,
            role: data.role,
            handleId: data.handleId,
            status: data.status,
        });

        return { status: true, data: response.data.body };
    } catch (e) {
        return { status: false, message: e.response?.data?.error };
    }
});

export const UpdateUser = createAsyncThunk('usermanage/UpdateUser', async (data) => {
    try {
        const response = await AxiosInstance.put(`/usermanagement/users/${data.id}`, {
            ldapUsername: data.ldapUsername,
            ldapName: data.ldapName,
            email: data.email,
            role: data.role,
            handleId: data.handleId,
            status: data.status,
        });

        return { status: true, data: response.data.body };
    } catch (e) {
        return { status: false, message: e.response?.data?.error };
    }
});

export const GettingHandlerBy = createAsyncThunk('usermanage/GettingHandlerBy', async () => {
    try {
        const res = await AxiosInstance.get('/usermanagement/handlers');

        return { status: true, data: res.data.body };
    } catch (e) {
        return { status: false, message: e.response?.data?.error };
    }
});

export const AddNewMultipleUser = createAsyncThunk('usermanage/AddNewMultipleUser', async (data) => {
    try {
        const res = await AxiosInstance.post('/usermanagement/multiple_user' ,{
            UserdataArr: data.UserData,
            role: data.role,
            handleId: data.handleId,
        });

        return { status: true, data: res.data.body };
    } catch (e) {
        return { status: false, message: e.response?.data?.error };
    }
});

export const GettingUserByRole = createAsyncThunk('usermanage/GettingUserByRole', async (role) => {
    try {
        const response = await AxiosInstance.get(`/usermanagement/users_role/${role}`);

        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, message: error.response?.data?.error };
    }
});

const usermanageSlice = createSlice({
    name: 'usermanage',
    initialState: {
        users: [],
        directoryUser: [],
        usersrole: [],
        currentlyUser: null,
        roles: [],
        handlers: [],
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
                if (action.type.includes('gettingAlluser')) {
                    state.users = action.payload.data;
                } else if (action.type.includes('GetiingAllUserDerectory')) {
                    state.directoryUser = action.payload.data;
                } else if (action.type.includes('GettingAllRoles')) {
                    state.roles = action.payload.data;
                } else if (action.type.includes('AddnewSingleLdapUser')) {
                    state.users = [...state.users, action.payload.data];
                } else if (action.type.includes('GettingUserByID')) {
                    state.currentlyUser = action.payload.data;
                } else if (action.type.includes('UpdateUser')) {
                    state.users = state.users.map((users) => users.ldapUserId === action.payload.data.ldapUserId ? action.payload.data : users)
                } else if (action.type.includes('GettingHandlerBy')) {
                    state.handlers = action.payload.data;
                } else if (action.type.includes('AddNewMultipleUser')) {
                    for (const userData of action.payload.data) {
                        state.users = [...state.users, userData];
                    }
                } else if (action.type.includes('GettingUserByRole')) {
                    state.usersrole = action.payload.data;
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

export default usermanageSlice.reducer;