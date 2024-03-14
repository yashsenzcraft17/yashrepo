import React, { useState, useRef, useMemo } from "react";
import AsyncSelect from "react-select";
import { components } from "react-select";
import debounce from "lodash.debounce";
import { EncryptStorage } from "encrypt-storage";

import "components/MultiSelector/multiSelector.scss";

const MultiSelect = ({
  addFilterValue,
  multiselectValue = {},
  selectKey = "",
  apiOptions = [],
  placeholderData,
  apiCallFunction,
  seeAll,
  setSeeAll
}) => {
  const [selectInput, setSelectInput] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const isAllSelected = useRef(false);
  const selectAllLabel = useRef("");
  const allOption = { value: "*", label: selectAllLabel?.current };

  const [isLoading, setIsLoading] = useState(false);

  // Filters an array of options based on a given input string.
  const filterOptions = (options = [], input) => {
    if (!input) {
      const initialOptions = options?.length <= 10 ? options.slice(0, 10) : [];
      return initialOptions;
      // return [];
    }

    const filtered = options?.filter(({ label }) =>
      label?.toLowerCase()?.includes(input?.toLowerCase())
    );

    const slicedOptions = filtered?.slice(0, 15);

    return slicedOptions;
  };

  const comparator = (v1, v2) => v1.value - v2.value;

  const filteredOptions = useMemo(() => {
    return filterOptions(apiOptions, selectInput);
  }, [selectInput, apiOptions]);

  const filteredSelectedOptions = useMemo(() => {
    return filterOptions(selectedOptions, selectInput);
  }, [selectInput, selectedOptions]);

  // A custom option component for a select dropdown.
  const Option = (props) => (
    <components.Option {...props} className="custom-option">
      {props?.value === "" &&
      !isAllSelected?.current &&
      filteredSelectedOptions?.length > 0 ? (
        <>
          {" "}
          <input
            key={props?.value}
            type="checkbox"
            ref={(input) => {
              if (input) input.indeterminate = true;
            }}
          />
          <label htmlFor={props?.value}></label>
        </>
      ) : (
        <div
          className="custom"
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >
          <input
            key={props?.value}
            type="checkbox"
            className="multi-checkbox"
            checked={props?.isSelected || isAllSelected?.current}
            onChange={() => {}}
            style={{
              cursor: "pointer"
            }}
          />
          <label htmlFor={props?.value} style={{ background: "red" }}></label>
        </div>
      )}
      <label style={{ cursor: "pointer" }}>
        {props?.label?.toLowerCase().replace(/\b(\w)/g, (x) => x.toUpperCase())}
      </label>
    </components.Option>
  );

  // A custom input component that conditionally renders either a regular input or a div containing an input based on the length of the selectInput array.
  const Input = (props) => (
    <>
      {selectInput.length === 0 ? (
        <components.Input autoFocus={props.selectProps.menuIsOpen} {...props}>
          {props.children}
        </components.Input>
      ) : (
        <div style={{}}>
          <components.Input autoFocus={props.selectProps.menuIsOpen} {...props}>
            {props.children}
          </components.Input>
        </div>
      )}
    </>
  );

  const customFilterOption = ({ value, label }, input) =>
    (value !== "*" && label.toLowerCase().includes(input.toLowerCase())) ||
    (value === "*" && filteredOptions?.length > 0);

  const encryptStorage = new EncryptStorage("senzcraft123#", {
    prefix: ""
  });

  const profileData = encryptStorage.getItem("authData");
  const { data } = profileData;

  // debounce to make api call
  const debouncedApiCall = useRef(
    debounce(async (inputValue) => {
      setIsLoading(true);
      const response = await apiCallFunction(data?.email, inputValue);
      if (response?.status === "1") {
        const newApiOptions = response?.data?.city_list || [];
        const filteredApiOptions = newApiOptions
          .map(([value, label]) => ({
            value,
            label: label
              ?.toLowerCase()
              .replace(/\b(\w)/g, (x) => x.toUpperCase())
              .trim()
          }))
          .slice(0, 15);
        setSelectedOptions(filteredApiOptions);
      }
      setIsLoading(false);
    }, 500)
  ).current; // Adjust the delay time as needed

  const onInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      setSelectInput(inputValue);
      if (inputValue) {
        debouncedApiCall(inputValue);
      }
    }
  };

  const onKeyDown = (e) => {
    if ((e.key === " " || e.key === "Enter") && !selectInput)
      e.preventDefault();
  };

  // Handles the change event when a selection is made in a dropdown menu.
  const handleChange = (selected) => {
    addFilterValue(selected);

    if (
      selected.length > 0 &&
      !isAllSelected.current &&
      (selected[selected.length - 1].value === allOption.value ||
        JSON.stringify(filteredOptions) ===
          JSON.stringify(selected.sort(comparator)))
    ) {
      setSelectedOptions(
        [
          ...(selectedOptions ?? []),
          ...apiOptions.filter(
            ({ label }) =>
              label.toLowerCase().includes(selectInput?.toLowerCase()) &&
              (selectedOptions ?? []).filter((opt) => opt.label === label)
                .length === 0
          )
        ].sort(comparator)
      );
    } else if (
      selected.length > 0 &&
      selected[selected.length - 1].value !== allOption.value &&
      JSON.stringify(selected.sort(comparator)) !==
        JSON.stringify(filteredOptions)
    ) {
      setSelectedOptions(selected);
    } else {
      console.log("error");
    }
    setSelectInput("");
  };

  const MoreSelectedBadge = ({ items }) => {
    const style = {
      // marginLeft: "auto",
      background: "#d4eefa",
      borderRadius: "4px",
      fontFamily: "Open Sans",
      fontSize: "10px",
      padding: "6px 8px",
      color: "#0098B3",
      fontWeight: "600",
      lineHeight: "120%"
    };

    const length = items.length;
    const label = `+ ${length} ${length !== 1 ? "" : ""}`;

    return (
      <div style={style} onClick={seeMore} onTouchEnd={seeMore}>
        {label}
      </div>
    );
  };

  const seeMore = () => {
    setSeeAll(selectKey);
  };

  // A component that renders a multi-value select option.
  // If the number of selected values exceeds a certain threshold, it will display a badge indicating the number of additional selected values.

  const MultiValue = ({ index, getValue, ...props }) => {
    if (seeAll === selectKey) {
      const maxToShow = 100;
      const overflow = getValue()
        .slice(maxToShow)
        .map((x) => x.label);

      return index < maxToShow ? (
        <components.MultiValue {...props} />
      ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
      ) : null;
    } else {
      const maxToShow = 3;
      const overflow = getValue()
        .slice(maxToShow)
        .map((x) => x.label);

      return index < maxToShow ? (
        <components.MultiValue {...props} />
      ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
      ) : null;
    }
  };

  const customStyles = {
    noOptionsMessage: (styles) => ({
      ...styles,
      color: "#8B98A4",
      fontSize: "14px",
      fontWeight: "600"
    }),

    multiValueLabel: (def) => ({
      ...def,
      color: "#0098B3",
      fontSize: "10px",
      fontWeight: "600",
      lineHeight: "120%",
      padding: "6px 8px",
      borderRadius: "4px",
      background: "#c3ecf4",
      // textTransform: "capitalize",
      textTransform: "capitalize"
    }),
    multiValueRemove: (def) => ({
      ...def
      // display: "none"
    }),
    valueContainer: (base) => ({
      ...base,
      maxHeight: "4.875rem",
      overflow: "auto"
    }),
    option: (styles) => {
      return {
        ...styles,
        background: "#FFF",
        color: "#677787",
        fontSize: "16px",
        padding: "8px 0",
        lineHeight: "140%",
        display: "flex",
        alignItems: "center",
        gap: "1.6rem"
      };
    },
    menu: (def) => ({
      ...def,
      zIndex: 9999,
      maxWidth: "310px",
      overflow: "scroll",
      marginLeft: "10px",
      padding: "0 10px 10px 10px"
    }),
    control: (styles) => ({
      ...styles,
      borderRadius: 8,
      border: "1px solid #EBEBEB",
      boxShadow: "none",
      cursor: "pointer"
    }),
    placeholder: (styles) => {
      return {
        ...styles,
        color: "#8B98A4",
        fontSize: "15px",
        fontWeight: "400"
      };
    }
  };

  const dynamicComponents = {
    Option,
    Input,
    MultiValue,
    DropdownIndicator: () => null,
    IndicatorSeparator: () => null
  };

  const customNoOptionsMessage = (selectKey) => {
    let label;
    const fieldNameWithSuffix = selectKey.replace("_city_list", "");
    const fieldNameWithoutUnderscore = fieldNameWithSuffix.replace(/_/g, " ");

    switch (fieldNameWithSuffix) {
      case "origin":
        label = "Origin";
        break;
      case "destination":
        label = "Destination";
        break;
      case "routeCode":
        label = "Route List";
        break;
      default:
        label = fieldNameWithoutUnderscore;
    }

    const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);

    return selectInput.length === 0
      ? `Search ${formattedLabel}`
      : "No search data found";
  };

  return (
    <div className="custom-multi-select">
      <AsyncSelect
        autoFocus={false}
        inputValue={selectInput}
        onInputChange={onInputChange}
        onKeyDown={onKeyDown}
        // defaultValue={filteredOptions[0]}
        options={filteredOptions}
        onChange={handleChange}
        maxMenuHeight={200}
        placeholder={placeholderData}
        isClearable={false}
        components={dynamicComponents}
        value={multiselectValue?.[selectKey] ?? []}
        filterOption={customFilterOption}
        menuPlacement="auto"
        styles={customStyles}
        classNamePrefix="multi-select"
        isMulti
        isLoading={isLoading}
        closeMenuOnSelect={false}
        tabSelectsValue={true}
        backspaceRemovesValue={false}
        hideSelectedOptions={false}
        noOptionsMessage={() => customNoOptionsMessage(selectKey)}
        blurInputOnSelect={false}
        className="multiSelect"
      />
    </div>
  );
};

export default MultiSelect;
