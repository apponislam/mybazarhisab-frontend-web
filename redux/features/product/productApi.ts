import { baseApi } from "../../api/baseApi";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TProduct = {
    _id: string;
    name: string;
    photo?: string;
    is18Plus?: boolean;
    description?: string;
    user: string | { _id: string; name: string; email: string; phone?: string; profileImage?: string };
    isEdited?: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
};

export type TMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};

type CommonResponse<T = null> = {
    success: boolean;
    message: string;
    data: T;
    meta?: TMeta;
};

export type ProductQueryParams = {
    searchTerm?: string;
    page?: number;
    limit?: number;
};

export type CreateProductPayload = {
    name: string;
    photo?: string;
    is18Plus?: boolean;
    description?: string;
};

export type MergeProductsPayload = {
    sourceProductId: string;
    targetProductId: string;
};

// ── API ────────────────────────────────────────────────────────────────────────

const productApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // POST /products
        createProduct: builder.mutation<CommonResponse<TProduct>, CreateProductPayload>({
            query: (body) => ({
                url: "/products",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Product"],
        }),

        // POST /products/merge (Admin)
        mergeProducts: builder.mutation<CommonResponse, MergeProductsPayload>({
            query: (body) => ({
                url: "/products/merge",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Product"],
        }),

        // GET /products
        getAllProducts: builder.query<CommonResponse<TProduct[]>, ProductQueryParams | void>({
            query: (params) => ({
                url: "/products",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["Product"],
        }),

        // GET /products/:id
        getProductById: builder.query<CommonResponse<TProduct>, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Product", id }],
        }),

        // PATCH /products/:id
        updateProduct: builder.mutation<CommonResponse<TProduct>, { id: string; data: Partial<CreateProductPayload> }>({
            query: ({ id, data }) => ({
                url: `/products/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Product"],
        }),

        // DELETE /products/:id
        deleteProduct: builder.mutation<CommonResponse<TProduct>, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),
        // GET /bazar-entries/products (Group Unique Products)
        getGroupProducts: builder.query<CommonResponse<TProduct[]>, ProductQueryParams | void>({
            query: (params) => ({
                url: "/bazar-entries/products",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["Product"],
        }),
    }),
});

export const { useCreateProductMutation, useMergeProductsMutation, useGetAllProductsQuery, useGetGroupProductsQuery, useGetProductByIdQuery, useUpdateProductMutation, useDeleteProductMutation } = productApi;
