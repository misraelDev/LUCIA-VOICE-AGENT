// import React from "react"
// import Image from "next/image"
// import { Poppins } from 'next/font/google'
// import { useTranslations } from "@/lib/use-translations"

// const poppins = Poppins({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'],
//   variable: '--font-poppins',
// })

// export default function ComparisonSection() {
//   const { t } = useTranslations()
  
//   const comparisonData = [
//     {
//       feature: t('comparison.table.features.availability'),
//       asesor: false,
//       lucia: true,
//       chatbot: true
//     },
//     {
//       feature: t('comparison.table.features.natural'),
//       asesor: true,
//       lucia: true,
//       chatbot: false
//     },
//     {
//       feature: t('comparison.table.features.understanding'),
//       asesor: true,
//       lucia: true,
//       chatbot: false
//     },
//     {
//       feature: t('comparison.table.features.recording'),
//       asesor: false,
//       lucia: true,
//       chatbot: false
//     },
//     {
//       feature: t('comparison.table.features.optimization'),
//       asesor: false,
//       lucia: true,
//       chatbot: false
//     },
//     {
//       feature: t('comparison.table.features.multichannel'),
//       asesor: false,
//       lucia: true,
//       chatbot: false
//     },
//     {
//       feature: t('comparison.table.features.adaptation'),
//       asesor: t('comparison.table.values.medium'),
//       lucia: t('comparison.table.values.high'),
//       chatbot: t('comparison.table.values.low')
//     },
//     {
//       feature: t('comparison.table.features.cost'),
//       asesor: t('comparison.table.values.high'),
//       lucia: t('comparison.table.values.low'),
//       chatbot: t('comparison.table.values.low')
//     }
//   ]

//   const renderCell = (value: boolean | string, isLucia = false) => {
//     if (typeof value === 'boolean') {
//       return value ? (
//         isLucia ? (
//           <Image
//             src="/lucia-vector.svg"
//             alt="Lucia checkmark"
//             width={24}
//             height={24}
//             className="w-6 h-6"
//           />
//         ) : (
//           <Image
//             src="/asesor-chat-chemarck.svg"
//             alt="Checkmark"
//             width={24}
//             height={24}
//             className="w-6 h-6"
//           />
//         )
//       ) : (
//         <Image
//           src="/none-chemark.svg"
//           alt="Not available"
//           width={24}
//           height={24}
//           className="w-6 h-6"
//         />
//       )
//     }
    
//     return (
//       <span className={`${poppins.className} text-sm sm:text-base md:text-lg font-${isLucia ? 'bold text-indigo-700' : 'medium text-zinc-600'}`}>
//         {value}
//       </span>
//     )
//   }

//   return (
//     <main className="bg-[#f6f6ff]">
//       <section className="container mx-auto px-4 py-16">
//         <div className="w-full max-w-[1400px] mx-auto">
//           {/* Top Text Block - Ajustado para consistencia */}
//           <div className="text-center mb-8">
//             <div className={`${poppins.className} max-w-4xl mx-auto flex flex-col gap-4`}>
//               {/* Título principal */}
//               <h2 className="text-violet-950 text-2xl sm:text-3xl md:text-4xl lg:text-3xl font-bold">
//                 {t('comparison.title')}
//               </h2>
              
//               {/* Párrafos separados */}
//               <div className="flex flex-col gap-4">
//                 <p className="text-zinc-800 text-base sm:text-lg md:text-xl lg:text-2xl font-normal leading-relaxed">
//                   {t('comparison.description')}
//                 </p>
               
//                 <p className="text-zinc-800 text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-relaxed">
//                   {t('comparison.description2')}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Comparison Table Container */}
//           <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 overflow-x-auto">
//             {/* Avatar Row */}
//             <div className="grid grid-cols-4 gap-4 items-center mb-6">
//               <div></div>
              
//               {/* Asesor Avatar */}
//               <div className="flex flex-col items-center gap-2">
//                 <div className="relative w-12 h-12">
//                   <Image
//                     className="absolute top-0 left-0 w-full h-full"
//                     width={48}
//                     height={48}
//                     alt="Ellipse"
//                     src="/scale/Ellipse38.svg"
//                   />
//                   <Image
//                     className="absolute top-[1px] left-[1px] w-[46px] h-[46px] object-cover rounded-full"
//                     width={46}
//                     height={46}
//                     alt="Agente humano"
//                     src="/scale/agente-humano.png"
//                   />
//                 </div>
//               </div>

//               {/* Lucía Avatar */}
//               <div className="flex flex-col items-center gap-2">
//                 <div className="relative w-12 h-12">
//                   <div className="absolute top-[2px] left-0 rounded-[50%] bg-indigo-700 w-[48px] h-[48px]" />
//                   <Image
//                     className="absolute top-0 left-0 w-full h-full object-cover"
//                     width={48}
//                     height={48}
//                     alt="Lucia"
//                     src="/avatar.png"
//                   />
//                 </div>
//               </div>

//               {/* Chatbot Avatar */}
//               <div className="flex flex-col items-center gap-2">
//                 <div className="relative w-12 h-12">
//                   <Image
//                     className="absolute top-0 left-0 w-full h-full"
//                     width={48}
//                     height={48}
//                     alt="Ellipse"
//                     src="/scale/Ellipse39.svg"

//                   />
//                   <Image
//                     className="absolute top-[1px] left-[1px] w-[46px] h-[46px] object-cover rounded-full"
//                     width={46}
//                     height={46}
//                     alt="Cliente"
//                     src="/chatbot.png"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Table Header */}
//             <div className="grid grid-cols-4 gap-4 pb-4 border-b border-zinc-200 mb-4">
//               <div className={`${poppins.className} text-zinc-800 text-sm sm:text-base md:text-lg font-semibold`}>
//                 {t('comparison.table.header')}
//               </div>
//               <div className={`${poppins.className} text-zinc-800 text-sm sm:text-base md:text-lg font-semibold text-center`}>
//                 {t('comparison.table.advisor')}
//               </div>
//               <div className={`${poppins.className} text-zinc-800 text-sm sm:text-base md:text-lg font-semibold text-center`}>
//                 {t('comparison.table.lucia')}
//               </div>
//               <div className={`${poppins.className} text-zinc-800 text-sm sm:text-base md:text-lg font-semibold text-center`}>
//                 {t('comparison.table.chatbot')}
//               </div>
//             </div>

//             {/* Table Rows */}
//             <div className="space-y-4">
//               {comparisonData.map((row, index) => (
//                 <div key={index} className="grid grid-cols-4 gap-4 py-3 border-b border-zinc-100 items-center">
//                   <div className={`${poppins.className} text-zinc-600 text-sm sm:text-base font-medium`}>
//                     {row.feature}
//                   </div>
//                   <div className="flex justify-center">
//                     {renderCell(row.asesor)}
//                   </div>
//                   <div className="flex justify-center">
//                     {renderCell(row.lucia, true)}
//                   </div>
//                   <div className="flex justify-center">
//                     {renderCell(row.chatbot)}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Bottom Text Section - Ajustado para consistencia */}
//           <div className="flex flex-col items-center gap-8 text-center mt-8">
//             {/* Main Text Block */}
//             <div className={`${poppins.className} max-w-4xl flex flex-col gap-4`}>
//               <span className="text-indigo-700 text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-relaxed">
//                 {t('comparison.conclusion.title')}
//               </span>
//               <span className="text-zinc-800 text-base sm:text-lg md:text-xl lg:text-2xl font-normal leading-relaxed">
//                 {t('comparison.conclusion.description')}
//               </span>
//             </div>

//             {/* Call to Action */}
//             <div className="flex flex-col items-center gap-6">
//               <p className={`${poppins.className} text-zinc-800 text-base sm:text-lg md:text-xl font-medium max-w-2xl`}>
//                 {t('comparison.cta.title')}
//               </p>
              
//               <button className="px-8 py-4 bg-white rounded-[60px] shadow-[0px_9px_20px_-3px_rgba(120,84,247,0.33)] border-2 border-indigo-700 hover:bg-gray-50 transition-colors">
//                 <span className={`${poppins.className} text-indigo-700 text-base sm:text-lg md:text-xl font-semibold`}>
//                   {t('comparison.cta.button')}
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   )
// }