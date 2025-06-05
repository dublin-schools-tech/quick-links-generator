export default function Home() {
  const utilities = [
    {
      name: "Internal Telephone Directory Updater App",
      description:
        "Automatatically update the internal telephone directory Google Sheets",
      url: "https://drive.usercontent.google.com/u/1/uc?id=12Iz2IHiV1JMQ7-lv_b7cip6haopn0b6A&export=download",
      icon: "🤖",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      download: true
    },
    {
      name: "Quick Links Generator",
      description: "Generate quick access links for frequently used resources",
      url: "/quick-links-generator",
      icon: "🔗",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-600",
      download: false
    },
    {
      name: "New Employee Auto Email Script",
      description: "Automate welcome emails for new employees",
      url: "/new-employee-auto-email-script",
      icon: "📧",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-600",
      download: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-200">
      <header className="w-full py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-mono font-semibold text-gray-700 text-center">
            Dublin City Schools Utilities
          </h1>
          <p className="mt-2 text-gray-500 text-center max-w-2xl mx-auto">
            Tools and applications to streamline school operations and workflows
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {utilities.map((utility, index) => (
            <a
              key={index}
              href={utility.url}
              {...(utility.download ? { download: true } : {})}
              className={`block p-6 rounded-lg border-2 ${utility.borderColor} ${utility.bgColor} transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-blue-300`}
            >
              <div className="flex flex-col h-full">
                <div className={`text-4xl mb-4 ${utility.textColor}`}>
                  {utility.icon}
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {utility.name}
                </h2>
                <p className="text-gray-600 mb-4 flex-grow">
                  {utility.description}
                </p>
                <div
                  className={`mt-auto text-sm font-medium ${utility.textColor}`}
                >
                  Access →
                </div>
              </div>
            </a>
          ))}

          <div className="p-6 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center">
            <div className="text-4xl mb-4 text-gray-400">+</div>
            <h2 className="text-xl font-medium text-gray-500">
              More Utilities Coming Soon
            </h2>
          </div>
        </div>
      </main>
    </div>
  );
}
