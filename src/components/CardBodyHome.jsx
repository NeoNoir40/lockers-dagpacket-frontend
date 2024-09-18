import Lottie from "react-lottie";


export default function CardBodyHome({
  title,
  description,
  image,
  lottieAnimation,
}) {
  return (
  <div className="card-container flex flex-col justify-center items-center h-full gap-2 w-[60%] relative bg-[#F3F4F6]">
    <h1 className="font-medium text-center text-3xl font-sans">{title}</h1>
    <p className="text-center">{description}</p>
    {image ? (
      <img src={image} alt={`Imagen de ${title}`} className="w-[50%] h-[60%]" />
    ) : (
      <div className="w-[60%] h-[70%]">
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: lottieAnimation,
            speed: 1,
          }}
        />
      </div>
    )}
  </div>
);
}
