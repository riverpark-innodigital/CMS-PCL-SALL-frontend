import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance, AxiosInstanceMultipart } from "../hooks/AxiosInstance";


export const fetchAllProducts = createAsyncThunk('productsale/fetchAllProducts', async () => {
    try {
        const response = await AxiosInstance.get(`/productsale/product`);
        // console.log("fetchAllProducts ->", response);
        
        return { status: true, data: response.data.data };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const getAllProducts = createAsyncThunk('productsale/getAllProducts', async () => {
    try {
        const response = await AxiosInstance.get(`/productsale/product`);
        // console.log("getAllProducts ->", response);
        
        return { status: true, data: response.data.data };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const createProduct = createAsyncThunk('productsale/createProductController', async (data) => {
    try {
        const createPro = await AxiosInstanceMultipart.post('/productsale/product', data.ProductData);
        
        const proFolder = data.ProFolder;
        let i = 1;
        for (const folder of proFolder) {
            // console.log("Folder input before create ->", folder);
            const createFolder = await AxiosInstance.post('/productfolder', {
                ProductFolderNameTh: folder.FolderNameEn,
                ProductFolderNameEn: folder.FolderNameTH,
                ProductId: createPro.data.data.ProductId,
                Active: true,
                Seq: i++,
            });
            // console.log('Folder after create ->', createFolder);
            
            let files = folder.File;
            if (files || files.length > 0) {
                for (const file of files) {
                    // console.log(file);
                    const formData = new FormData();
                    formData.append('ProductFileNameTh', file.File.name);
                    formData.append('ProductFileNameEn', file.File.name);
                    formData.append('ProductFolderId', createFolder.data.body.ProductFolderId);
                    formData.append('ProductFile', file.File.originFileObj);
                    formData.append('Active', true);
                    
                    await AxiosInstanceMultipart.post(`/productFile`, formData);
                }
            }
        }

        return { status: true, data: createPro.data.product };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const updateProductFile = createAsyncThunk('productsale/updateProductFile', async (data) => {
    try {
        const folderData = data.ProductFolder; 
        const ProductId = data.productId; 
    
        const getProductFolders = await AxiosInstance.get(`/productManage/productFolder/${data.productId}`);

        const filteredFolders = await folderData.filter(folder =>
            getProductFolders.data.body.some(product => product.ProductFolderId === folder.FolderId)
        );

        let fileArr = filteredFolders.length;

        const NoTfilteredFolders = await folderData.filter(folder =>
            !getProductFolders.data.body.some(product => product.ProductFolderId === folder.FolderId)
        );

        console.log(`NoTfilteredFolders:`, NoTfilteredFolders);
        console.log(`filteredFolders:`, filteredFolders);
        

        if (filteredFolders.length !== 0) {
            await AxiosInstance.put(`/productManage/productFolder`,
                filteredFolders.map((folder) => ({
                    ProductFolderId: folder.FolderId,
                    ProductFolderNameTh: folder.FolderNameTH,
                    ProductFolderNameEn: folder.FolderNameEn,
                }))
            );

            await filteredFolders.map(async (folder) => {
                let files = folder.File;
                for (const file of files) {
                    const formData = new FormData();
                    formData.append('ProductFileNameTh', file.File.name);
                    formData.append('ProductFileNameEn', file.File.name);
                    formData.append('ProductFolderId', folder.FolderId);
                    formData.append('ProductFile', file.File.originFileObj);
                    formData.append('Active', true);
                    
                    const createFile = await AxiosInstanceMultipart.post(`/productFile`, formData);
                    console.log('creating file by folder id -->', createFile);
                }
            })
        }

        if (NoTfilteredFolders.length !== 0) {
            const proFolder = NoTfilteredFolders;
            console.log(proFolder);
            
            let i = fileArr;
            for (const folder of proFolder) {
                const createFolder = await AxiosInstance.post('/productfolder', {
                    ProductFolderNameTh: folder.FolderNameEn,
                    ProductFolderNameEn: folder.FolderNameTH,
                    ProductId: ProductId,
                    Active: true,
                    Seq: i++,
                });
                
                let files = folder.File;
                if (files || files.length > 0) {
                    for (const file of files) {
                        const formData = new FormData();
                        formData.append('ProductFileNameTh', file.File.name);
                        formData.append('ProductFileNameEn', file.File.name);
                        formData.append('ProductFolderId', createFolder.data.body.ProductFolderId);
                        formData.append('ProductFile', file.File.originFileObj);
                        formData.append('Active', true);
                        
                        await AxiosInstanceMultipart.post(`/productFile`, formData);
                    }
                }
            }
        }

        return { status: true, data: 'Update Product File Success' };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const deleteProductFile = createAsyncThunk('productsale/getProductById', async (data) => {
    try {
        const FileRemoves = data.FileRemoves; 

        if (FileRemoves.length > 0) {
            FileRemoves.map(async(files) => {
                await AxiosInstance.delete(`/productFile/${files.id}`);
            });
        }

        return { status: true, data: 'Remove Product File Success' };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const deleteProductFolder = createAsyncThunk('productsale/deleteProductFolder', async (data) => {
    try {
        const folders = data.folders;

        if (folders.length > 0) {
            folders.map(async(files) => {
                await AxiosInstance.delete(`/productFolder/${files.id}`);
            })
        }

        return { status: true, data: 'Remove Product Folder Success' };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
})

export const getProductById = createAsyncThunk('productsale/getProductById', async (productId) => {
    try {
        const response = await AxiosInstance.get(`/productsale/product/${productId.productId}`);
        // console.log("getProductById ->", response);

        return { status: true, data: response.data.data };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const editProductById = createAsyncThunk('productsale/editProductById', async (data) => {
    try {
        // console.log(data.ProductData, data.productId);
        
        const updateProduct = await AxiosInstanceMultipart.put(`/productsale/product/${data.productId}`, data.ProductData);
      
        return { status: true, data: updateProduct.data.data };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

export const deleteProductById = createAsyncThunk('productsale/deleteProductById', async (productId) => {
    try {
        const response = await AxiosInstance.delete(`/productsale/product/${productId}`);
        // console.log("deleteProductById ->", response);
        
        return { status: true, data: response.data.body };
    } catch (error) {
        return { status: false, error: error.response?.data?.error || error.message };
    }
});

// Slice สำหรับจัดการ state
const productsaleSlice = createSlice({
    name: 'productsale',
    initialState: {
        allProducts: [],
        singleProduct: null,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status) {
                    state.allProducts = action.payload.data;
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status) {
                    state.allProducts = action.payload.data;
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status) {
                    state.singleProduct = action.payload.data;
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action);
                
                if (action.payload.status) {
                    state.allProducts.push(action.payload.data);
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(editProductById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status) {
                    const updatedProduct = action.payload.data;
                    const index = state.allProducts.findIndex((prod) => prod.ProductId === updatedProduct.ProductId);
                    if (index !== -1) {
                        state.allProducts[index] = updatedProduct;
                    }
                } else {
                    state.error = action.payload.error;
                }
            })
            .addCase(deleteProductById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.status) {
                    const deletedProductId = action.payload.data.ProductId;
                    state.allProducts = state.allProducts.filter((prod) => prod.ProductId !== deletedProductId);
                } else {
                    state.error = action.payload.error;
                }
            });
    },
});

export default productsaleSlice.reducer;