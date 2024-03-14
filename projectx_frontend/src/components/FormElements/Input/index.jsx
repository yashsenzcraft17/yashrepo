import "components/FormElements/Input/input.scss";

const Input = ({
  title,
  type,
  value,
  disabled,
  handleChange,
  name,
  text,
  storeLeadData
}) => {
  const isZone = name === "zone";
  const isReadOnly = isZone || disabled;

  return (
    <div className="inputField">
      <label className="inputFieldLabel">{title}</label>
      <input
        type={type}
        name={name}
        // key={keyValue}
        style={{
          textOverflow: "ellipsis",
          background:
            storeLeadData?.lead_status === "Pending Review"
              ? isReadOnly
                ? "#F4F4F4"
                : "#fff"
              : isReadOnly
                ? "white"
                : "#fff"
        }}
        // className={`inputFieldText ${hasError ? "errorBorder" : ""}`}
        // className={disabled ? "disabledClass" : "inputFieldText"}
        className={"inputFieldText"}
        placeholder={text}
        value={value}
        onChange={(e) => {
          handleChange(e);
        }}
        disabled={isReadOnly}
        readOnly={isReadOnly}
      />
    </div>
  );
};

export default Input;
