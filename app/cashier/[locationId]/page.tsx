"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import api from "@/utils/axios"

export default function LocationCashierRedirect() {
  const params = useParams()
  const router = useRouter()
  const locationId = params?.locationId as string
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLocationAndRedirect = async () => {
      try {
        setLoading(true)
        
        // Fetch location details to get the catalog information
        const locationResponse = await api.get(`/locations/${locationId}`)
        const location = locationResponse.data.data
        
        // Fetch the catalog for this location
        const catalogsResponse = await api.get(`/catalogs?companyId=${location.companyId}`)
        const catalogs = catalogsResponse.data.data || []
        
        if (catalogs.length > 0) {
          // Use the first catalog (or you can implement logic to choose the right one)
          const catalog = catalogs[0]
          
          // Fetch categories for this catalog
          const categoriesResponse = await api.get(`/catalogs/${catalog.id}/categories`)
          const categories = categoriesResponse.data.data || []
          
          if (categories.length > 0) {
            // Redirect to cashier page with catalog and first category
            const redirectUrl = `/catalogs/${catalog.id}/categories/${categories[0].id}/products`
            router.push(redirectUrl)
          } else {
            // Redirect to cashier page with just the catalog
            const redirectUrl = `/catalogs/${catalog.id}/categories`
            router.push(redirectUrl)
          }
        } else {
          // No catalogs found, redirect to general cashier page
          router.push('/cashier')
        }
        
      } catch (err: any) {
        console.error('Error fetching location data:', err)
        setError(err?.response?.data?.message || "Failed to load location data")
        // Fallback to general cashier page
        setTimeout(() => {
          router.push('/cashier')
        }, 2000)
      } finally {
        setLoading(false)
      }
    }

    if (locationId) {
      fetchLocationAndRedirect()
    }
  }, [locationId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading location catalog...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error: {error}</p>
          <p className="text-gray-600">Redirecting to cashier page...</p>
        </div>
      </div>
    )
  }

  return null
}
