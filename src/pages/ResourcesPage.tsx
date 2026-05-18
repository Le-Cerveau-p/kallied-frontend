import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { FileText, BookOpen, Download, LibraryBig } from "lucide-react";
import { Link } from "react-router-dom";

const resources = [
  {
    title: "Company Profile",
    description:
      "A concise overview of who we are, what we do, and the sectors we serve.",
  },
  {
    title: "Capability Statement",
    description:
      "A one-page summary of core services, competencies, and institutional strengths.",
  },
  {
    title: "Project Briefs",
    description:
      "Short summaries of key engagements, services provided, and outcomes delivered.",
  },
  {
    title: "Research and Learning Notes",
    description:
      "Short notes, insights, and evidence highlights that support program planning.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="resources" />

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
                <LibraryBig size={16} />
                Resources
              </div>
              <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
                A simple place for company documents and learning materials
              </h1>
              <p className="mt-6 max-w-3xl text-lg md:text-2xl text-white/90 leading-relaxed">
                Use this page to publish capability documents, project summaries,
                company information, and supporting resources that clients may want
                to review before engaging.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4169e1]">
                Resource Library
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#001f54]">
                Publish the documents that help clients understand your work
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <div
                  key={resource.title}
                  className="rounded-2xl border border-gray-200 bg-[#f8f9fa] p-7 shadow-sm"
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "#001f54" }}
                  >
                    <FileText size={28} color="#fff" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-[#001f54]">
                    {resource.title}
                  </h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {resource.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold" style={{ backgroundColor: "#a7fc00", color: "#001f54" }}>
                    <Download size={16} />
                    Request copy
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <BookOpen className="mx-auto text-[#4169e1]" size={44} />
            <h2 className="mt-5 text-3xl md:text-4xl font-bold text-[#001f54]">
              Keep the resource page simple and useful
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              If a document is not ready yet, you can still keep the section in
              place and use it as a request point for proposals, references, and
              company materials.
            </p>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl px-6 py-4 font-semibold text-[#001f54]"
                style={{ backgroundColor: "#a7fc00" }}
              >
                Request a Resource
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
