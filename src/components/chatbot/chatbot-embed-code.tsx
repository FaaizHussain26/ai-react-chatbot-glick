"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

type Props = {
  chatbotId: string
  kbId?: string | null
  baseUrl?: string
  embedPath?: string
  width?: string | number
  height?: string | number
}

export function ChatbotEmbedCode({
  chatbotId,
  kbId,
  baseUrl,
  embedPath = "/",
  width = "100%",
  height = 600,
}: Props) {
  const resolvedBaseUrl = React.useMemo(() => {
    if (baseUrl && baseUrl.trim().length > 0) return baseUrl
    if (typeof window !== "undefined") return window.location.origin
    return process.env.NEXT_PUBLIC_EMBED_BASE_URL || ""
  }, [baseUrl])

  const src = React.useMemo(() => {
    const url = new URL((resolvedBaseUrl || "") + embedPath, resolvedBaseUrl || undefined)
    url.searchParams.set("chatbotId", chatbotId)
    if (kbId) url.searchParams.set("kbId", kbId)
    return url.toString()
  }, [resolvedBaseUrl, embedPath, chatbotId, kbId])

  const iframeCode = React.useMemo(() => {
    const w = typeof width === "number" ? String(width) : width
    const h = typeof height === "number" ? String(height) : height
    // Keep attributes simple and accessible; allow host page to style further.
    return `<iframe src="${src}" width="${w}" height="${h}" frameborder="0" title="chatbot"></iframe>`
  }, [src, width, height])

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied`)
    } catch {
      // fallback: select text if clipboard fails
      toast.error(`Failed to copy ${label}. You can select and copy manually.`)
    }
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
      </div>

      <div className="space-y-1">
        <Label htmlFor={`embed-iframe-${chatbotId}`} className="text-sm">
          Iframe Code
        </Label>
        <Textarea id={`embed-iframe-${chatbotId}`} value={iframeCode} readOnly rows={3} />
        <div className="flex justify-end">
          <Button type="button" onClick={() => copy(iframeCode, "iframe code")} aria-label="Copy iframe code">
            Copy Iframe
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatbotEmbedCode
