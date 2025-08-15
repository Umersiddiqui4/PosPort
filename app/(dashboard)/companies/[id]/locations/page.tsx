

"use client"

import { useParams } from "next/navigation"
import Locations from "@/components/location"

export default function CompanyLocationsPage() {
  const params = useParams() || {}
  const locationId = (params && (params as any).id) ? (params as any).id as string : ""

  return <Locations companyId={locationId} />
}
