import React from "react";

type HeaderProps = {
  title: string;
  subtitle?: string;
  button?: {
    title: string;
    url: string;
  };
};

const Header: React.FC<HeaderProps> = ({ title, subtitle, button }) => {
  return (
    <header className="w-full py-8 bg-white shadow-sm">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h1 className="text-4xl font-semibold text-gray-700 text-center mb-4">
          {title}
        </h1>
        <h2 className="text-xl font-semibold mb-4 font-mono text-gray-700 text-center">
          {subtitle}
        </h2>
        {button && (
          <a
            href={button.url}
            className="inline-block bg-blue-600 hover:bg-blue-700 hover:cursor-default text-white py-2 px-4 rounded-md text-center mx-auto"
          >
            {button.title}
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
