import ButtonComponent from "./ButtonComponent";

// Helper function untuk mendapatkan badge class
const getBadgeClass = (type, value) => {
  if (type === "status") {
    switch (value) {
      case "terjadwal":
        return "bg-blue-100 text-blue-800";
      case "berlangsung":
        return "bg-green-100 text-green-800";
      case "selesai":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  } else if (type === "jenis") {
    switch (value) {
      case "webinar":
        return "bg-purple-100 text-purple-800";
      case "diskusi publik":
        return "bg-yellow-100 text-yellow-800";
      case "materi edukasi":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
  return "";
};


export default function ForumCard ({ forum, authUser, onRegister, onEdit, onDelete }) {
  const isCreator = authUser && forum.created_by === authUser.id;
  const isRegistered = authUser && forum.isRegistered;
  const hasAvailableSlots =
    forum.kapasitas_peserta === null ||
    forum.jumlah_peserta < forum.kapasitas_peserta;
  const canRegister =
    authUser &&
    !isCreator &&
    !isRegistered &&
    hasAvailableSlots &&
    ["terjadwal", "berlangsung"].includes(forum.status);

  const forumDate = forum.tanggal_mulai ? new Date(forum.tanggal_mulai) : null;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
      {forum.thumbnail ? (
        <div
          className="h-48 bg-cover bg-center rounded-t-xl"
          style={{ backgroundImage: `url('${forum.thumbnail}')` }}
        ></div>
      ) : (
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center rounded-t-xl">
          <i
            className={`fas fa-${
              forum.jenis === "webinar"
                ? "video"
                : forum.jenis === "diskusi publik"
                ? "comments"
                : "graduation-cap"
            } text-5xl text-white`}
          ></i>
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${getBadgeClass(
              "status",
              forum.status
            )}`}
          >
            <i className="fas fa-circle text-xs"></i>
            {forum.status.charAt(0).toUpperCase() + forum.status.slice(1)}
          </span>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${getBadgeClass(
              "jenis",
              forum.jenis
            )}`}
          >
            {forum.jenis.replace("_", " ").charAt(0).toUpperCase() +
              forum.jenis.slice(1)}
          </span>
          {isCreator && (
            <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              <i className="fas fa-user"></i>
              <span>Forum Saya</span>
            </span>
          )}
        </div>

        <h3 className="capitalize text-lg font-semibold text-gray-900 mb-2 line-clamp-2 h-14">
          {forum.judul}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {forum.deskripsi}
        </p>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          {forumDate && (
            <div className="flex items-center">
              <i className="fas fa-calendar w-4 mr-2 text-center text-gray-400"></i>
              <span>
                {forumDate.toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                ,{" "}
                {forumDate.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
          {forum.narasumber && (
            <div className="flex items-center">
              <i className="fas fa-user-tie w-4 mr-2 text-center text-gray-400"></i>
              <span>{forum.narasumber}</span>
            </div>
          )}
          {forum.kapasitas_peserta && (
            <div className="flex items-center">
              <i className="fas fa-users w-4 mr-2 text-center text-gray-400"></i>
              <span>
                {forum.jumlah_peserta}/{forum.kapasitas_peserta} peserta
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto border-t border-gray-200 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2">
              {authUser && (
                <>
                  {isCreator ? (
                    <>
                      <ButtonComponent
                        onClick={() => onEdit(forum.id)}
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-2 rounded-lg text-xs transition duration-300 flex items-center"
                      >
                        <i className="fas fa-edit mr-1"></i>Edit
                      </ButtonComponent >
                      <ButtonComponent
                        onClick={() => onDelete(forum.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg text-xs transition duration-300 flex items-center"
                      >
                        <i className="fas fa-trash mr-1"></i>Hapus
                      </ButtonComponent >
                    </>
                  ) : (
                    <>
                      {isRegistered ? (
                        <span className="text-green-600 text-sm font-medium flex items-center">
                          <i className="fas fa-check-circle mr-1"></i>Terdaftar
                        </span>
                      ) : (
                        canRegister && (
                          <ButtonComponent
                            onClick={() => onRegister(forum.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-300 flex items-center"
                          >
                            <i className="fas fa-plus-circle mr-1"></i>Daftar
                          </ButtonComponent >
                        )
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            <a
              href={`/forum-diskusi/${forum.id}`}
              className="w-full sm:w-auto bg-[#1e3a8a] hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm transition duration-300 flex items-center justify-center"
            >
              <span>Lihat Detail</span>
              <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};