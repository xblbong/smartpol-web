export default function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
  prevLabel = "Previous",
  nextLabel = "Next",
  activeClass = "bg-[#1e3a8a] text-white",
  inactiveClass = "bg-white text-gray-700 hover:bg-gray-100",
  buttonClass = "px-3 py-1 rounded-lg border border-gray-300",
  containerClass = "flex justify-center items-center space-x-2 my-8",
}) {
  const pages = [...Array(totalPages).keys()].map((i) => i + 1);

  return (
    <nav className={containerClass}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${buttonClass} ${inactiveClass} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {prevLabel}
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${buttonClass} ${
            currentPage === page ? activeClass : inactiveClass
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${buttonClass} ${inactiveClass} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {nextLabel}
      </button>
    </nav>
  );
}
