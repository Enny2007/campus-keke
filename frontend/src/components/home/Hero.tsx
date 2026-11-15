import happyPeople from "../../assets/images/happyPeople.png";
import {
  ArrowRight,
  Navigation,
  ShieldCheck,
} from "lucide-react";
import RideJourney from "./RideJourney";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routePaths";
import { useNavigate } from "react-router";
import type { MouseEvent } from "react";
import { navigateWithTransition } from "../../utils/pageTransition";

  

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section
      className="relative overflow-hidden bg-slate-950 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${happyPeople})`,
      }}
    >
      {/* Background overlay
          Darker on the left for text readability,
          lighter on the right so the image remains visible. */}
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/20" />

      {/* Extra mobile overlay for better readability */}
      <div className="absolute inset-0 bg-black/10 sm:bg-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-1">
        <div
          className="
            grid
            min-h-[calc(100svh-80px)]
            grid-cols-1
            items-center
            gap-10
            py-10
            sm:py-14
            lg:grid-cols-2
            lg:gap-16
            lg:py-20
          "
        >
          {/* =====================================================
              LEFT SIDE
          ====================================================== */}
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <div
              className="
                mb-5
                hidden
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-white/30
                bg-white/95
                px-4
                py-2
                text-xs
                font-semibold
                text-green-700
                shadow-lg
                backdrop-blur-md
                sm:mb-6
                sm:text-sm
                lg:mt-6
                md:inline-flex
              "
            >
              <span className="h-2 w-2 rounded-full  bg-green-500" />

              Campus transportation, made easier
            </div>

            {/* Heading */}
            <h1
              className="
                max-w-2xl
                text-4xl
                mt-14
                font-bold
                leading-[1.08]
                tracking-tight
                text-white
                sm:text-5xl
                md:text-6xl
                md:mt-0
                lg:text-6xl
                xl:text-7xl
              "
            >
              Move around campus{" "}
              <span className="text-green-400">
                without the stress.
              </span>
            </h1>

            {/* Description */}
            <p
              className="
                mt-5
                max-w-xl
                text-base
                leading-7
                text-white/85
                sm:mt-6
                sm:text-lg
                sm:leading-8
              "
            >
              Find a nearby Keke, choose where you're going, and get
              matched with a verified campus driver in just a few clicks.
            </p>

            {/* CTA Buttons */}
            <div
              className="
                mt-7
                flex
                w-full
                flex-col
                gap-3
                sm:mt-8
                sm:w-auto
                sm:flex-row
                sm:flex-wrap
              "
            >
              {/* Primary CTA */}
              <Link
              to={ROUTES.signup}
                            onClick={(event: MouseEvent<HTMLAnchorElement>) =>
                  navigateWithTransition({
                    event,
                    navigate,
                    destination: ROUTES.signup,
                  })
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-green-500
                  px-16
                  py-3.5
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-green-950/30
                  transition
                  hover:bg-green-400
                  active:scale-[0.98]
                  sm:w-auto
                "
              >
                Find a Keke
                <ArrowRight size={18} />
              </Link>

             
            </div>

            {/* Trust indicators */}
            <div
              className="
                mt-7
                flex
                flex-wrap
                gap-x-6
                gap-y-3
                text-sm
                text-white/80
                sm:mt-8
                mb-10
              "
            >
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={18}
                  className="text-green-400"
                />
                <span>Verified drivers</span>
              </div>

              <div className="flex items-center gap-2 ">
                <Navigation
                  size={18}
                  className="text-green-400"
                />
                <span>Campus routes</span>
              </div>
            </div>
          </div>
{/* =====================================================
    RIGHT SIDE — RIDE JOURNEY PREVIEW
====================================================== */}
<div
  className="
    relative
    flex
    w-full
    items-center
    justify-center
    lg:justify-end
  "
>
  {/* Decorative green circle */}
  <div
    className="
      absolute
      -right-6
      -top-8
      hidden
      h-24
      w-24
      rounded-full
      border-8
      border-green-200/70
      lg:block
    "
  />

  {/* Decorative yellow circle */}
  <div
    className="
      absolute
      -bottom-10
      right-12
      hidden
      h-28
      w-28
      rounded-full
      bg-yellow-200/40
      blur-sm
      lg:block
    "
  />

  {/* Main Ride Preview Card */}
  <div
    className="
      relative
      z-10
      w-full
      max-w-lg
      rounded-3xl
      border
      border-white/50
      bg-slate-800/90
      p-6
      shadow-2xl
      shadow-black/25
      backdrop-blur-xl
      sm:p-7
      lg:max-w-md
      xl:max-w-lg
    "
  >
    {/* Card Header */}
    <div className="mb-7">
      <p className="text-sm font-medium text-green-600">
        CampusKeke
      </p>

      <h2
        className="
          mt-1
          text-2xl
          font-bold
          tracking-tight
          text-white
          sm:text-3xl
        "
      >
        Your ride starts here.
      </h2>

      <p className="mt-2 text-sm leading-6 text-white/80">
        Simple, safe transportation designed around your campus.
      </p>
    </div>

   <RideJourney />
   

    
  </div>

  {/* =================================================
      FLOATING DRIVER CARD
  ================================================== */}
  <div
    className="
      absolute
      -bottom-7
      -left-6
      z-20
      hidden
      rounded-2xl
      border
      border-slate-100
      bg-white
      p-4
      shadow-xl
      sm:block
      lg:-left-10
    "
  >
    <div className="flex items-center gap-3">
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-green-100
          font-bold
          text-green-700
        "
      >
        CK
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">
          Campus Driver
        </p>

        <div className="flex items-center gap-1 text-xs text-slate-500">
          <span className="text-yellow-500">★</span>
          4.9 · Verified
        </div>
      </div>

      <span className="ml-2 h-2.5 w-2.5 rounded-full bg-green-500" />
    </div>
  </div>
  </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;