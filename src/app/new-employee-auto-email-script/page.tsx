import React from "react";
import Header from "@/components/Header";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-200 font-mono text-center">
      <Header
        title="New Employee Auto Email Script"
        subtitle="Automate welcome emails for new employees with this script."
        button={{
          title: "Back to Home",
          url: "/",
        }}
      />
      <div className="container mx-auto px-4 py-12 text-black space-y-4">
        <p>
          This script automates the process of sending welcome emails to new
          employees. It can be customized to include specific information about
          the employee, such as their start date, department, and other relevant
          details.
        </p>
        <p>
          The script is hosted on <strong>PythonAnywhere</strong> where you can sign in using the
          district's email:
          <code className="bg-gray-100 px-1 rounded">
            dublincityschools@dublinschools.net
          </code>
          .
        </p>
        <p>
          You can view or download the script directly from GitHub:&nbsp;
          <a
            href="https://github.com/dublinschools/employee-auto-emailer-script"
            className="text-blue-600 underline hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </div>
    </div>
  );
};

export default page;
