const ButtonComponent = ({ children, className, type = 'button', onClick, ...rest }) => {

  // Menggabungkan kelas dasar dengan kelas kustom dari props
  // Kelas dari props akan menimpa kelas dasar jika ada konflik
  const combinedClasses = `${className || ''}`.trim();

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={combinedClasses}
      {...rest} // Meneruskan semua props lain seperti 'disabled', 'id', dll.
    >
      {children}
    </button>
  );
};

export default ButtonComponent;