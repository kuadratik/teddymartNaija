import {BusinessIndustryTopLevel} from '@/types/business'
import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['categoryApi', 'IndustryApi']
})

export const CategoryEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    getAllCategories: build.query<
      any,
      {
        type: string
      }
    >({
      query: arg => {
        const {type} = arg
        const params: {[key: string]: string} = {
          type
        }

        return {
          url: `/front/category`,
          method: 'GET',
          params
        }
      },
      providesTags: ['categoryApi']
    }),
    getRecordInteraction: build.query<
      any,
      {
        interactUid: string
        category: string
      }
    >({
      query: arg => {
        const {interactUid, category} = arg

        return {
          url: `/front/record-interaction/${category}`,
          method: 'GET',
          headers: {
            interactUid: interactUid
          }
        }
      },
      providesTags: ['categoryApi']
    }),

    getAllIndustries: build.query<BusinessIndustryTopLevel, {}>({
      query: arg => {
        return {
          url: `/front/business-industries`,
          method: 'GET'
        }
      },
      providesTags: ['IndustryApi']
    })
  }),
  overrideExisting: true
})

export const {useGetAllCategoriesQuery, useGetRecordInteractionQuery, useGetAllIndustriesQuery} = CategoryEndpoint
