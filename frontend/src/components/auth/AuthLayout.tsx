
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

import logo from "../../assets/images/kekeGoLogo.png";
import loginBg from "../../assets/images/loginBg.png";

type AuthLayoutProps = {
  children: ReactNode;
  onBack?: () => void;
};

const AuthLayout = ({ children, onBack }: AuthLayoutProps) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  const handleBack = () => {
    if (isClosing) return;

    setIsClosing(true);

    window.setTimeout(() => {
      if (onBack) {
        onBack();
      } else {
        navigate("/");
      }
    }, 350);
  };

  return (
    <main
      className={`min-h-[100svh] bg-[#FFFEFA] lg:h-[100svh] lg:overflow-hidden ${
        isClosing ? "signup-book-close" : ""
      }`}
    >
      <div className="grid min-h-[100svh] grid-cols-1 md:grid-cols-2 lg:h-full">
        {/* Desktop visual panel: completely hidden on small screens */}
        <section
          className="relative hidden flex-col overflow-hidden bg-[#10271D] bg-cover bg-center px-5 py-5 md:flex lg:h-full lg:px-8 lg:py-7 xl:px-12 xl:py-9"
          style={{ backgroundImage: `url(${loginBg})` }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#071B12]/90 via-[#10271D]/75 to-[#10271D]/55"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071B12]/70 via-transparent to-[#071B12]/15"
          />

          <div className="relative z-10 flex shrink-0 items-center">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Back to home"
              title="Back to home"
              disabled={isClosing}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/15 text-white backdrop-blur-md transition hover:border-[#00D36F] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D36F] cursor-pointer "
            >
              <ArrowLeft size={19} />
            </button>
          </div>

          <div className="relative z-10 mx-8 my-10 hidden flex-col items-start justify-center gap-3 lg:flex">
            <img
              src={logo}
              alt="KekeGo"
              className="h-18 w-auto object-contain bg-green-500/10 p-1 backdrop-blur-sm rounded-full"
            />

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl xl:text-[3.5rem]">
              Move around
              <br />
              campus with
              <br />
              <span className="text-[#00D36F]">less stress.</span>
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
              Find your way around campus with less waiting and less stress.
            </p>
          </div>
        </section>

        {/* Form panel */}
        <section className="relative flex min-h-[100svh] min-w-0 items-center justify-center bg-[#FFFEFA] px-4 py-6 pt-20 sm:px-8 sm:py-9 sm:pt-20 md:min-h-0 md:pt-9 lg:h-full lg:overflow-y-auto lg:px-8 lg:py-5 xl:px-12">
          {/* Mobile back button: no image or logo */}
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back to home"
            title="Back to home"
            disabled={isClosing}
            className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#DCE5DC] bg-white text-[#173525] shadow-sm transition hover:border-[#00D36F] hover:bg-[#EAF8EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D36F] md:hidden"
          >
            <ArrowLeft size={19} />
          </button>

          {children}
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;
