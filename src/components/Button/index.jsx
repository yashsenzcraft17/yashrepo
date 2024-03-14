const Button = ({ onClick, className, children, type, disabled, title }) => {
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {title}
      {children}
    </button>
  );
};

export default Button;
