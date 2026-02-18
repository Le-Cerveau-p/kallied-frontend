import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import {
  Shield,
  Zap,
  Lock,
  Users,
  CircleCheck,
  Star,
  ArrowRight,
  Globe,
} from "lucide-react";

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Integrated Security Systems",
      description:
        "From surveillance and access control to monitoring infrastructure — secure environments built for reliability.",
    },
    {
      icon: Zap,
      title: "ICT & Network Solutions",
      description:
        "Robust IT infrastructure, communication systems and data management tailored to your organization.",
    },
    {
      icon: Lock,
      title: "Power & Backup Support",
      description:
        "Alternative energy and backup solutions to ensure operations never stop.",
    },
    {
      icon: Globe,
      title: "Procurement & Technical Support",
      description:
        "Transparent sourcing, logistics and technical consulting to deliver the right solutions at the right cost.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Reach Out",
      description: "Tell us about your project needs and challenges.",
    },
    {
      number: "02",
      title: "Assessment & Planning",
      description:
        "Our team reviews requirements and recommends practical solutions.",
    },
    {
      number: "03",
      title: "Deployment & Implementation",
      description: "We deliver, install, and configure systems professionally.",
    },
    {
      number: "04",
      title: "Ongoing Support",
      description:
        "We provide continuous maintenance, monitoring and advisory support.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart Inc",
      content:
        "The team at K-Allied provided excellent support and delivered exactly what we needed for our project.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "CTO, DataFlow Systems",
      content:
        "Professional service, timely delivery and very dependable technical expertise.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager, InnovateCo",
      content:
        "Our organization has seen significant improvement in efficiency since implementing their solutions.",
      rating: 5,
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const scrollToSignup = () => {
    navigate("/signup");
  };

  const scrollToServices = () => {
    navigate("/services");
  };

  const scrollToFeatures = () => {
    navigate("/features");
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
            Smart Solutions for
            <br />
            <span style={{ color: "#a7fc00" }}>
              Security, ICT and Business Operations
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            We design and deploy practical, secure and reliable solutions that
            help organizations operate safely, manage projects effectively and
            achieve better results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <button
              onClick={scrollToFeatures}
              className="group px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
              style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
            >
              Explore Our Solutions
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
              Learn More
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/70">
            <div className="flex items-center gap-2">
              <CircleCheck size={20} style={{ color: "#a7fc00" }} />
              <span>Trusted execution</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleCheck size={20} style={{ color: "#a7fc00" }} />
              <span>Professional service delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleCheck size={20} style={{ color: "#a7fc00" }} />
              <span>Secure and compliant systems</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#001f54" }}
            >
              Powerful Features for Your Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to build, manage, and scale your business with
              confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
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
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
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
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple, streamlined process
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

      {/* Testimonials Section */}
      <section className="py-20 bg-white" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#001f54" }}
            >
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about their experience
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index === activeTestimonial
                      ? "opacity-100 relative"
                      : "opacity-0 absolute inset-0 pointer-events-none"
                  }`}
                >
                  <div
                    className="p-8 md:p-12 rounded-2xl shadow-xl"
                    style={{ backgroundColor: "#001f54" }}
                  >
                    {/* Star rating */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={24}
                          fill="#a7fc00"
                          color="#a7fc00"
                        />
                      ))}
                    </div>

                    <p className="text-xl md:text-2xl text-white mb-8 text-center italic leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    <div className="text-center">
                      <p className="font-semibold text-white text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-white/70">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? "w-8" : ""
                  }`}
                  style={{
                    backgroundColor:
                      index === activeTestimonial ? "#a7fc00" : "#d1d5db",
                  }}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
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
                number: "+30",
                label:
                  "Completed Projects Across public and private sector clients",
              },
              {
                number: "100%",
                label:
                  "Client Satisfaction Focus Quality work and transparent communication",
              },
              {
                number: "24/7",
                label: "Professional technical assistance when needed",
              },
              {
                number: "Growing Partnerships",
                label: "Expanding across industries and sectors",
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
            Ready to Discuss Your Project?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Let’s work together to design secure, reliable and efficient
            solutions that support your organization’s goals.
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
              Request Consultation
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
