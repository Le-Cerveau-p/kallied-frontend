import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import {
  Briefcase,
  FileText,
  Truck,
  Wrench,
  Layers,
  Monitor,
  CircleCheck,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const servicePillars = [
    {
      icon: Briefcase,
      title: "Consulting and Advisory Services",
      description:
        "Professional consulting and technical advisory support for governance, institutional strengthening and operational improvement.",
    },
    {
      icon: FileText,
      title: "Research and Monitoring & Evaluation",
      description:
        "Research, baseline studies, surveys, feasibility work and impact evaluation that support evidence-based decision-making.",
    },
    {
      icon: Layers,
      title: "Capacity Building and Training",
      description:
        "Structured training and learning programmes that strengthen skills, leadership and institutional performance.",
    },
    {
      icon: Wrench,
      title: "Program Implementation and Technical Assistance",
      description:
        "Implementation support, coordination services and technical assistance for development programmes and institutional reforms.",
    },
    {
      icon: Truck,
      title: "Procurement and Logistics Support",
      description:
        "Sourcing, purchasing, vendor management and logistics coordination delivered with efficiency and quality assurance.",
    },
    {
      icon: Monitor,
      title: "Digital and ICT Solutions",
      description:
        "Technology-enabled tools and information systems that improve organizational efficiency, communication and service delivery.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Understand the Need",
      description: "We listen carefully to the client brief and clarify the expected outcomes.",
    },
    {
      number: "02",
      title: "Design the Approach",
      description: "We shape a practical plan that fits the mandate, scope and timeline.",
    },
    {
      number: "03",
      title: "Deliver the Work",
      description: "Our team executes agreed activities with professionalism and accountability.",
    },
    {
      number: "04",
      title: "Review and Sustain",
      description: "We document results, share lessons and support follow-up improvements.",
    },
  ];

  const scrollToProjects = () => {
    navigate("/projects");
  };

  const scrollToServices = () => {
    navigate("/services");
  };

  const scrollToContact = () => {
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar currentPage="home" />

      {/* Hero Section */}
      <section
        className="relative pt-16 min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #001f54 0%, #003580 100%)",
        }}
      >
        {/* Decorative elements */}
        <div
          className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-10"
          style={{ backgroundColor: "#a7fc00" }}
        />
        <div
          className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: "#4169e1" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            K-Allied Integrated Solutions
            <br />
            <span style={{ color: "#a7fc00" }}>
              Building People. Strengthening Institutions.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            We provide consulting, research, capacity building, procurement and
            program implementation support to government institutions,
            development partners, NGOs and private organizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <button
              onClick={scrollToProjects}
              className="group px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
              style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
            >
              View Projects
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              className="px-8 py-4 rounded-lg font-semibold text-lg text-white border-2 border-white hover:bg-white transition-all duration-300 hover:scale-105"
              style={{ borderColor: "white" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#001f54";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "white";
              }}
              onClick={scrollToServices}
            >
              Explore Services
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/70">
            <div className="flex items-center gap-2">
              <CircleCheck size={20} style={{ color: "#a7fc00" }} />
              <span>CAC-registered in Nigeria</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleCheck size={20} style={{ color: "#a7fc00" }} />
              <span>Government, NGO and private-sector clients</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleCheck size={20} style={{ color: "#a7fc00" }} />
              <span>Evidence-based and results-oriented</span>
            </div>
          </div>
        </div>
      </section>

      {/* Service Pillars Section */}
      <section className="py-20 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#001f54" }}
            >
              Core Service Pillars
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Six practical services designed to strengthen institutions and
              support measurable results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicePillars.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="group p-6 rounded-xl border-2 border-gray-200 hover:border-[#4169e1] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: "#4169e1" }}
                  >
                    <Icon size={28} color="white" />
                  </div>
                  <h3
                    className="text-xl font-semibold mb-3"
                    style={{ color: "#001f54" }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How We Deliver Section */}
      <section
        className="py-20"
        style={{ backgroundColor: "#f8f9fa" }}
        id="how-it-works"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#001f54" }}
            >
              How We Work
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A clear and practical process for delivering credible work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-16 left-full w-full h-0.5 -translate-x-1/2"
                    style={{ backgroundColor: "#4169e1", opacity: 0.2 }}
                  />
                )}

                <div className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4 mx-auto"
                    style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
                  >
                    {step.number}
                  </div>
                  <h3
                    className="text-xl font-semibold mb-3 text-center"
                    style={{ color: "#001f54" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(135deg, #4169e1 0%, #001f54 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              {
                number: "CAC",
                label: "Registered company in Nigeria",
              },
              {
                number: "6",
                label: "Core service pillars",
              },
              {
                number: "7",
                label: "Client categories served",
              },
              {
                number: "100%",
                label: "Commitment to quality and accountability",
              },
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ color: "#a7fc00" }}
                >
                  {stat.number}
                </div>
                <div className="text-lg text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "#001f54" }}
          >
            Ready to discuss your next project?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Let&apos;s work together to design practical, evidence-based
            solutions that support institutional performance and development
            impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToContact}
              className="group px-10 py-5 rounded-lg font-semibold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2"
              style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
            >
              Contact Us
              <ArrowRight
                size={24}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={scrollToContact}
              className="px-10 py-5 rounded-lg font-semibold text-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ borderColor: "#4169e1", color: "#4169e1" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#4169e1";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#4169e1";
              }}
            >
              Request a Consultation
            </button>
          </div>

          {/* <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-gray-500">
            <div className="flex items-center gap-2">
              <CircleCheck size={20} style={{ color: "#4169e1" }} />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleCheck size={20} style={{ color: "#4169e1" }} />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleCheck size={20} style={{ color: "#4169e1" }} />
              <span>Cancel anytime</span>
            </div>
          </div> */}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

