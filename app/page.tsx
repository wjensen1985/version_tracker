import Link from "next/link";

// Feature card data
const features = [
  {
    title: "Project Management",
    description:
      "Organize your work into projects. Group related items together and keep everything structured and accessible.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
        />
      </svg>
    ),
  },
  {
    title: "Version History",
    description:
      "Track every version change over time. Never lose track of updates with complete version history for all your items.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Historic Views",
    description:
      "Travel back in time. View your project data as it existed at any point in history with our time-travel feature.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
    ),
  },
];

// How it works steps
const steps = [
  {
    number: "1",
    title: "Create a Project",
    description: "Start by creating a project to organize your trackable items.",
  },
  {
    number: "2",
    title: "Add Items",
    description: "Add items like devices, components, or any entity you want to track.",
  },
  {
    number: "3",
    title: "Track Versions",
    description: "Log version updates and maintain a complete history of changes.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
          <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />
          <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl dark:bg-blue-600/5" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              <span className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
              Simple version tracking for teams
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Track, Manage, and</span>
              <span className="block text-blue-600 dark:text-blue-400">
                Control Your Versions
              </span>
            </h1>

            {/* Subtext */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Version Tracker helps you maintain a complete history of your project items.
              Track firmware versions, component updates, and more — all in one place.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
              >
                Get Started
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center rounded-lg border-2 border-gray-700 px-6 py-3 text-base font-semibold transition-colors hover:bg-gray-700 hover:text-white dark:border-gray-300 dark:hover:bg-gray-300 dark:hover:text-gray-900"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero visual - Abstract dashboard preview */}
          <div className="mt-16 sm:mt-20">
            <div className="relative mx-auto max-w-4xl">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                {/* Mock browser bar */}
                <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <div className="ml-4 flex-1 rounded-md bg-gray-200 px-3 py-1 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    version-tracker.app/dashboard
                  </div>
                </div>
                {/* Mock dashboard content */}
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-8 w-24 rounded-lg bg-blue-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30" />
                      <div className="flex-1">
                        <div className="h-4 w-40 rounded bg-gray-300 dark:bg-gray-700" />
                        <div className="mt-2 h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" />
                      </div>
                      <div className="h-6 w-16 rounded-full bg-green-100 dark:bg-green-900/30" />
                    </div>
                    <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30" />
                      <div className="flex-1">
                        <div className="h-4 w-36 rounded bg-gray-300 dark:bg-gray-700" />
                        <div className="mt-2 h-3 w-20 rounded bg-gray-200 dark:bg-gray-800" />
                      </div>
                      <div className="h-6 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30" />
                    </div>
                    <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                      <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30" />
                      <div className="flex-1">
                        <div className="h-4 w-44 rounded bg-gray-300 dark:bg-gray-700" />
                        <div className="mt-2 h-3 w-28 rounded bg-gray-200 dark:bg-gray-800" />
                      </div>
                      <div className="h-6 w-16 rounded-full bg-green-100 dark:bg-green-900/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-gray-200 bg-gray-50 py-24 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to track versions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Simple, powerful tools to keep your project versions organized and accessible.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-blue-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
              >
                <div className="mb-4 inline-flex rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Get started in minutes with our simple three-step process.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-gradient-to-r from-blue-600 to-blue-300 sm:block dark:from-blue-500 dark:to-blue-800" />
                )}
                <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white shadow-lg">
                  {step.number}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-200 bg-gray-50 py-24 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Start tracking your project versions today. It&apos;s free to get started.
          </p>
          <div className="mt-10">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
            >
              Go to Dashboard
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <svg
                className="h-8 w-8 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                />
              </svg>
              <span className="text-lg font-semibold">Version Tracker</span>
            </div>

            <nav className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/dashboard" className="transition-colors hover:text-gray-900 dark:hover:text-gray-100">
                Dashboard
              </Link>
              <Link href="#features" className="transition-colors hover:text-gray-900 dark:hover:text-gray-100">
                Features
              </Link>
            </nav>

            <p className="text-sm text-gray-500 dark:text-gray-500">
              &copy; {new Date().getFullYear()} Version Tracker
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
