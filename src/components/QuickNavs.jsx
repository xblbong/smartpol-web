import QuickNavCard from './QuickNavCard';

export default function QuickNavs({
  items = [], // ← daftar navigasi datang dari props
  containerClass = "flex flex-col md:flex-row gap-3 mb-10",
  moreText = "Lihat Selengkapnya",
}) {
  return (
    <div className={containerClass}>
      {items.map((nav, index) => (
        <QuickNavCard
          key={index}
          route={nav.route}
          icon={nav.icon}
          title={nav.title}
          desc={nav.desc}
          moreText={moreText}
          className={nav.className || "bg-gradient-to-br from-indigo-500 to-purple-600"}
        />
      ))}
    </div>
  );
}