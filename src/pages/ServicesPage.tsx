import { useEffect, useRef, useState } from "react";
import Navbar from "../components/NavBar";
import {
  Lightbulb,
  FileSearch,
  BarChart3,
  Package,
  FileCheck,
  Rocket,
  Handshake,
  MonitorSmartphone,
  Building2,
  ShoppingCart,
  Briefcase,
} from "lucide-react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function ServicesPage() {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(),
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => {
      observerRef.current?.observe(section);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const services = [
    {
      icon: Lightbulb,
      title: "Consulting & Advisory Services",
      items: [
        "Governance and public sector consulting",
        "Public policy advisory",
        "Education sector consulting",
        "Social development advisory",
        "Organizational strengthening and restructuring",
        "Program and project design support",
        "Systems improvement consulting",
        "Institutional capacity-building services",
      ],
    },
    {
      icon: FileSearch,
      title: "Research & Analytical Services",
      items: [
        "Baseline studies",
        "Needs assessments",
        "Surveys and data collection",
        "Feasibility studies",
        "Data analysis and statistical reporting",
        "Monitoring and evaluation (M&E)",
        "Impact assessments",
        "Evidence-based reporting for government, NGOs, donors, and private clients",
      ],
    },
    {
      icon: BarChart3,
      title: "Project Performance & Decision-Support Services",
      items: [
        "Analytical studies and performance reviews",
        "Project monitoring and performance audits",
        "Data-driven reporting and dashboards",
        "Decision-support analytics for policy and program implementation",
      ],
    },
    {
      icon: Package,
      title: "Procurement & Supply Chain Services",
      items: [
        "Sourcing and purchasing of goods and equipment",
        "Logistics and distribution support",
        "Vendor identification and management",
        "Quality assurance and compliance checks",
        "Supply of materials for public, private, and development projects",
      ],
    },
    {
      icon: FileCheck,
      title: "Contracting & Implementation Services",
      items: [
        "Execution of service contracts",
        "Project delivery and implementation support",
        "Technical assistance for development programs",
        "Provision of specialized technical services",
      ],
    },
    {
      icon: Rocket,
      title: "Program & Development Management",
      items: [
        "Design and management of development programs",
        "Institutional reform initiatives",
        "Governance system strengthening",
        "Community support and social impact programs",
        "Capacity-building and training activities",
      ],
    },
    {
      icon: Handshake,
      title: "Collaboration & Partnership Services",
      items: [
        "Joint project delivery with government agencies",
        "Collaboration with donor organizations and development partners",
        "Partnerships with NGOs and civil society groups",
        "Multi-sector program implementation and technical assistance",
      ],
    },
    {
      icon: MonitorSmartphone,
      title: "Digital, ICT & Knowledge Management Services",
      items: [
        "Digital transformation and ICT solutions",
        "Data management systems and platforms",
        "Communication and documentation support",
        "Knowledge management and organizational learning systems",
        "Technology-enabled consulting services",
      ],
    },
    {
      icon: Building2,
      title: "Facilities, Equipment & Operational Support",
      items: [
        "Acquisition and leasing of facilities and equipment",
        "Operation and maintenance of research, training, and consulting infrastructure",
        "Provision of operational resources for project execution",
      ],
    },
    {
      icon: ShoppingCart,
      title: "General Merchandise & Supplies",
      items: [
        "Supply of general goods and materials",
        "Merchandise and contractual services supporting consulting, research, and procurement operations",
      ],
    },
    {
      icon: Briefcase,
      title: "Other Related Business Services",
      items: [
        "Any lawful business activities that complement or enhance the company's consulting, research, procurement, or development-sector operations",
      ],
    },
  ];

  const scrollToContact = () => {
    navigate("/contact");
  };

  const scrollToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar currentPage="services" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#001f54] via-[#003380] to-[#4169e1] text-white pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            id="hero-section"
            data-animate
            className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
              visibleSections.has("hero-section")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight">
              Our <span className="text-[#d4ed31]">Services</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8">
              Comprehensive Solutions for Development, Consulting & Procurement
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto">
              K-ALLIED INTEGRATED SOLUTIONS LTD provides high-quality
              consulting, research, procurement, and project implementation
              services to government institutions, donor agencies, NGOs, and
              private organizations.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  id={`service-${index}`}
                  data-animate
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100 ${
                    visibleSections.has(`service-${index}`)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${(index % 4) * 100}ms` }}
                >
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#4169e1] to-[#001f54] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[#001f54] mb-2 group-hover:text-[#4169e1] transition-colors">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#d4ed31] mt-2"></div>
                          <span className="text-gray-700 text-sm leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-[#4169e1] via-[#d4ed31] to-[#001f54] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#001f54] to-[#4169e1] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div
            id="cta-section"
            data-animate
            className={`transition-all duration-1000 ${
              visibleSections.has("cta-section")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">
              Ready to Transform Your Organization?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Partner with K-ALLIED INTEGRATED SOLUTIONS LTD for comprehensive
              consulting, research, and development services tailored to your
              needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-4 bg-[#d4ed31] text-[#001f54] rounded-xl hover:bg-[#c5de22] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                onClick={scrollToSignup}
              >
                Get Started Today
              </button>
              <button
                className="px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                onClick={scrollToContact}
              >
                Schedule a Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Sectors Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div
            id="sectors-section"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.has("sectors-section")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl text-[#001f54] mb-4">
              Sectors We <span className="text-[#4169e1]">Serve</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide specialized services across multiple sectors to drive
              sustainable development and organizational excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Government & Public Sector",
              "International Development",
              "Education",
              "Social Development",
              "Healthcare",
              "Agriculture",
              "Infrastructure",
              "Private Sector",
              "Civil Society & NGOs",
            ].map((sector, index) => (
              <div
                key={index}
                id={`sector-${index}`}
                data-animate
                className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#4169e1] group hover:border-[#d4ed31] ${
                  visibleSections.has(`sector-${index}`)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${(index % 3) * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#d4ed31]"></div>
                  <h3 className="text-lg text-[#001f54] group-hover:text-[#4169e1] transition-colors">
                    {sector}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
