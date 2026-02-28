import { useEffect, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CircleCheck,
  Clock,
  MessageSquare,
  Loader,
} from "lucide-react";
import { getCompanyProfile, sendContactMessage } from "../api/public";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface CompanyProfile {
  name?: string;
  department?: string;
  address?: string;
  email?: string;
  phone?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  whatsappUrl?: string;
  mapLabel?: string;
  mapAddress?: string;
  mapUrl?: string;
  mapEmbedUrl?: string;
  mapLat?: number;
  mapLng?: number;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<"success" | "error">("success");
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(
    null,
  );

  const facebookUrl = companyProfile?.facebookUrl ?? "";
  const twitterUrl = companyProfile?.twitterUrl ?? "";
  const whatsappUrl = companyProfile?.whatsappUrl ?? "";

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+?/;
    return re.test(email);
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    return newErrors;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const newErrors = validateForm();
    setErrors(newErrors);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Clear error when user starts typing
    if (touched[field]) {
      const newErrors = validateForm();
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        await sendContactMessage(formData);
        setIsSuccess(true);
        setToastTone("success");
        setToastMessage("Your message has been sent successfully.");

        // Reset form after success
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
          setTouched({});
          setIsSuccess(false);
        }, 3000);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          "Failed to send message. Please try again shortly.";
        setSubmitError(
          Array.isArray(message) ? message.join(", ") : String(message),
        );
        setToastTone("error");
        setToastMessage("Unable to send message right now.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const profile = await getCompanyProfile();
        if (isMounted) {
          setCompanyProfile(profile);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: companyProfile?.email ?? "info@kallied.org",
      link: `mailto:${companyProfile?.email ?? "info@kallied.org"}`,
    },
    {
      icon: Phone,
      title: "Call Us",
      value: companyProfile?.phone ?? "+234 (0) 703-800-1614",
      link: `tel:${(companyProfile?.phone ?? "+234 (0) 703-800-1614").replace(/\s+/g, "")}`,
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: companyProfile?.address ?? "Abuja, Nigeria (Head Office)",
      link: "#map",
    },
    {
      icon: Clock,
      title: "Business Hours",
      value: "Mon – Fri: 9:00 AM – 5:00 PM (WAT)",
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar currentPage="contact" />
      {toastMessage && (
        <Toast
          message={toastMessage}
          tone={toastTone}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: "#a7fc00" }}
          >
            <MessageSquare size={18} style={{ color: "#001f54" }} />
            <span className="font-semibold" style={{ color: "#001f54" }}>
              Get In Touch
            </span>
          </div>
          <h1
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ color: "#001f54" }}
          >
            Contact <span style={{ color: "#4169e1" }}>Our Team</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have a project, request or enquiry? Our team is ready to support you
            with professional guidance, proposals and technical assistance.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2
                className="text-3xl font-bold mb-6"
                style={{ color: "#001f54" }}
              >
                Contact Information
              </h2>
              <p className="text-gray-600 mb-8">
                Send us a message and a member of our team will respond as soon
                as possible. We handle project enquiries, support requests and
                partnership opportunities.
              </p>

              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#4169e120" }}
                      >
                        <Icon size={24} style={{ color: "#4169e1" }} />
                      </div>
                      <div>
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: "#001f54" }}
                        >
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.value}</p>
                      </div>
                    </div>
                  );

                  return item.link ? (
                    <Link key={index} to={item.link} className="block">
                      {content}
                    </Link>
                  ) : (
                    <div key={index}>{content}</div>
                  );
                })}
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold mb-4" style={{ color: "#001f54" }}>
                  Stay Connected
                </h3>
                <div className="flex gap-3">
                  <a
                    href={facebookUrl || "#"}
                    target={facebookUrl ? "_blank" : undefined}
                    rel={facebookUrl ? "noopener noreferrer" : undefined}
                    aria-label="Facebook"
                    className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-gray-300 hover:border-[#4169e1] transition-all duration-300 hover:scale-110"
                    style={{ color: "#4169e1" }}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="currentColor"
                    >
                      <path d="M13.5 9H16V6h-2.5C10.91 6 10 7.57 10 9.71V12H8v3h2v6h3v-6h2.47l.53-3H13V9.71c0-.45.23-.71.5-.71Z" />
                    </svg>
                  </a>
                  <a
                    href={twitterUrl || "#"}
                    target={twitterUrl ? "_blank" : undefined}
                    rel={twitterUrl ? "noopener noreferrer" : undefined}
                    aria-label="Twitter"
                    className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-gray-300 hover:border-[#4169e1] transition-all duration-300 hover:scale-110"
                    style={{ color: "#4169e1" }}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="currentColor"
                    >
                      <path d="M18.15 3H21l-6.2 7.08L22.5 21h-6.06l-4.35-5.7L6.99 21H4.14l6.63-7.56L1.5 3h6.18l3.96 5.24L18.15 3Zm-1.1 16h1.67L7.9 4.93H6.14L17.05 19Z" />
                    </svg>
                  </a>
                  <a
                    href={whatsappUrl || "#"}
                    target={whatsappUrl ? "_blank" : undefined}
                    rel={whatsappUrl ? "noopener noreferrer" : undefined}
                    aria-label="WhatsApp"
                    className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-gray-300 hover:border-[#4169e1] transition-all duration-300 hover:scale-110"
                    style={{ color: "#4169e1" }}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="currentColor"
                    >
                      <path d="M12.04 3C7.06 3 3 7.03 3 12c0 1.6.42 3.15 1.21 4.52L3 21l4.65-1.2A9.02 9.02 0 0 0 12.04 21C17 21 21 16.97 21 12S17 3 12.04 3Zm4.93 12.34c-.2.56-1.17 1.07-1.6 1.14-.41.07-.93.1-1.5-.1-.35-.11-.81-.27-1.4-.55-2.47-1.08-4.08-3.6-4.2-3.77-.12-.17-1-1.33-1-2.54 0-1.2.63-1.79.85-2.03.23-.25.5-.31.67-.31.17 0 .34 0 .48.01.16.01.37-.06.58.44.2.48.68 1.66.74 1.78.06.12.1.26.02.42-.08.17-.12.27-.24.42-.12.14-.25.32-.36.43-.12.12-.24.25-.1.48.14.24.62 1.02 1.34 1.66.93.83 1.71 1.09 1.95 1.21.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.53-.12.22.08 1.38.65 1.62.76.24.12.4.18.46.28.06.1.06.6-.14 1.16Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ color: "#001f54" }}
                >
                  Send us a Message
                </h2>

                {isSuccess && (
                  <div
                    className="mb-6 p-4 rounded-lg flex items-center gap-3 animate-fade-in"
                    style={{
                      backgroundColor: "#a7fc0020",
                      border: "2px solid #a7fc00",
                    }}
                  >
                    <CircleCheck size={24} style={{ color: "#a7fc00" }} />
                    <div>
                      <p className="font-semibold" style={{ color: "#001f54" }}>
                        Your message has been received.
                      </p>
                      <p className="text-sm text-gray-600">
                        A member of our team will contact you shortly.
                      </p>
                    </div>
                  </div>
                )}

                {submitError && (
                  <div className="mb-6 p-4 rounded-lg border-2 border-red-200 bg-red-50">
                    <p className="font-semibold text-red-700">
                      Unable to send message
                    </p>
                    <p className="text-sm text-red-600 mt-1">{submitError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 font-semibold"
                      style={{ color: "#001f54" }}
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
                        errors.name && touched.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-[#4169e1]"
                      } outline-none`}
                      placeholder="John Doe"
                    />
                    {errors.name && touched.name && (
                      <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 font-semibold"
                      style={{ color: "#001f54" }}
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
                        errors.email && touched.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-[#4169e1]"
                      } outline-none`}
                      placeholder="john@example.com"
                    />
                    {errors.email && touched.email && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject Input */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block mb-2 font-semibold"
                      style={{ color: "#001f54" }}
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      onBlur={() => handleBlur("subject")}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
                        errors.subject && touched.subject
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-[#4169e1]"
                      } outline-none`}
                      placeholder="How can we help?"
                    />
                    {errors.subject && touched.subject && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block mb-2 font-semibold"
                      style={{ color: "#001f54" }}
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      onBlur={() => handleBlur("message")}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 resize-none ${
                        errors.message && touched.message
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-[#4169e1]"
                      } outline-none`}
                      placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && touched.message && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                    style={{
                      backgroundColor: "#a7fc00",
                      color: "#001f54",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size={24} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    We typically respond within 24 hours during business days.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#001f54" }}
            >
              Our Office Location
            </h2>
            <p className="text-xl text-gray-600">
              We operate across Nigeria and partner globally.
            </p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200">
            {/* Map Placeholder */}
            <div
              className="relative h-[400px] bg-gradient-to-br flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #001f54 0%, #4169e1 100%)",
              }}
              id="map"
            >
              {companyProfile?.mapEmbedUrl ? (
                <iframe
                  title="Company Location Map"
                  src={companyProfile.mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="text-center text-white">
                  <MapPin size={64} className="mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">
                    {companyProfile?.mapLabel ?? "Our Location"}
                  </h3>
                  {/* <p className="text-lg opacity-90">
                    {companyProfile?.mapAddress ?? "123 Tech Street"}
                  </p> */}
                  <p className="text-lg opacity-90">
                    {companyProfile?.address ??
                      "Abuja, Federal Capital Territory Nigeria"}
                  </p>
                  <Link
                    to={companyProfile?.mapUrl ?? "https://maps.google.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-6 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
                  >
                    View on Google Maps
                  </Link>
                </div>
              )}
            </div>

            {/* Office Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-6 text-center">
                <h4 className="font-semibold mb-2" style={{ color: "#001f54" }}>
                  Appointments
                </h4>
                <p className="text-gray-600">
                  Visits are based on prior scheduling
                </p>
              </div>
              <div className="p-6 text-center">
                <h4 className="font-semibold mb-2" style={{ color: "#001f54" }}>
                  Service Coverage
                </h4>
                <p className="text-gray-600">We serve clients nationwide</p>
              </div>
              <div className="p-6 text-center">
                <h4 className="font-semibold mb-2" style={{ color: "#001f54" }}>
                  Support
                </h4>
                <p className="text-gray-600">
                  Remote support available on request
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#001f54" }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "What types of services do you provide?",
                a: "We deliver ICT solutions, security systems, project support, consulting and managed services tailored to public and private sector needs.",
              },
              {
                q: "How soon can you start a project?",
                a: "Project timelines depend on scope and requirements, but our team responds quickly with clear onboarding steps.",
              },
              {
                q: "Do you work with government and private organizations?",
                a: "Yes — we support government agencies, enterprises, SMEs and partnerships through compliant processes.",
              },
              {
                q: "Can we request a proposal or quotation?",
                a: "Absolutely. Provide details through the contact form and our team will prepare a tailored proposal.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#4169e1] transition-all duration-300"
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "#001f54" }}
                >
                  {faq.q}
                </h3>
                <p className="text-gray-600">{faq.a}</p>
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
