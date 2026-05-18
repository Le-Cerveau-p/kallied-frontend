import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { CalendarRange, Briefcase, BadgeCheck, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const projectFields = [
  {
    title: "Project Title",
    description: "The official name of the assignment or engagement.",
  },
  {
    title: "Client or Partner",
    description: "The organization that commissioned or sponsored the work.",
  },
  {
    title: "Location",
    description: "State, city or country where the work was delivered.",
  },
  {
    title: "Project Period",
    description: "The month or year when the engagement took place.",
  },
  {
    title: "Services Provided",
    description: "The specific consulting, research or implementation services delivered.",
  },
  {
    title: "Key Results / Outcomes",
    description: "A short, factual summary of outputs, results or follow-up actions.",
  },
];

const readinessPoints = [
  "Keep every entry concise, factual and outcome-focused.",
  "Use the same structure for every approved case study.",
  "Include only client-approved details and public-facing information.",
  "Add supporting documents, photos or reports where disclosure is permitted.",
];

export default function ProjectsExperiencePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="projects" />

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
                <Briefcase size={16} />
                Projects and Experience
              </div>
              <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
                Selected engagement highlights and case study format
              </h1>
              <p className="mt-6 max-w-3xl text-lg md:text-2xl text-white/90 leading-relaxed">
                This page presents the structure K-Allied Integrated Solutions
                uses to document consulting, research, implementation and
                advisory engagements in a clear, client-friendly way.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4169e1]">
                Portfolio Format
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#001f54]">
                How project entries are organized
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <article className="rounded-2xl border border-gray-200 bg-[#f8f9fa] p-7 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#001f54]">
                      Case study template
                    </h3>
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                      {projectFields.slice(0, 4).map((field) => (
                        <div key={field.title} className="rounded-xl bg-white p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-[#4169e1]">{field.title}</p>
                          <p className="mt-1">{field.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-5 border border-gray-200 lg:w-96">
                    <div className="flex items-center gap-2 text-[#001f54] font-semibold">
                      <BadgeCheck size={18} className="text-[#4169e1]" />
                      How entries will be presented
                    </div>
                    <p className="mt-3 text-gray-600 leading-relaxed">
                      Each record shows the assignment, the client, the location,
                      the services delivered and the outcomes that can be shared
                      publicly.
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-gray-200 bg-[#f8f9fa] p-7 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#001f54]">
                      What each case study includes
                    </h3>
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                      {projectFields.slice(4).map((field) => (
                        <div key={field.title} className="rounded-xl bg-white p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-[#4169e1]">{field.title}</p>
                          <p className="mt-1">{field.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-5 border border-gray-200 lg:w-96">
                    <div className="flex items-center gap-2 text-[#001f54] font-semibold">
                      <FileText size={18} className="text-[#4169e1]" />
                      Publication standard
                    </div>
                    <p className="mt-3 text-gray-600 leading-relaxed">
                      Entries are written in a factual, approval-ready format for
                      proposals, credentials and presentations.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="py-20" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <CalendarRange className="mx-auto text-[#4169e1]" size={44} />
            <h2 className="mt-5 text-3xl md:text-4xl font-bold text-[#001f54]">
              A portfolio format that supports steady growth
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Use the same format for every approved engagement so the portfolio
              stays consistent, easy to scan and ready for proposals.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {readinessPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-xl border border-gray-200 bg-white p-4 text-gray-700"
                >
                  {point}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl px-6 py-4 font-semibold text-[#001f54]"
                style={{ backgroundColor: "#a7fc00" }}
              >
                Share a Project Brief
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
