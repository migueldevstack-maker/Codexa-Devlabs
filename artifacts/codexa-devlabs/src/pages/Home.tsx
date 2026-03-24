import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { WhyUs } from "@/components/WhyUs";
import { Portfolio } from "@/components/Portfolio";
import { Process } from "@/components/Process";
import { TechStack } from "@/components/TechStack";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ProjectModal } from "@/components/ProjectModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar onOpenModal={openModal} />
      <main>
        <Hero onOpenModal={openModal} />
        <Services />
        <WhyUs />
        <Portfolio />
        <Process />
        <TechStack />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      
      {/* Global Interactive Elements */}
      <ProjectModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
