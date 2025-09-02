export default function QuickNavCard({
  route,
  icon,
  title,
  desc,
  moreText = "Lihat Selengkapnya",
  className = "bg-gradient-to-br from-indigo-500 to-purple-600",
  titleClass = "text-2xl font-bold",
  descClass = "text-sm opacity-90 mt-1"
}) {
  return (
    <a href={route} className="group block relative flex-1 min-w-0">
      <div className={`relative transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl rounded-xl p-6 text-white overflow-hidden h-full ${className}`}>
        {/* Icon background besar */}
        <div className="absolute right-4 text-8xl text-white opacity-20 transform rotate-[-15deg]">
          <i className={`fas ${icon}`}></i>
        </div>

        {/* Konten utama */}
        <div className="relative z-10">
          <h3 className={titleClass}>{title}</h3>
          <p className={descClass}>{desc}</p>
          <div className="flex items-center text-sm font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>{moreText}</span>
            <i className="fas fa-arrow-right ml-2 transition-transform duration-300 group-hover:translate-x-1"></i>
          </div>
        </div>
      </div>
    </a>
  );
}