import {
  ArrowRight,
  MapPin,
  Navigation,
  ShieldCheck,
} from "lucide-react";

const RideJourney = () => {
  return (
    <div className="relative">
      {/* =================================================
          PICKUP
      ================================================== */}
      <div className="animate-ride-pickup relative flex items-start gap-4">
        {/* Icon */}
        <div
          className="
            relative
            z-10
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-green-100
            ring-4
            ring-[#243247]
          "
        >
          <MapPin
            size={19}
            className="text-green-600"
          />
        </div>

        {/* Text */}
        <div className="pt-1">
          <p className="text-xs font-semibold tracking-wide text-white/60">
            PICKUP
          </p>

          <p className="mt-1 font-semibold text-white/90">
            Queen Esther Hall
          </p>
        </div>
      </div>

      {/* =================================================
          FIRST LINE
      ================================================== */}
      <div
        className="
          animate-ride-line-one
          absolute
          left-5
          top-10
          h-12
          -translate-x-1/2
          border-l-2
          border-dashed
          border-white/30
        "
      />

      {/* =================================================
          DESTINATION
      ================================================== */}
      <div
        className="
          animate-ride-destination
          relative
          mt-12
          flex
          items-start
          gap-4
        "
      >
        {/* Icon */}
        <div
          className="
            relative
            z-10
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-yellow-100
            ring-4
            ring-[#243247]
          "
        >
          <Navigation
            size={19}
            className="text-yellow-600"
          />
        </div>

        {/* Text */}
        <div className="pt-1">
          <p className="text-xs font-semibold tracking-wide text-white/60">
            DESTINATION
          </p>

          <p className="mt-1 font-semibold text-white/90">
            Campus Gate
          </p>
        </div>
      </div>

      {/* =================================================
          SECOND LINE
      ================================================== */}
      <div
        className="
          animate-ride-line-two
          absolute
          left-5
          top-112px
          h-12
          -translate-x-1/2
          border-l-2
          border-dashed
          border-white/30
        "
      />

      {/* =================================================
          READY TO RIDE
      ================================================== */}
      <div
        className="
          animate-ride-ready
          relative
          mt-12
          flex
          items-start
          gap-4
        "
      >
        {/* Icon */}
        <div
          className="
            relative
            z-10
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-green-500
            text-white
            ring-4
            ring-[#243247]
          "
        >
          <ArrowRight size={19} />
        </div>

        {/* Text */}
        <div className="pt-1">
          <p className="text-xs font-semibold tracking-wide text-white/60">
            READY TO RIDE?
          </p>

          <p className="mt-1 font-semibold text-white/90">
            Get started with CampusKeke
          </p>
        </div>
      </div>

      {/* Trust message */}
      <div className="mt-7 flex items-center justify-center gap-2 text-xs text-white/50">
        <ShieldCheck
          size={15}
          className="text-green-400"
        />

        Verified campus transportation
      </div>
    </div>
  );
};

export default RideJourney;