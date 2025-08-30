export default function HeaderPageComponent(props) {
  return (
    <div className={`${props.className || "bg-[#1e3a8a]"}`}>
      <div
        className={`${
          props.className ||
          "container flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 px-4 py-5"
        }`}
      >
        <h2 className="font-bold text-xl sm:text-2xl text-white leading-tight flex items-center">
          <i
            className={`${props.iconClass || "fas fa-users"} mr-3 opacity-80`}
          ></i>
          {props.title || "Daftar Wakil Rakyat"}
        </h2>

        {props.showManageProfile && (
          <a
            href={props.manageProfileLink || "/wakil-rakyat/profile"}
            className="bg-[#f97316] hover:bg-[#ea580c] hover:text- text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center whitespace-nowrap"
          >
            <i
              className={`${props.manageProfileIcon || "fas fa-user-cog"} mr-2`}
            ></i>
            {props.manageProfileText || "Kelola Profil Saya"}
          </a>
        )}
      </div>
    </div>
  );
}
