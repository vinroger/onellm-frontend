import React from "react";

function Navbar() {
  return (
    <div>
      <div className="flex flex-row min-w-full justify-center">
        <nav className="flex flex-row max-w-screen-xl w-full h-14 items-center justify-between px-5">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">OneLLM</span>
            <img className="w-auto h-8" src="/onellmlogo.png" alt="" />
          </a>
          {/* <div>
            <a
              href={"#pricing"}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Pricing
            </a>
          </div> */}
          <a
            href="/workspace"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
