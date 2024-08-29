import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { FILTER_COUNTRY_BY_CODE, FILTER_COUNTRY_BY_NAME, LIST_COUNTRIES } from '../graphql/queries'
import { type Country } from '@/types'
import { useQuery } from '@vue/apollo-composable'

export const useCountriesStore = defineStore('countries', () => {
  const storedCountries = localStorage.getItem('countries')
  const router = useRouter()
  const filteredCountries = ref<Array<Country>>([])
  const countries = ref<Array<Country>>(storedCountries)
  const country = ref<Country>({})
  const variables = ref<Country>({})
  const loading = ref<boolean>(true)

  const setAllCountries = () => {
    if (storedCountries) {
      countries.value = JSON.parse(storedCountries)
      loading.value = false
      return
    }
    const { result, loading: isLoading } = useQuery(LIST_COUNTRIES)

    watch(result, (newVal) => {
      console.log('TCL: setAllCountries -> newVal', newVal)
      if (newVal.countries) {
        countries.value = [...newVal.countries]
        loading.value = isLoading.value
        countries.value.length && localStorage.setItem('countries', JSON.stringify(countries.value))
      }
    })
  }

  const resetAllFilters = () => {
    filteredCountries.value = []
  }

  const routerNavigator = (country?: object, routeName?: string) => {
    if (!Object.keys(country).length) {
      router.push({
        name: routeName // Use the name of the route
      })
      return
    }
    router.push({
      name: routeName, // Use the name of the route
      query: { country: encodeURI(JSON.stringify(country)) } // Pass the country code directly as a param
    })
  }

  const filterByCountryCodeOrName = (inputParam: string) => {
    if (inputParam.length == 2) {
      variables.value.code = inputParam.toUpperCase()
      const { result, loading } = useQuery(FILTER_COUNTRY_BY_CODE, variables)
      watch(
        result,
        (newVal: any) => {
          if (Object.keys(newVal).length > 0) {
            filteredCountries.value = [...newVal.countries]
          }
        },
        { deep: true }
      )
    }

    if (inputParam.length > 2) {
      const firstLetter = inputParam.charAt(0)

      const firstLetterCap = firstLetter.toUpperCase()

      const remainingLetters = inputParam.slice(1)

      const capitalizedWord = firstLetterCap + remainingLetters

      variables.value.name = capitalizedWord

      const { result, loading } = useQuery(FILTER_COUNTRY_BY_NAME, variables)

      watch(
        result,
        (newVal: any) => {
          if (Object.keys(newVal).length > 0) {
            filteredCountries.value = [...newVal.countries]
          }
        },
        { deep: true }
      )
    }
  }

  return {
    country,
    countries,
    loading,
    filteredCountries,
    resetAllFilters,
    setAllCountries,
    routerNavigator,
    filterByCountryCodeOrName
  }
})
