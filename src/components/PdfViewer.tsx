import { useEffect, useRef } from "react"
import {
  getDocument,
  GlobalWorkerOptions,
} from "pdfjs-dist"
import {
  PDFViewer,
  EventBus,
} from "pdfjs-dist/web/pdf_viewer.mjs"

import "pdfjs-dist/web/pdf_viewer.css"

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js"

export default function PdfViewer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !viewerRef.current) return

    const eventBus = new EventBus()

    const pdfViewer = new PDFViewer({
      container: containerRef.current,
      viewer: viewerRef.current,
      eventBus,
      textLayerMode: 0,
      removePageBorders: true,
    })

    let cancelled = false

    getDocument(url).promise.then(pdf => {
      if (!cancelled) {
        pdfViewer.setDocument(pdf)
      }
    })

    return () => {
      cancelled = true
      pdfViewer.cleanup()
    }
  }, [url])

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        overflow: "auto",
      }}
    >
      <div ref={viewerRef} className="pdfViewer" />
    </div>
  )
}
