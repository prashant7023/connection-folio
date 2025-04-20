"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Megaphone } from "lucide-react"
import AnnouncementPopup from "./announcement-popup"

export default function AnnouncementButton() {
  const [hasAnnouncements, setHasAnnouncements] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  // Check if there are announcements in the API
  useEffect(() => {
    const checkAnnouncements = async () => {
      try {
        const response = await fetch(
          `https://connection-folio-1.onrender.com/api/announcements`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch announcements")
        }

        const data = await response.json()
        setHasAnnouncements(data.length > 0)
      } catch (err) {
        console.error("Error checking announcements:", err)
      }
    }

    checkAnnouncements()
  }, [])

  // Set up interval to check for new announcements
  useEffect(() => {
    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `https://connection-folio-1.onrender.com/api/announcements`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch announcements")
        }

        const data = await response.json()
        setHasAnnouncements(data.length > 0)
      } catch (err) {
        console.error("Error checking announcements:", err)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(checkInterval)
  }, [])

  if (!hasAnnouncements) {
    return null
  }

  return (
    <>
      <Button variant="ghost" size="icon" className="relative" onClick={() => setShowPopup(true)}>
        <Megaphone className="h-5 w-5" />
        {/* Notification dot */}
        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
      </Button>

      {showPopup && <AnnouncementPopup onClose={() => setShowPopup(false)} />}
    </>
  )
}
