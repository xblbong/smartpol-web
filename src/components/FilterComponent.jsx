export default function FilterComponent({
  className,
  title = "Filter Data",
  filters,
  onFilterChange,
  onResetFilters,
  fields = [], // ← semua konfigurasi field dari sini
  submitText = "Filter",
  resetText = "Reset",
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== null
  );

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className={className || "bg-white overflow-hidden shadow-md rounded-xl mb-8"}>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end"
        >
          {fields.map((field) => (
            <div key={field.name} className={field.colSpan || ""}>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={filters[field.name] || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  id={field.name}
                  name={field.name}
                  value={filters[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder || ""}
                  className="w-full rounded-lg border-gray-300 focus:border-[#1e3a8a] focus:ring-[#1e3a8a]"
                />
              )}
            </div>
          ))}

          {/* Tombol */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            <button
              type="submit"
              className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center justify-center"
            >
              <i className="fas fa-search mr-2"></i>
              <span>{submitText}</span>
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center justify-center"
              >
                <i className="fas fa-times mr-2"></i>
                <span>{resetText}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}