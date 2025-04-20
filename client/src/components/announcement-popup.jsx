"use client"

import { useState, useEffect } from "react"
import { X, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

// Add keyframes for animations
const fadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 0.5; }
  }
  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`

export default function AnnouncementPopup({ onClose }) {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  // Load announcements from API on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL}/api/announcements`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch announcements")
        }

        const data = await response.json()
        setAnnouncements(data)
      } catch (err) {
        console.error("Error loading announcements:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  // No announcements or still loading, don't render anything
  if (announcements.length === 0 || loading) {
    return null
  }

  // Get the icon based on announcement type
  const getIcon = (type) => {
    switch (type) {
      case "info":
        return <Info className="h-6 w-6 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "error":
        return <AlertTriangle className="h-6 w-6 text-red-500" />
      default:
        return <Info className="h-6 w-6 text-blue-500" />
    }
  }

  // Get background color based on type
  const getBackgroundStyle = (type) => {
    switch (type) {
      case "info":
        return "bg-blue-50 border-blue-200"
      case "warning":
        return "bg-amber-50 border-amber-200"
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fadeIn }} />
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out bg-slate-500 bg-opacity-50"
        style={{
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        <div
          className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[80vh]"
          style={{
            animation: "scaleIn 0.3s ease-out",
          }}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-slate-800">Announcements</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-slate-600"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-grow">
            <div className="p-4 space-y-4">
              {announcements.map((announcement, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getBackgroundStyle(announcement.type)}`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">{getIcon(announcement.type)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800">{announcement.title}</h3>
                      <p className="mt-2 text-slate-700">{announcement.message}</p>
                      <div className="mt-2 text-xs text-slate-500">
                        <p>
                          Posted by {announcement.creatorName} on {new Date(announcement.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </>
  )
}
