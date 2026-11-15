import { useNavigate } from "react-router";
import type { MouseEvent } from "react";
import { navigateWithTransition } from "../../utils/pageTransition";
import { Link } from "react-router";
import logo from "../../assets/images/kekeGoLogo.png";




const Navbar = () => {
  const navigate = useNavigate();
  
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-8">
      <div
        className="
          mx-auto flex h-[60px] max-w-7xl items-center
          justify-between gap-2 rounded-2xl border
          border-white/70
          bg-linear-to-r from-[#F9FAF5]/95
          via-[#F4F8F1]/95 to-[#EEF7EF]/95
          px-3 shadow-[0_8px_30px_rgba(17,24,39,0.08)]
          backdrop-blur-xl
          sm:h-[72px] sm:px-5
          lg:h-[76px] lg:px-7
        "
      >
        <Link
          to="/"
          aria-label="KekeGo home"
          className="flex min-w-0 shrink items-center"
        >
          <img
            src={logo}
            alt="KekeGo"
            className="h-8 w-auto max-w-full object-contain sm:h-10 lg:h-11"
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className="flex shrink-0 items-center gap-1 sm:gap-3"
        >
          <Link
            to="/login"
            onClick={(event: MouseEvent<HTMLAnchorElement>) =>
            navigateWithTransition({
              event,
              navigate,
              destination: "/login",
            })
             }
            className="
              rounded-lg px-2.5 py-2 text-xs font-semibold
              text-[#17251B] transition-colors
              hover:bg-white/90
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-[#16A34A]
              sm:px-4 sm:text-sm
            "
          >
            Log in
          </Link>

          <Link
            to="/signup"
              onClick={(event: MouseEvent<HTMLAnchorElement>) =>
                navigateWithTransition({
                  event,
                  navigate,
                  destination: "/signup",
                })
              }
            className="
              whitespace-nowrap rounded-xl bg-[#00D36F]
              px-3 py-2.5 text-xs font-bold text-[#07351F]
              shadow-sm transition-all duration-200
              hover:bg-[#00C565] hover:shadow-md
              focus-visible:outline-none
              focus-visible:ring-4 focus-visible:ring-[#00D36F]/25
              sm:px-5 sm:text-sm
            "
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
