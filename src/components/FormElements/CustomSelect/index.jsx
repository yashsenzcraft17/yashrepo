import Select from "react-select";
import "components/FormElements/CustomSelect/select.scss";
const CustomSelect = ({
  title,
  options,
  value,
  disabled,
  handleChange,
  name,
  text,
  storeLeadData,
  defaultValue,
  keyValue
}) => {
  // const []

  const selectOptions = Array.isArray(options)
    ? [
        ...options.map((option) => ({
          value: option,
          label: option
        }))
      ]
    : [];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor:
        storeLeadData?.lead_status === "Pending Review"
          ? disabled
            ? "#F4F4F4"
            : provided.backgroundColor
          : disabled
            ? "white"
            : provided.white,
      cursor: disabled ? "not-allowed" : provided.cursor
    })
  };

  return (
    <div className="selectInput">
      <label className="selectInputLabel">{title}</label>

      <Select
        id="id"
        key={keyValue}
        className="selectInputData"
        name={name}
        options={selectOptions}
        defaultValue={defaultValue}
        isDisabled={disabled}
        placeholder={text}
        value={selectOptions.find((opt) => opt.value === value)}
        styles={customStyles}
        isClearable={value !== "Please Select..."}
        onChange={(e) => {
          if (!e) {
            e = { value: "", label: "" };
          }
          handleChange(e, name);
        }}
      />
    </div>
  );
};

export default CustomSelect;
