// import type React from "react"
// import { Poppins } from "next/font/google"
// import Image from "next/image"
// import { useTranslations } from "@/lib/use-translations"

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-poppins",
// })

// const Features: React.FC = () => {
//   const { t } = useTranslations()
  
//   return (
//     <section className={`w-full px-4 sm:px-6 lg:px-24 py-8 md:py-12 ${poppins.className} bg-[#f6f6ff]`}>
//       <div className="max-w-[1440px] mx-auto flex flex-col justify-center items-center gap-6 md:gap-11">
//         <div className="flex flex-col justify-start items-center gap-6 md:gap-11">
//           <div className="w-full max-w-[806px] flex flex-col justify-center items-center gap-4">
//             <div className="self-stretch text-center text-zinc-800 text-sm sm:text-base md:text-lg lg:text-xl font-semibold uppercase tracking-widest">
//               {t('features.sectionTitle')}
//             </div>
//             <div className="self-stretch text-center">
//               <span className="text-zinc-800 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight md:leading-[60px]">
//                 {t('features.title')}
//                 <br />
//               </span>
//               <span className="text-indigo-700 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight md:leading-[60px]">
//                 {t('features.subtitle')}
//               </span>
//             </div>
//             <div className="w-full max-w-[690px] text-center px-2">
//               <span className="text-blue-950 text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
//                 {t('features.description')}{" "}
//               </span>
//               <span className="text-indigo-700 text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
//                 {t('features.luciaName')}
//               </span>
//               <span className="text-zinc-800 text-base sm:text-lg md:text-xl lg:text-2xl font-normal">
//                 {" "}
//                 {t('features.description2')}
//               </span>
//             </div>
//           </div>

//           <div className="w-full max-w-[1234px] grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-14">
//             {/* First Card */}
//             <div className="bg-gradient-to-b from-blue-700 to-blue-800 text-white rounded-2xl p-4 sm:p-6 md:p-8 relative md:overflow-visible overflow-hidden min-h-[450px] md:min-h-[350px]">
//               <div className="relative z-10">
//                 <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
//                   <span className="text-white">{t('features.luciaName')}</span>, {t('features.card1.title')}
//                 </h3>
//                 <p className="text-lg sm:text-xl md:text-2xl font-bold mb-6 md:mb-8">{t('features.card1.subtitle')}</p>

//                 <ul className="space-y-4 md:space-y-6 md:pl-16 lg:pl-32">
//                   <li className="flex items-start">
//                     <div className="mr-3 mt-1 flex-shrink-0">
//                       <Image
//                         src="/checkmark-circle.svg"
//                         alt="Checkmark"
//                         width={16}
//                         height={16}
//                         className="text-white"
//                       />
//                     </div>
//                     <div>
//                       <p className="font-medium text-sm md:text-base">
//                         {t('features.card1.items.calls.title')} <span className="font-bold">{t('features.card1.items.calls.number')}</span>
//                       </p>
//                       <p className="font-bold text-sm md:text-base">{t('features.card1.items.calls.subtitle')}</p>
//                     </div>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="mr-3 mt-1 flex-shrink-0">
//                       <Image
//                         src="/checkmark-circle.svg"
//                         alt="Checkmark"
//                         width={16}
//                         height={16}
//                         className="text-white"
//                       />
//                     </div>
//                     <div>
//                       <p className="font-medium text-sm md:text-base">
//                         {t('features.card1.items.greetings.title')} <span className="font-bold">{t('features.card1.items.greetings.subtitle')}</span>
//                       </p>
//                     </div>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="mr-3 mt-1 flex-shrink-0">
//                       <Image
//                         src="/checkmark-circle.svg"
//                         alt="Checkmark"
//                         width={16}
//                         height={16}
//                         className="text-white"
//                       />
//                     </div>
//                     <div>
//                       <p className="font-medium text-sm md:text-base">
//                         {t('features.card1.items.accents.title')} <span className="font-bold">{t('features.card1.items.accents.subtitle')}</span>
//                       </p>
//                     </div>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="mr-3 mt-1 flex-shrink-0">
//                       <Image
//                         src="/checkmark-circle.svg"
//                         alt="Checkmark"
//                         width={16}
//                         height={16}
//                         className="text-white"
//                       />
//                     </div>
//                     <div>
//                       <p className="font-medium text-sm md:text-base">
//                         {t('features.card1.items.availability.title')} <span className="font-bold">{t('features.card1.items.availability.subtitle')}</span>
//                       </p>
//                       <p className="font-bold text-sm md:text-base">{t('features.card1.items.availability.subtitle2')}</p>
//                     </div>
//                   </li>
//                 </ul>
//               </div>

//               {/* Image - Mobile: inside card, Desktop: outside card aligned to bottom */}
//               <div className="absolute bottom-4 right-4 w-32 h-32 md:bottom-0 md:-left-12 lg:-left-24 md:w-48 lg:w-64 md:h-48 lg:h-64 md:right-auto">
//                 <div className="relative w-full h-full">
//                   <Image
//                     src="/1.png"
//                     alt="Chat interface de Lucia"
//                     width={300}
//                     height={300}
//                     className="object-contain w-full h-full"
//                     priority
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Second Card */}
//             <div className="bg-gradient-to-b from-lime-600 to-lime-900 text-white rounded-2xl p-4 sm:p-6 md:p-8 relative md:overflow-visible overflow-hidden min-h-[450px] md:min-h-[350px]">
//               <div className="relative z-10">
//                 <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
//                   <span className="text-white">{t('features.luciaName')}</span>, {t('features.card2.title')}
//                 </h3>
//                 <p className="text-lg sm:text-xl md:text-2xl font-bold mb-6 md:mb-8">{t('features.card2.subtitle')}</p>

//                 <ul className="space-y-4 md:space-y-6">
//                   <li className="flex items-start">
//                     <div className="mr-3 mt-1 flex-shrink-0">
//                       <Image
//                         src="/checkmark-circle.svg"
//                         alt="Checkmark"
//                         width={16}
//                         height={16}
//                         className="text-white"
//                       />
//                     </div>
//                     <div>
//                       <p className="font-medium text-sm md:text-base">
//                         {t('features.card2.items.responses.title')} <span className="font-bold">{t('features.card2.items.responses.subtitle')}</span>
//                       </p>
//                     </div>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="mr-3 mt-1 flex-shrink-0">
//                       <Image
//                         src="/checkmark-circle.svg"
//                         alt="Checkmark"
//                         width={16}
//                         height={16}
//                         className="text-white"
//                       />
//                     </div>
//                     <div>
//                       <p className="font-medium text-sm md:text-base">{t('features.card2.items.reminders.title')}</p>
//                       <p className="font-bold text-sm md:text-base">{t('features.card2.items.reminders.subtitle')}</p>
//                     </div>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="mr-3 mt-1 flex-shrink-0">
//                       <Image
//                         src="/checkmark-circle.svg"
//                         alt="Checkmark"
//                         width={16}
//                         height={16}
//                         className="text-white"
//                       />
//                     </div>
//                     <div>
//                       <p className="font-medium text-sm md:text-base">{t('features.card2.items.confirmations.title')}</p>
//                       <p className="font-bold text-sm md:text-base">{t('features.card2.items.confirmations.subtitle')}</p>
//                     </div>
//                   </li>
//                 </ul>
//               </div>

//               {/* Image - Mobile: inside card, Desktop: outside card aligned to bottom */}
//               <div className="absolute bottom-4 left-4 w-32 h-32 md:bottom-0 md:-right-12 lg:-right-24 md:w-48 lg:w-64 md:h-48 lg:h-64 md:left-auto">
//                 <div className="relative w-full h-full">
//                   <Image
//                     src="/luciav2.png"
//                     alt="Chat interface de Lucia"
//                     width={300}
//                     height={300}
//                     className="object-contain w-full h-full"
//                     priority
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Features