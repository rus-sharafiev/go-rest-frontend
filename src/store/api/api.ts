import { createApi } from '@reduxjs/toolkit/query/react'
import fatchApi, { ApiRoutes } from '../../utils'
// @types

// --------------------------------------------------------------------------------

interface Item {
    id: number
}

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fatchApi.baseQuery,
    keepUnusedDataFor: 10 * 60,
    tagTypes: ['Item'],
    endpoints: (builder) => ({

        getAll: builder.query<Item[], void>({
            query: () => ({ url: ApiRoutes.ITEMS }),
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Item' as const, id })), 'Item']
                    : ['Item']
        }),

        getOne: builder.query<Item, string | undefined>({
            query: (id) => ({ url: `${ApiRoutes.ITEMS}/${id}` }),
            providesTags: (result) =>
                result ? [{ type: 'Item' as const, id: result.id }] : ['Item']
        }),

        create: builder.mutation<Item, string | undefined>({
            query: (payload) => ({
                url: ApiRoutes.ITEMS,
                method: 'POST',
                body: payload
            }),
            invalidatesTags: ['Item']
        }),

        update: builder.mutation<Item, { id: number, payload: unknown }>({
            query: ({ id, payload }) => ({
                url: `${ApiRoutes.ITEMS}/${id}`,
                method: 'PATCH',
                body: payload
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Item', id: arg.id }]
        }),

        delete: builder.mutation<Item, string | undefined>({
            query: (id) => ({
                url: `${ApiRoutes.ITEMS}/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Item']
        }),

    }),
})

export const {
    useGetAllQuery,
    useGetOneQuery,
    useCreateMutation,
    useUpdateMutation,
    useDeleteMutation
} = api