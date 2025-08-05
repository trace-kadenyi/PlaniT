import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import LogoWordmark from "../headers/LogoWordmark";
import { Menu, X } from "lucide-react"; // or any other icon lib

export default function PrimaryHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#9B2C62] shadow-sm text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/">
            <LogoWordmark />
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm font-semibold">
          <Link to="/events" className="hover:text-[#F59E0B] transition">
            Events
          </Link>
          <Link to="/clients" className="hover:text-[#F59E0B] transition">
            Clients
          </Link>
          <Link to="/vendors" className="hover:text-[#F59E0B] transition">
            Vendors
          </Link>
          <Link to="/tasks/board" className="hover:text-[#F59E0B] transition">
            Tasks Board
          </Link>
          <Link to="/events/board" className="hover:text-[#F59E0B] transition">
            Events Board
          </Link>
        </nav>

        {/* Right: Sign In & Mobile Menu Toggle */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link to="/signin">
            <Button variant="outline">Sign In</Button>
          </Link>

          {/* Hamburger Menu Toggle (mobile only) */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-sm font-semibold bg-[#9B2C62]">
          <Link to="/board" className="block hover:text-[#F59E0B]">
            Dashboard
          </Link>
          <Link to="/events" className="block hover:text-[#F59E0B]">
            Events
          </Link>
          <Link to="/tasks" className="block hover:text-[#F59E0B]">
            Tasks
          </Link>
        </div>
      )}
    </header>
  );
}
