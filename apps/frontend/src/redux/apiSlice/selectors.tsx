import {createSelector} from '@reduxjs/toolkit'
import { AppState } from '../store'


// Create a selector that gets the arguments needed for the searchStoreListing query
export const selectSearchStoreListingArgs = createSelector(
  [
    (state: AppState) => state.country.selectedLanguage,
    (state: AppState) => state.vendor.type,
    (_: AppState, countryId?: number) => countryId,
    (_: AppState, _2?: number, categoryIds?: number[]) => categoryIds
  ],
  (selectedLanguage, type, countryId, categoryIds) => ({
    currency: selectedLanguage?.value,
    listType: type,
    country_id: countryId,
    category: categoryIds
  })
)

// Create selectors for other common API arguments
export const selectBestDealsArgs = createSelector(
  [(state: AppState) => state.country.selectedLanguage],
  selectedLanguage => ({
    currency: selectedLanguage?.value
  })
)

export const selectTodayDealsArgs = createSelector(
  [(state: AppState) => state.country.selectedLanguage],
  selectedLanguage => ({
    currency: selectedLanguage?.value,
    limit: 3
  })
)
