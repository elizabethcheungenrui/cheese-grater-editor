import Header from './Header.tsx'
import Home from './Home.tsx'
import Footer from './Footer.tsx'
import BestPub2025 from './BestPub2025.tsx'

export default function HomePage() {
  return (
    <div className="page-container">
      <Header />
      <Home />
      <BestPub2025 />
      <Footer />
    </div>
  );
}
