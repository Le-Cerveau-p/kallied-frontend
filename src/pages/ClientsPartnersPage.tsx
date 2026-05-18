import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { Building2, HeartHandshake, LayoutGrid, Users, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

const clientTypes = [
  "Government ministries, departments, and agencies",
  "Development partners and donor organizations",
  "NGOs and civil society organizations",
  "Private sector organizations",
  "Educational and research institutions",
  "Community-based organizations",
];

const trustSignals = [
  "CAC-registered company profile",
  "Clear service scope and professional positioning",
  "Public contact details and physical address",
  "Structured space for references, logos and testimonials",
];

const partnerTiles = [
  "Verified client logo",
  "Verified partner logo",
  "Institution reference",
  "Project sponsor",
  "Development partner",
  "Research partner",
];

export default function ClientsPartnersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="clients" />

      <main className="pt-24">
        <section
          className="relative overflow-hidden text-white"
          style={{
            background:
              "linear-gradient(135deg, #001f54 0%, #083a8c 55%, #4169e1 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,_#a7fc00_0,_transparent_30%),radial-gradient(circle_at_bottom_left,_#ffffff_0,_transparent_24%)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold" style={{ backgroundColor: "#a7fc00", color: "#001f54" }}>
                <HeartHandshake size={16} />
                Clients and Partners
              </div>
              <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
                Organizations and institutions K-Allied is ready to serve
              </h1>
              <p className="mt-6 max-w-3xl text-lg md:text-2xl text-white/90 leading-relaxed">
                This page communicates the sectors and organization types the
                firm is positioned to support, with space for approved client
                references, partner marks and testimonials as they are added.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4169e1]">
                  We Work With
                </p>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#001f54]">
                  Client categories
                </h2>
                <div className="mt-6 space-y-4">
                  {clientTypes.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-xl border border-gray-200 bg-[#f8f9fa] p-4"
                    >
                      <Users className="mt-0.5 shrink-0 text-[#4169e1]" size={20} />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4169e1]">
                  Credibility Signals
                </p>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#001f54]">
                  Core trust markers for the public profile
                </h2>
                <div className="mt-6 space-y-4">
                  {trustSignals.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4"
                    >
                      <BadgeCheck className="mt-0.5 shrink-0 text-[#4169e1]" size={20} />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4169e1]">
                Logos and Recognition
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#001f54]">
                Reference and recognition area
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {partnerTiles.map((tile) => (
                <div
                  key={tile}
                  className="flex h-36 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-sm font-semibold text-gray-500"
                >
                  <div className="text-center">
                    <LayoutGrid className="mx-auto mb-3 text-[#4169e1]" size={28} />
                    {tile}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Building2 className="mx-auto text-[#4169e1]" size={44} />
            <h2 className="mt-5 text-3xl md:text-4xl font-bold text-[#001f54]">
              A page built to grow with the firm
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              As partnerships, references and testimonials are approved for
              publication, they can be added here without changing the page
              structure.
            </p>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl px-6 py-4 font-semibold text-[#001f54]"
                style={{ backgroundColor: "#a7fc00" }}
              >
                Share a Reference or Introduction
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
