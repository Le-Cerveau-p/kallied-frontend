import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import {
  Target,
  Eye,
  Heart,
  Lightbulb,
  Users,
  Award,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
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

  const values = [
    {
      icon: Target,
      title: "Purpose Led",
      description:
        "We build solutions that solve critical real-life challenges in security, technology and infrastructure.",
    },
    {
      icon: Heart,
      title: "Service Excellence",
      description:
        "We listen, understand and partner with our clients to deliver exactly what they need.",
    },
    {
      icon: Lightbulb,
      title: "Practical Innovation",
      description:
        "We apply technology wisely — choosing solutions that work reliably in real environments.",
    },
    {
      icon: Award,
      title: "Integrity & Quality",
      description:
        "We deliver work we are proud of, built on honesty, professionalism and consistency.",
    },
  ];

  const timeline = [
    {
      year: "2019",
      title: "Company Established",
      description:
        "K-Allied was founded to provide reliable alternative solutions in security, ICT and infrastructure support.",
    },
    {
      year: "2020",
      title: "First Major Contracts",
      description:
        "Delivered our earliest security and ICT deployment projects across government and private sector clients.",
    },
    {
      year: "2021",
      title: "Service Expansion",
      description:
        "Introduced power backup solutions, procurement support and specialized consulting.",
    },
    {
      year: "2022",
      title: "Strategic Partnerships",
      description:
        "Formed key partnerships to improve service capability and technical depth.",
    },
    {
      year: "2023",
      title: "Project Diversification",
      description:
        "Handled multi-disciplinary projects across security systems, ICT networks, energy support and procurement.",
    },
    {
      year: "2024",
      title: "Strengthening Our Operations",
      description:
        "Focused on refining processes, training teams and preparing for long-term growth.",
    },
  ];

  const team = [
    {
      name: "Sarah Mitchell",
      role: "CEO & Co-Founder",
      bio: "Former VP of Product at a leading SaaS company with 15+ years in tech.",
      initials: "SM",
      color: "#4169e1",
    },
    {
      name: "David Chen",
      role: "CTO & Co-Founder",
      bio: "Ex-Google engineer with expertise in distributed systems and security.",
      initials: "DC",
      color: "#001f54",
    },
    {
      name: "Emily Rodriguez",
      role: "VP of Engineering",
      bio: "Built engineering teams at multiple successful startups, CS PhD from MIT.",
      initials: "ER",
      color: "#4169e1",
    },
    {
      name: "Michael Thompson",
      role: "VP of Product",
      bio: "Product leader with a track record of launching products used by millions.",
      initials: "MT",
      color: "#001f54",
    },
    {
      name: "Jessica Park",
      role: "VP of Customer Success",
      bio: "Expert in building world-class customer experience programs.",
      initials: "JP",
      color: "#4169e1",
    },
    {
      name: "Alex Kumar",
      role: "VP of Design",
      bio: "Award-winning designer focused on creating intuitive user experiences.",
      initials: "AK",
      color: "#001f54",
    },
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "150+", label: "Countries" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ];

  const scrollToContact = () => {
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar currentPage="about" />

      {/* Hero Section - Mission Statement */}
      <section className="pt-24 pb-16 bg-white" id="hero" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center transition-all duration-1000 ${
              visibleSections.has("hero")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: "#a7fc00" }}
            >
              <Sparkles size={18} style={{ color: "#001f54" }} />
              <span className="font-semibold" style={{ color: "#001f54" }}>
                About Us
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: "#001f54" }}
            >
              Building Trusted Solutions for
              <br />
              <span style={{ color: "#4169e1" }}>
                Security, Technology and Infrastructure
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              K-Allied Integrated Solutions delivers reliable, practical and
              secure solutions across ICT, security systems, power, procurement
              and infrastructure support services. We exist to help
              organizations operate safer, smarter and more efficiently — with
              solutions designed for real-world environments.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-12"
        style={{ backgroundColor: "#f8f9fa" }}
        id="stats"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-200 ${
              visibleSections.has("stats")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className="text-4xl md:text-5xl font-bold mb-2"
                  style={{ color: "#4169e1" }}
                >
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white" id="mission" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-12 transition-all duration-1000 ${
              visibleSections.has("mission")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {/* Mission */}
            <div className="relative">
              <div
                className="absolute -top-4 -left-4 w-20 h-20 rounded-2xl opacity-10"
                style={{ backgroundColor: "#4169e1" }}
              />
              <div className="relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#4169e1] transition-all duration-300">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: "#4169e1" }}
                >
                  <Target size={28} color="white" />
                </div>
                <h2
                  className="text-3xl font-bold mb-4"
                  style={{ color: "#001f54" }}
                >
                  Our Mission
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Our mission is to provide dependable, innovative and
                  affordable solutions that enhance safety, improve operations,
                  and empower organizations across Africa and beyond. We aim to
                  bridge gaps between technology, security, power and project
                  delivery — ensuring businesses can focus on what matters most.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="relative">
              <div
                className="absolute -bottom-4 -right-4 w-20 h-20 rounded-2xl opacity-10"
                style={{ backgroundColor: "#a7fc00" }}
              />
              <div className="relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#4169e1] transition-all duration-300">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: "#4169e1" }}
                >
                  <Eye size={28} color="white" />
                </div>
                <h2
                  className="text-3xl font-bold mb-4"
                  style={{ color: "#001f54" }}
                >
                  Our Vision
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  To become a leading African solutions provider known for
                  integrity, technical excellence and customer-focused delivery
                  — creating safer and more efficient environments for
                  businesses, governments and communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        className="py-20"
        style={{ backgroundColor: "#f8f9fa" }}
        id="values"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.has("values")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#001f54" }}
            >
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 delay-200 ${
              visibleSections.has("values")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 hover:border-[#4169e1]"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "#4169e120" }}
                  >
                    <Icon size={24} style={{ color: "#4169e1" }} />
                  </div>
                  <h3
                    className="text-xl font-semibold mb-3"
                    style={{ color: "#001f54" }}
                  >
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white" id="timeline" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.has("timeline")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#001f54" }}
            >
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From a bold idea to a platform trusted by thousands
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div
              className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2"
              style={{ backgroundColor: "#4169e120" }}
            />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative transition-all duration-1000 ${
                    visibleSections.has("timeline")
                      ? "opacity-100 translate-x-0"
                      : index % 2 === 0
                        ? "opacity-0 -translate-x-8"
                        : "opacity-0 translate-x-8"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                      index % 2 === 0 ? "" : "lg:grid-flow-dense"
                    }`}
                  >
                    {/* Content */}
                    <div
                      className={`${
                        index % 2 === 0 ? "lg:text-right" : "lg:col-start-2"
                      }`}
                    >
                      <div
                        className="inline-block px-4 py-2 rounded-full mb-4"
                        style={{ backgroundColor: "#a7fc00" }}
                      >
                        <span
                          className="text-lg font-bold"
                          style={{ color: "#001f54" }}
                        >
                          {item.year}
                        </span>
                      </div>
                      <h3
                        className="text-2xl font-bold mb-3"
                        style={{ color: "#001f54" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {item.description}
                      </p>
                    </div>

                    {/* Icon */}
                    <div
                      className={`hidden lg:flex ${
                        index % 2 === 0 ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-lg"
                        style={{ backgroundColor: "#4169e1" }}
                      >
                        <TrendingUp size={28} color="white" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        className="py-20"
        style={{ backgroundColor: "#f8f9fa" }}
        id="team"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.has("team")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#001f54" }}
            >
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate experts dedicated to your success
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-200 ${
              visibleSections.has("team")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 hover:border-[#4169e1]"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Avatar */}
                <div className="mb-6 flex justify-center">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.initials}
                  </div>
                </div>

                {/* Name */}
                <h3
                  className="text-xl font-bold mb-1"
                  style={{ color: "#001f54" }}
                >
                  {member.name}
                </h3>

                {/* Role */}
                <p className="font-semibold mb-4" style={{ color: "#4169e1" }}>
                  {member.role}
                </p>

                {/* Bio */}
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              We're growing fast and always looking for talented people
            </p>
            <button
              onClick={scrollToContact}
              className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: "#4169e1", color: "white" }}
            >
              View Open Positions
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white" id="cta" data-animate>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center transition-all duration-1000 ${
              visibleSections.has("cta")
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
          >
            <div
              className="rounded-3xl p-12 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #001f54 0%, #4169e1 100%)",
              }}
            >
              {/* Decorative elements */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
                style={{ backgroundColor: "#a7fc00" }}
              />
              <div
                className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
                style={{ backgroundColor: "#a7fc00" }}
              />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to work with us?
                </h2>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                  Whether you need reliable ICT infrastructure, security
                  systems, energy support or professional consulting — our team
                  is ready to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={scrollToContact}
                    className="px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
                  >
                    Let’s discuss your project today.
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
