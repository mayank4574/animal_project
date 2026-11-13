import { Stethoscope, Building2, Home, Microscope, Truck, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import ServiceCard from '../ui/ServiceCard'

const services = [
  { icon: Stethoscope, title: 'Veterinary Clinics', category: 'Veterinary Clinic', description: 'Find experienced veterinarians for routine checkups and medical consultations.' },
  { icon: Building2, title: 'Animal Hospitals', category: 'Animal Hospital', description: 'Discover facilities for advanced treatment and emergency care.' },
  { icon: Home, title: 'Pet Boarding', category: 'Pet Boarding', description: 'Find safe and comfortable boarding facilities for animals.' },
  { icon: Microscope, title: 'Diagnostics', category: 'Diagnostics', description: 'Explore diagnostic centres for animal health testing.' },
  { icon: Truck, title: 'Animal Ambulance', category: 'Animal Ambulance', description: 'Discover animal ambulance and emergency transportation services.' },
  { icon: Heart, title: 'Animal NGOs', category: 'Animal NGO', description: 'Connect with organizations supporting animal welfare and rescue.' },
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-[#172B3A]">Our Services</h2>
          <p className="text-[#64748B] mt-2">Discover the right care for your animal companion</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ServiceCard {...s} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
