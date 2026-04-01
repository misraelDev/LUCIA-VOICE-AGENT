// "use client"

// import React from "react"
// import Image from "next/image"
// import { Poppins } from 'next/font/google'
// import { useTranslations } from "@/lib/use-translations"

// const poppins = Poppins({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'],
//   variable: '--font-poppins',
// })

// const About = () => {
//   const { t } = useTranslations()

//   return (
//     <main className="bg-[#f6f6ff]">
//       {/* About Section */}
//       <section className="container mx-auto px-4 py-16">
//         <div className="w-full max-w-[1400px] mx-auto">
//           <div className="grid md:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center">
//             {/* Columna 1: Imagen */}
//             <div className="w-full flex justify-center order-2 md:order-1">
//               <div className="relative w-full max-w-[500px] md:max-w-[600px] h-[400px] md:h-[700px]">
//                 <div className="absolute inset-0 rounded-3xl">
//                   <Image
//                     src="/abot.png"
//                     alt="Lucia segunda imagen"
//                     width={600}
//                     height={735}
//                     className="w-full h-full object-cover object-center rounded-3xl"
//                     priority
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Columna 2: Contenido */}
//             <div className="w-full order-1 md:order-2">
//               <div className="flex flex-col gap-6 md:gap-8">
//                 {/* How It Works Content */}
//                 <div className="flex flex-col gap-4">
//                   <div className={`${poppins.className} text-zinc-800 text-sm sm:text-base md:text-xl font-semibold uppercase tracking-widest`}>
//                     {t('about.sectionTitle')}
//                   </div>
//                   <div className={`${poppins.className} text-zinc-800 text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold leading-tight`}>
//                     {t('about.title')}
//                     <br />
//                     <span className="text-indigo-700">{t('about.subtitle')}</span>
//                   </div>
//                   <div className={`${poppins.className} w-full max-w-[497px] text-blue-950 text-sm sm:text-base md:text-xl font-bold`}>
//                     {t('about.description')}
//                     <span className="text-zinc-800 font-normal"> {t('about.description2')}</span>
//                   </div>

//                   {/* Steps with vertical line */}
//                   <div className="py-3.5 relative flex flex-col gap-6 md:gap-10">
//                     {/* Vertical line - conecta solo entre círculos */}
//                     <div className="absolute left-[20px] md:left-[24px] top-[40px] md:top-[48px] bottom-[40px] md:bottom-[48px] w-1 bg-violet-200 z-0" />

//                     {/* Step 1 */}
//                     <div className="flex items-start gap-3 md:gap-4 relative z-10">
//                       <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-bold flex-shrink-0">
//                         1
//                       </div>
//                       <div className="flex-1">
//                         <span className={`${poppins.className} text-indigo-600 text-base sm:text-lg md:text-2xl font-bold leading-normal`}>
//                           {t('about.step1.title')}
//                           <br />
//                         </span>
//                         <span className={`${poppins.className} text-zinc-600 text-sm md:text-base font-normal leading-normal`}>
//                           {t('about.step1.description')}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Step 2 */}
//                     <div className="flex items-start gap-3 md:gap-4 relative z-10">
//                       <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-bold flex-shrink-0">
//                         2
//                       </div>
//                       <div className="flex-1">
//                         <span className={`${poppins.className} text-indigo-600 text-base sm:text-lg md:text-2xl font-bold leading-normal`}>
//                           {t('about.step2.title')}
//                           <br />
//                         </span>
//                         <span className={`${poppins.className} text-zinc-600 text-sm md:text-base font-normal leading-tight`}>
//                           {t('about.step2.description')}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Step 3 */}
//                     <div className="flex items-start gap-3 md:gap-4 relative z-10">
//                       <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-700 rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-bold flex-shrink-0">
//                         3
//                       </div>
//                       <div className="flex-1">
//                         <span className={`${poppins.className} text-indigo-700 text-base sm:text-lg md:text-2xl font-bold leading-normal`}>
//                           {t('about.step3.title')}
//                           <br />
//                         </span>
//                         <span className={`${poppins.className} text-zinc-600 text-sm md:text-base font-normal leading-tight`}>
//                           {t('about.step3.description')}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   )
// }

// export default About