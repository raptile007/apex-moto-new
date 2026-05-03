"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useState } from "react"

export function Footer() {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast.success("Thanks for subscribing!", {
        description: "You'll receive our latest updates and offers."
      })
      setEmail("")
    }
  }

  const links = {
    shop: ["Brakes", "Engine Parts", "Drive Train", "Tyres", "Accessories"],
    brands: ["KTM", "Honda", "Yamaha", "Bajaj"],
    support: ["Contact Us", "FAQs", "Shipping", "Returns", "Warranty"],
    company: ["About Us", "Careers", "Press", "Blog", "Admin Dashboard"]
  }

  const socials = [
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Youtube, label: "YouTube", href: "#" },
    { icon: Github, label: "GitHub", href: "https://github.com/raptile007/apex-moto-new" }
  ]

  return (
    <footer className="bg-[#050505] text-white border-t border-white/5">
      {/* Newsletter Section */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h3 className="text-4xl font-display font-black italic uppercase tracking-tighter mb-4">Join the <span className="text-apex-orange">Elite</span></h3>
              <p className="text-neutral-500 max-w-sm">
                Get exclusive drops, racing insights, and performance tips delivered to your cockpit.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <Input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-14 bg-white/5 border-white/10 text-white placeholder:text-neutral-600 rounded-2xl focus:border-apex-orange/50 uppercase text-[10px] font-black tracking-widest"
                required
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="h-14 px-8 rounded-2xl bg-apex-orange text-white hover:bg-apex-orange/90 font-black italic uppercase tracking-tighter">
                  SUBSCRIBE
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-apex-orange rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,77,0,0.3)]">
                  <span className="text-white font-black text-lg font-display italic">A</span>
                </div>
                <span className="font-display font-black text-2xl tracking-tighter text-white uppercase italic">Apex<span className="text-apex-orange">Moto</span></span>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                Premium motorcycle parts engineered for performance. 
                Built for champions, by champions.
              </p>
              <div className="flex gap-4">
                {socials.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2, color: "#ff4d00" }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-all border border-white/5"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-neutral-300">
                {title}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <motion.a
                      href={item === "Admin Dashboard" ? "/admin" : "#"}
                      whileHover={{ x: 4 }}
                      className="text-sm text-neutral-400 hover:text-white transition-colors inline-block"
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <div className="flex flex-wrap gap-8 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>support@apexmoto.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+91 1800 123 4567</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Mumbai, Maharashtra, India</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
            <p>&copy; {new Date().getFullYear()} ApexMoto. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
