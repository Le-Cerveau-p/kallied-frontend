import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Zap,
  Lock,
  Users,
  Globe,
  ChartBar,
  Bell,
  Workflow,
  Clock,
  Cloud,
  Smartphone,
  Headphones,
  Database,
  Layers,
  RefreshCw,
  FileText,
  Code,
  Settings,
} from "lucide-react";

export default function FeaturesPage() {
  const navigate = useNavigate();
  const mainFeatures = [
    {
      icon: Shield,
      title: "Advanced Security",
      description:
        "Integrated CCTV, access control, perimeter protection and secure monitoring solutions designed to safeguard people, assets and facilities.",
      highlight: "End-to-end security architecture",
    },
    {
      icon: Zap,
      title: "Reliable System Performance",
      description:
        "Robust infrastructure and carefully engineered deployments ensure stable, high-performance systems that operate smoothly when they matter most.",
      highlight: "Optimized system reliability",
    },
    {
      icon: Cloud,
      title: "Cloud & On-Prem Integration",
      description:
        "Flexible deployment options across cloud, hybrid and on-prem environments — allowing organizations to operate securely from anywhere.",
      highlight: "Secure hybrid deployments",
    },
    {
      icon: Users,
      title: "Collaboration & Control",
      description:
        "Central dashboards, role-based permissions and shared workspaces enable teams, administrators and partners to work together efficiently.",
      highlight: "Centralized management",
    },
    {
      icon: ChartBar,
      title: "Analytics & Reporting",
      description:
        "Project tracking, performance metrics and operational insights help leaders make informed technical and business decisions.",
      highlight: "Actionable insights",
    },
    {
      icon: Workflow,
      title: "Process Automation",
      description:
        "Automated notifications, approvals and task processes reduce manual work and improve operational consistency.",
      highlight: "Streamlined workflows",
    },
  ];

  const additionalFeatures = [
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Automatic alerts for system events, project milestones, security incidents and approvals.",
    },
    {
      icon: Lock,
      title: "Role-Based Access",
      description:
        "Controlled permissions ensure staff, clients and administrators access only what they need.",
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description:
        "Monitor systems, review projects and access dashboards from any device.",
    },
    {
      icon: Database,
      title: "Automated Backups",
      description:
        "Secure backup and recovery processes protect critical project records and system data.",
    },
    {
      icon: RefreshCw,
      title: "Continuous Updates",
      description:
        "Regular feature updates and improvements deployed automatically with zero downtime.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support via chat, email, and phone from our expert team.",
    },
    {
      icon: Layers,
      title: "Multiple Projects",
      description:
        "Manage unlimited projects and workspaces within a single account.",
    },
    {
      icon: Settings,
      title: "Customization",
      description:
        "Solutions tailored to the specific needs of different organizations and environments.",
    },
  ];

  const integrations = [
    { name: "Slack", category: "Communication" },
    { name: "Google Workspace", category: "Productivity" },
    { name: "Microsoft Teams", category: "Communication" },
    { name: "Salesforce", category: "CRM" },
    { name: "Stripe", category: "Payments" },
    { name: "Zapier", category: "Automation" },
    { name: "GitHub", category: "Development" },
    { name: "Dropbox", category: "Storage" },
  ];

  const scrollToContact = () => {
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar currentPage="features" />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ color: "#001f54" }}
          >
            Solutions Built for
            <br />
            <span style={{ color: "#4169e1" }}>Real-World Operations</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our platform and services combine secure technology, reliable
            infrastructure and professional support — designed to help
            organizations work smarter, safer and more efficiently.
          </p>
          <div
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
            style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
          >
            ✨ Trusted solutions across multiple industries
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#001f54" }}
            >
              Core Features
            </h2>
            <p className="text-lg text-gray-600">
              The essential capabilities that power your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#4169e1] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer overflow-hidden"
                >
                  {/* Hover gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, #4169e1 0%, #001f54 100%)",
                    }}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: "#4169e1" }}
                    >
                      <Icon size={32} color="white" />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-2xl font-bold mb-3"
                      style={{ color: "#001f54" }}
                    >
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    {/* Highlight Badge */}
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#001f54]" />
                      {feature.highlight}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-16" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#001f54" }}
            >
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600">
              Plus dozens more features to help you succeed
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100 hover:border-[#4169e1]"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: "#4169e120" }}
                  >
                    <Icon size={24} style={{ color: "#4169e1" }} />
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "#001f54" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#001f54" }}
            >
              Seamless Integrations
            </h2>
            <p className="text-lg text-gray-600">
              Connect with tools and platforms your organization already relies
              on.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#4169e1] transition-all duration-300 hover:shadow-lg text-center cursor-pointer"
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: "#4169e1" }}
                >
                  {integration.name.charAt(0)}
                </div>
                <h3 className="font-semibold mb-1" style={{ color: "#001f54" }}>
                  {integration.name}
                </h3>
                <p className="text-sm text-gray-500">{integration.category}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">
              More integrations and custom connectors available on request.
            </p>
            <button
              className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: "#4169e1", color: "white" }}
            >
              View All Integrations
            </button>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#001f54" }}
            >
              What You Get With Our Solutions
            </h2>
            <p className="text-lg text-gray-600">
              Reliable capabilities built into every deployment.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Secure user access controls",
                "Project tracking dashboards",
                "Incident and activity logs",
                "Customizable reports",
                "Data backup and recovery",
                "Integration support",
                "Operational analytics",
                "Technical support assistance",
                "Role-based permissions",
                "Client communication tools",
                "Document and file management",
                "Ongoing maintenance options",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#a7fc00" }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                        stroke="#001f54"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "#001f54" }}
          >
            Ready to See How Our Solutions Can Help?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Speak with our team to discuss your project requirements and explore
            the right solution for your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
              onClick={scrollToContact}
            >
              Request Consultation
            </button>
            <button
              className="px-10 py-4 rounded-lg font-semibold text-lg border-2 transition-all duration-300 hover:scale-105"
              style={{ borderColor: "#4169e1", color: "#4169e1" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#4169e1";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#4169e1";
              }}
              onClick={scrollToContact}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
