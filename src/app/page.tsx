// Full updated React page with import HTML functionality and error handling - FIXED ICON BUG
"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import { icons } from "@/app/iconData";
import ReactMarkdown from 'react-markdown';

type LinkItem = {
  name: string;
  url: string;
  icon: string;
};


const Page = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [newLink, setNewLink] = useState<LinkItem>({ name: "", url: "", icon: "link" });
  const [existingHTML, setExistingHTML] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [showImportBox, setShowImportBox] = useState(false);
  const [importError, setImportError] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);

  const markdown = `
**If you need to create a new Quick Links section:**

1. Navigate to the "Add Quick Links" tab on this website

2. In the box titled "Add New Links", add the text you would like to display on screen in the "Link Name" field, paste the link into the URL field, and select an appropriate matching icon from the list presented.

*Tip: The icons are from the free tier of an icon set called "Font Awesome". Search for icons to use here: https://fontawesome.com/icons (only the free ones are available), and type in the name in the icon field*

3. Press "Add Link" when you are done. As you add more links, they will show up in the "Your Links" section

4. To see what the Quick Links look like, press "Open Preview"

5. When all links are added, press the "Copy HTML to Clipboard" button

6. With the HTML copied, navigate to the desired page in FinalSite, add a new element, and select "Embed"

7. In the embed element, paste the copied HTML code



**If you need to edit an existing Quick Links section:**

1. Find the existing Quick Links element in the website. Press the gear button in the top right corner to open the embed code. Copy this.

2. In this website, press the "Import Existing HTML" button and paste the copied code in the box. Press "Parse & Import"

3. Use as described above.`



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewLink({ ...newLink, [name]: value });
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

  const toggleImportBox = () => {
    setShowImportBox((prev) => {
      const next = !prev;
      if (next) {
        setExistingHTML("");
        setLinks([]);
      }
      return next;
    });
    setImportError("");
  };

  const parseExistingHTML = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(existingHTML, "text/html");
      const anchors = doc.querySelectorAll("a.quick-link");
      if (!anchors.length) throw new Error("No quick-link anchors found.");

      const items: LinkItem[] = Array.from(anchors).map((el) => {
        const name = el.getAttribute("data-page-name") || el.textContent?.trim() || "Unnamed";
        const url = el.getAttribute("href") || "#";
        
        const svgElement = el.querySelector("svg");
        let iconId = "link"; 
        
        if (svgElement) {
          const viewBox = svgElement.getAttribute("viewBox") || "";
          const paths = Array.from(svgElement.querySelectorAll("path")).map(
            path => path.getAttribute("d") || ""
          ).join("");

          const matchingIcon = icons.find(icon => {
            const iconDoc = parser.parseFromString(icon.svg, "text/html");
            const iconSvg = iconDoc.querySelector("svg");
            if (!iconSvg) return false;
            
            const iconViewBox = iconSvg.getAttribute("viewBox") || "";
            const iconPaths = Array.from(iconSvg.querySelectorAll("path")).map(
              path => path.getAttribute("d") || ""
            ).join("");
            
            return viewBox === iconViewBox && paths === iconPaths;
          });
          
          if (matchingIcon) {
            iconId = matchingIcon.id;
          }
        }
        
        return { name, url, icon: iconId };
      });
      
      setLinks(items);
      setImportError("");
      alert(`${items.length} link(s) imported.`);
    } catch (error: any) {
      setImportError(error.message || "Failed to parse HTML.");
    }
  };

  const generateHTML = () => {
    const htmlLinks = links
      .map((link) => {
        const iconData = icons.find((i) => i.id === link.icon);
        const iconSvg = iconData ? iconData.svg : icons.find(i => i.id === "link")?.svg || "";
        
        return `
  <li><a aria-label="${link.name}" class="quick-link" data-page-name="${link.name}" href="${link.url}">
    <span aria-hidden="true" class="icon-bubble">
      <svg viewBox="0 0 24 24" width="24" height="24">${iconSvg}</svg>
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
  padding: 4px;
}
.icon-bubble svg {
  width: 24px;
  height: 24px;
  margin: auto;
  display: block;
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
    <div className="min-h-screen flex flex-col items-center bg-gray-100 font-mono">
      <Header title="DCS Quick Links Generator" subtitle="Easily create quick links for the DCS website" />
      
      <div className="w-full max-w-4xl my-12">
        <div className="flex flex-row items-start w-full">
          <div className={`rounded-t-xl text-lg w-fit h-fit p-2 text-gray-700 ${showInstructions ? "bg-white ": "bg-gray-200"}`} onClick={() => setShowInstructions(true)}>
            Instructions
          </div>
          <div className={`rounded-t-xl text-lg w-fit h-fit p-2 text-gray-700 ${showInstructions ? "bg-gray-200" : "bg-white"}`} onClick={() => setShowInstructions(false)}>
            Add Quick Links
          </div>
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 mx-auto  bg-white rounded-b-lg shadow-md">
          {showInstructions ? (
            <>
              <div className="text-xl font-semibold text-gray-700">Instructions</div>
              <div><br /><strong>If you need to create a new Quick Links section:</strong><br /><br />&nbsp;1. Navigate to the "Add Quick Links" tab on this website

<br/><br/>&nbsp;2. In the box titled "Add New Links", add the text you would like to display on screen in the "Link Name" field, paste the link into the URL field, and select an appropriate matching icon from the list presented.

<br/><br/>&nbsp;<em>*Tip: The icons are from the free tier of an icon set called "Font Awesome". Search for icons to use here: https://fontawesome.com/icons (only the free ones are available), and type in the name in the icon field</em>

<br/><br/>&nbsp;3. Press "Add Link" when you are done. As you add more links, they will show up in the "Your Links" section

<br/><br/>&nbsp;4. To see what the Quick Links look like, press "Open Preview"

<br/><br/>&nbsp;5. When all links are added, press the "Copy HTML to Clipboard" button

<br/><br/>&nbsp;6. With the HTML copied, navigate to the desired page in FinalSite, add a new element, and select "Embed"

<br/><br/>&nbsp;7. In the embed element, paste the copied HTML code
<br /><br/><strong>If you need to create a new Quick Links section:</strong><br />
<br/>&nbsp;1. Find the existing Quick Links element in the website. Press the gear button in the top right corner to open the embed code. Copy this.

<br/><br/>&nbsp;2. In this website, press the "Import Existing HTML" button and paste the copied code in the box. Press "Parse & Import"

<br/><br/>&nbsp;3. Use as described above.
</div>
            </>
           ) : ( 
            <>
              <div className="mb-6">
                <button
                  onClick={toggleImportBox}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {showImportBox ? "Hide Import Box" : "Import Existing HTML"}
                </button>

                {showImportBox && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paste Existing Quick Links HTML</label>
                    <textarea
                      value={existingHTML}
                      onChange={(e) => setExistingHTML(e.target.value)}
                      placeholder="Paste your existing quick links HTML here..."
                      rows={6}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-700"
                    />
                    <button
                      onClick={parseExistingHTML}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Parse & Import
                    </button>
                    {importError && <p className="mt-2 text-red-600 text-sm">Error: {importError}</p>}
                  </div>
                )}
              </div>

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
                      <div className="w-8 h-8 flex items-center justify-center bg-[#006853] rounded-full">
                        <div
                          className="w-4 h-4 flex items-center justify-center fill-white"
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
                  className="mt-4 px-4 py-2 bg-[#006853] text-white rounded-md hover:bg-[#004d3d] transition-colors"
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
                              viewBox="0 0 24 24"
                              width="20"
                              height="20"
                              className="fill-current text-blue-600"
                              dangerouslySetInnerHTML={{
                                __html: icons.find((i) => i.id === link.icon)?.svg || ""
                              }}
                            />
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
              {links.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold font-mono text-gray-700">
                      Preview
                    </h2>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
                        showPreview
                          ? "bg-[#006853] text-white hover:bg-[#004d3d]"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <span>{showPreview ? "Hide" : "Show"} Preview</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform ${
                          showPreview ? "rotate-180" : ""
                        }`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                  {showPreview && (
                    <div
                      className="p-4 border border-gray-200 rounded-lg"
                      dangerouslySetInnerHTML={{ __html: generateHTML() }}
                    ></div>
                  )}
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 font-mono text-gray-700">
                  Generated HTML
                </h2>
                <button
                  onClick={copyToClipboard}
                  className="mb-4 px-4 py-2 bg-[#006853] text-white rounded-md hover:bg-[#004d3d] transition-colors"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;