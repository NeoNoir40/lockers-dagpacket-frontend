// import React from "react";
// import Logo from "../assets/images/logo.webp";
// import Package from "../assets/images/package.png";
// import Lottie from "react-lottie";
// import animationData from "../assets/lotties/band.json";
// import animationServices from "../assets/lotties/services_animation.json";
// import animationShipping from "../assets/lotties/shipping.json";
// import animationBills from "../assets/lotties/bills.json";
// import animationPackage from "../assets/lotties/packagelottie.json";
// import SectionTopHome from "../components/SectionTopHome";
// import CardBodyHome from "../components/CardBodyHome";
// import "../assets/css/home.css";

// const top_list = [
//   {
//     Logo: Logo,
//     animationData: animationData,
//     title: "Enfócate en lo que importa, déjanos los ",
//     title_orange: "envíos a nosotros",
//     subtitle:
//       "Con nuestros servicios de envío internacional y nacional, puedes tener la tranquilidad de que tus paquetes llegarán a tiempo y en perfectas condiciones.",
//   },
//   {
//     Logo: Logo,
//     animationData: animationShipping,
//     title: "Realiza envíos ",
//     title_orange: "nacionales e internacionales",
//     subtitle:
//       "Pesa y dimensiona de forma fácil tu paquete, ingrésalo en el locker indicado y nosotros nos encargaremos de lo demás.",
//   },
//   {
//     Logo: Logo,
//     animationData: animationBills,
//     title: "Recarga saldo o " ,
//     title_orange: "paga tus servicios",
//     subtitle:
//       "Paga en nuestras pantallas los servicios más comunes como luz, cable, entretenimiento o recarga saldo a tu número telefónico",
//   },
//   {
//     Logo: Logo,
//     animationData: animationPackage,
//     title: "Recoge tus ",
//     title_orange: "paquetes",
//     subtitle:
//       "Escanea tu código QR y recoge tus paquetes en nuestros lockers de forma rápida y segura.",
//   },
// ];

// export default function HomePage() {
//   return (
//     <main className="flex flex-col w-full h-screen relative overflow-hidden">
//         <SectionTopHome list={top_list} />

//       <section className="flex flex-row justify-around  w-full ">
//         <CardBodyHome
//           title="Envíos"
//           description="Pesa tu paquete, identifica tu locker, y realiza tu envío Nacional o Internacional."
//           image={Package}
//         />
//         <CardBodyHome
//           title="Recibir Paquetes"
//           description="Escanea tu código QR y recolecta tu paquete en nuestros lockers."
//           image={Package}
//         />
//         <CardBodyHome
//           title="Recargas y Servicios"
//           description="Recarga saldo a tu número o paga tus servicios favoritos de manera rápida."
//           lottieAnimation={animationServices}
//         />
//       </section>
//     </main>
//   );
// }
