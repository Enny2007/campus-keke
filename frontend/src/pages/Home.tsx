
import Hero from "../components/home/Hero";
import Navbar from "../components/layouts/Navbar";
import WhyChoose from "../components/home/WhyChoose";

// import HowItWorks from "../components/home/HowItWorks";
// import FooterComp from "../layouts/Footer";

const Home = () => {
  return (
    <div className="home-page-transition">
      <Navbar />
      <Hero />
      <WhyChoose />

      {/*
        <HowItWorks />
        <div className="footer-wrap">
          <FooterComp />
        </div>
      */}
    </div>
  );
};

export default Home;
