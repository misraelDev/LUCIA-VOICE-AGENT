// import { Poppins } from 'next/font/google'
// import { Stethoscope, Sparkles, Phone, Users } from 'lucide-react'
// import { useTranslations } from "@/lib/use-translations"

// const poppins = Poppins({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'],
//   variable: '--font-poppins',
// })

// export default function TargetAudienceSection() {
//   const { t } = useTranslations()
  
//   const cards = [
//     {
//       title: t('uses.cards.health.title'),
//       colorClasses: {
//         text: "text-teal-600",
//         bg: "bg-teal-50",
//         icon: "text-teal-600"
//       },
//       icon: Stethoscope,
//       description: t('uses.cards.health.description')
//     },
//     {
//       title: t('uses.cards.wellness.title'), 
//       colorClasses: {
//         text: "text-amber-500",
//         bg: "bg-amber-50",
//         icon: "text-amber-500"
//       },
//       icon: Sparkles,
//       description: t('uses.cards.wellness.description')
//     },
//     {
//       title: t('uses.cards.callcenter.title'),
//       colorClasses: {
//         text: "text-blue-600",
//         bg: "bg-blue-50",
//         icon: "text-blue-600"
//       },
//       icon: Phone,
//       description: t('uses.cards.callcenter.description')
//     },
//     {
//       title: t('uses.cards.others.title'),
//       colorClasses: {
//         text: "text-rose-500",
//         bg: "bg-rose-50",
//         icon: "text-rose-500"
//       },
//       icon: Users,
//       description: t('uses.cards.others.description')
//     }
//   ]

//   return (
//     <main className="bg-[#f6f6ff]">
// <section className="container mx-auto px-4 py-16">        <div className="w-full max-w-[1400px] mx-auto">
//           {/* Section Title */}
//           <div className="text-center mb-12">
//             <h2 className={`${poppins.className} text-blue-950 text-2xl sm:text-3xl md:text-4xl lg:text-3xl font-bold max-w-[690px] mx-auto`}>
//               {t('uses.title')}
//             </h2>
//           </div>

//           {/* Cards Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {cards.map((card, index) => {
//               const IconComponent = card.icon
//               return (
//                 <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
//                   {/* Icon */}
//                   <div className={`w-12 h-12 ${card.colorClasses.bg} rounded-lg flex items-center justify-center mb-4`}>
//                     <IconComponent className={`w-6 h-6 ${card.colorClasses.icon}`} />
//                   </div>
                  
//                   {/* Title */}
//                   <h3 className={`${poppins.className} ${card.colorClasses.text} text-lg sm:text-xl font-bold mb-3`}>
//                     {card.title}
//                   </h3>
                  
//                   {/* Description */}
//                   <p 
//                     className={`${poppins.className} text-zinc-700 text-sm sm:text-base leading-relaxed`}
//                     dangerouslySetInnerHTML={{ __html: card.description }}
//                   />
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       </section>
//     </main>
//   )
// }