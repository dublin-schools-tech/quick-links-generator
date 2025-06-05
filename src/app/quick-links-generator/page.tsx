"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import { icons } from "@/app/quick-links-generator/iconData";

type LinkItem = {
  name: string;
  url: string;
  icon: string;
};

const Page = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [newLink, setNewLink] = useState<LinkItem>({
    name: "",
    url: "",
    icon: "link",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewLink({
      ...newLink,
      [name]: value,
    });
  };

  const addLink = () => {
    if (newLink.name && newLink.url) {
      setLinks([...links, newLink]);
      setNewLink({ name: "", url: "", icon: "link" });
    }
  };

  const removeLink = (index: number) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
  };

  const deleteAllLinks = () => {
    if (confirm("Are you sure you want to delete all links?")) {
      setLinks([]);
    }
  };

  const generateHTML = () => {
    const htmlLinks = links
      .map((link) => {
        const iconData = icons.find((i) => i.id === link.icon);
        return `
  <li><a aria-label="${link.name}" class="quick-link" data-page-name="${
          link.name
        }" href="${link.url}">
    <span aria-hidden="true" class="icon-bubble">
${iconData ? iconData.svg : ""}
    </span>
    ${link.name}
  </a></li>`;
      })
      .join("\n");

    return `
<div>
<style type="text/css">
  .quick-links-container {
    width: 100%;
    background: #fff;
    padding: 1rem 1.5rem;
    font-family: "Poppins", sans-serif;
  }
  .quick-links-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem 2.5rem;
  }
  .quick-links-list li {
    flex: 1 1 45%;
    min-width: 220px;
  }
  .quick-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    color: #006853;
    font-weight: 600;
    font-size: 1rem;
    transition: color 0.3s ease;
  }
  .quick-link:hover,
  .quick-link:focus {
    color: #004d3d;
  }
  .icon-bubble {
    background-color: #006853;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon-bubble svg {
    width: 20px;
    height: 20px;
    stroke: #fff !important;
    fill: #fff !important;
  }
</style>
</div>

<section class="quick-links-container">
  <ul class="quick-links-list">
${htmlLinks}
  </ul>
</section>`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateHTML());
      alert("HTML copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const selectedIcon = icons.find((icon) => icon.id === newLink.icon);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-200 font-mono">
      <Header
        title="Quick Links Generator"
        subtitle="Create and manage your quick links easily"
        button={{ title: "Go to Home", url: "/" }}
      />
      <div className="w-full px-4">
        <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 mx-auto bg-white rounded-lg shadow-md my-12">
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 font-mono text-gray-700">
              Add New Link
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newLink.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                  placeholder="e.g., Alumni Association"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  name="url"
                  value={newLink.url}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                  placeholder="e.g., /fs/pages/4720"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                    <div
                      className="w-4 h-4 text-center"
                      dangerouslySetInnerHTML={{
                        __html: selectedIcon ? selectedIcon.svg : "",
                      }}
                    ></div>
                  </div>
                  <select
                    name="icon"
                    value={newLink.icon}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                  >
                    {icons.map((icon) => (
                      <option key={icon.id} value={icon.id}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <button
              onClick={addLink}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={!newLink.name || !newLink.url}
            >
              Add Link
            </button>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold font-mono text-gray-700">
                Your Links ({links.length})
              </h2>
              {links.length > 0 && (
                <button
                  onClick={deleteAllLinks}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                >
                  Delete All
                </button>
              )}
            </div>
            {links.length === 0 ? (
              <p className="text-gray-500">No links added yet.</p>
            ) : (
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center">
                      <span className="mr-3">
                        <svg
                          viewBox="0 0 512 512"
                          width="20"
                          height="20"
                          className="fill-current text-blue-600"
                        >
                          {icons.find((i) => i.id === link.icon)?.svg}
                        </svg>
                      </span>
                      <span className="font-medium font-mono text-gray-700">
                        {link.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeLink(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 font-mono text-gray-700">
              Generated HTML
            </h2>
            <button
              onClick={copyToClipboard}
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              disabled={links.length === 0}
            >
              Copy HTML to Clipboard
            </button>
            {links.length > 0 ? (
              <pre className="p-4 bg-gray-800 text-gray-100 rounded-md overflow-x-auto text-sm">
                {generateHTML()}
              </pre>
            ) : (
              <p className="text-gray-500">Add some links to generate HTML.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
