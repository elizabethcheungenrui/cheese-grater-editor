import { useParams } from "react-router-dom"
import { useIsMobile } from "../../hooks/useIsMobile"
import HeaderMobile from "../header-footer/HeaderMobile"
import HeaderDesktop from "../header-footer/HeaderDesktop"
import PdfViewer from "../../components/PdfViewer"
import Footer from "../header-footer/Footer"

export default function PrintEditionViewer() {
  const { slug } = useParams<{ slug: string }>()
  const isMobile = useIsMobile()

  if (!slug) return <p>Invalid issue.</p>

  const pdfUrl =
    `https://lrhddyosfvnhpxojsjpa.supabase.co/storage/v1/object/public/past-issues/${slug}.pdf`

  return (
    <div className={isMobile ? "page-mobile" : "page-desktop"}>
      {isMobile ? <HeaderMobile /> : <HeaderDesktop />}

      <PdfViewer url={pdfUrl} />

      <Footer />
    </div>
  )
}
