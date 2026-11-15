import { Clock, DollarSign, BadgeCheck, School } from "lucide-react";

const cards = [
  {
    icon: Clock,
    Title: "Quick Pickup",
    Description: "Get matched with nearby drivers in seconds",
  },
  {
    icon: DollarSign,
    Title: "Affordable Fares",
    Description: "Student-friendly pricing for all routes",
  },
  {
    icon: BadgeCheck,
    Title: "Safe & Secure",
    Description: "Verified campus drivers only",
  },
  {
    icon: School,
    Title: "Campus Coverage",
    Description: "All major campus locations covered",
  },
];

const WhyChoose = () => {
  return (
    <>
      <section className="py-20 md:px-20 bg-[#FAFAFA]">
        <h2 className="text-4xl text-center font-bold">
          Why Choose CampusKeke?
        </h2>
        <div className="mt-10 mx-5 md:mt-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-3xl p-10 text-center hover:shadow-2xl transition"
            >
              <card.icon
                aria-label={card.Title}
                className="mx-auto mb-4 w-12 h-12 hover:scale-110 transition-transform"
              />

              <h3 className="text-xl font-semibold mb-2">{card.Title}</h3>

              <p className="text-gray-600">{card.Description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default WhyChoose;
