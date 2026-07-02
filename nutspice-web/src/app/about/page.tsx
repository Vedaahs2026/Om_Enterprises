"use client";

import React from "react";
import { Mail, Phone, Camera, Share2, Send, MessageCircle, MapPin, Clock, Navigation } from "lucide-react";

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-brand-light text-brand-dark">
      
      {/* Store Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-dark/75 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80")' }}
        ></div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <span className="text-brand-accent font-black uppercase tracking-[0.4em] text-xs mb-4 block">Visit Us In Person</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Our Showroom</h1>
          <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Experience the premium build, quality certifications, and explore our range of electrical & electronics supplies.
          </p>
        </div>
      </section>

      {/* Store Details & Map Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Store Info */}
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold text-brand mb-6">OM Enterprises Experience Center</h2>
              <p className="text-brand-dark/70 leading-relaxed text-lg mb-8">
                Welcome to our state-of-the-art experience center. We showcase heavy industrial cables, premium modular panels, switchgears, and power automation boards. Contractors and project builders can consult with our technical specialists on site.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand/5 flex items-start space-x-4">
                <div className="p-3 bg-brand/5 rounded-2xl text-brand flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-brand mb-2 uppercase tracking-widest text-xs">Location</h4>
                  <p className="text-sm text-brand-dark/60 leading-relaxed">
                    12-3, Main Road, <br/>
                    Electronics Market, <br/>
                    Hyderabad-500095, India
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand/5 flex items-start space-x-4">
                <div className="p-3 bg-brand/5 rounded-2xl text-brand flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-brand mb-2 uppercase tracking-widest text-xs">Store Hours</h4>
                  <p className="text-sm text-brand-dark/60 leading-relaxed">
                    <span className="block mb-1"><strong>Mon - Sat:</strong> 9:00 AM - 7:00 PM</span>
                    <span className="block text-red-500"><strong>Sunday:</strong> Closed</span>
                  </p>
                </div>
              </div>
            </div>

            <a href="https://maps.google.com/?q=Electronics+Market+Hyderabad" target="_blank" rel="noreferrer" className="inline-flex items-center space-x-3 bg-brand text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-brand-hover transition-all shadow-lg active:scale-95 group">
              <span>Get Directions</span>
              <Navigation size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>

          {/* Map Embed */}
          <div className="relative h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
            <iframe 
              src="https://maps.google.com/maps?q=Electronics+Market+Hyderabad&t=&z=14&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[30%] contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="bg-brand py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
              Get In Touch <Mail size={24} className="text-brand-accent" />
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-accent transition-all duration-500">
                  <Mail size={20} className="text-brand-accent group-hover:text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Email Us</p>
                  <p className="text-lg font-bold">omenterprises@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-accent transition-all duration-500">
                  <Phone size={20} className="text-brand-accent group-hover:text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Call Us</p>
                  <p className="text-lg font-bold">+91 9704761386</p>
                </div>
              </div>
              
              <a href="https://wa.me/919704761386" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#25D366] transition-all duration-500">
                  <MessageCircle size={20} className="text-brand-accent group-hover:text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">WhatsApp Us</p>
                  <p className="text-lg font-bold">+91 9704761386</p>
                </div>
              </a>
            </div>
          </div>
          
          <div className="bg-white/5 p-10 md:p-14 rounded-[3rem] border border-white/10 backdrop-blur-md">
            <h4 className="text-xl font-bold mb-8">Industrial & Project Supply</h4>
            <div className="grid grid-cols-2 gap-4">
              <a href="mailto:omenterprises@gmail.com" className="flex items-center justify-center gap-3 p-5 bg-white/5 rounded-2xl hover:bg-brand-accent transition-all group">
                <Mail size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Email Quote</span>
              </a>
              <a href="tel:+919704761386" className="flex items-center justify-center gap-3 p-5 bg-white/5 rounded-2xl hover:bg-brand-dark transition-all group">
                <Phone size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Call Hotline</span>
              </a>
              <div className="col-span-2 p-5 bg-white/5 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-center">
                Dedicated B2B Pricing Available
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
