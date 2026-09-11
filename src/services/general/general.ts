import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['generalApi']
})

export const GeneralEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    uploadImageFile: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `/front/file-upload`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['generalApi']
    }),

    getRecommendedStores: build.query<
      any,
      {
        uuid: string
      }
    >({
      query: arg => {
        const {uuid} = arg
        const params: {[key: string]: string} = {}

        return {
          url: `/front/stores/recommended-stores`,
          method: 'GET',
          headers: {
            interactUid: uuid
          }
        }
      },
      providesTags: ['generalApi']
    })
  }),

  overrideExisting: true
})

export const {useUploadImageFileMutation, useGetRecommendedStoresQuery} = GeneralEndpoint
