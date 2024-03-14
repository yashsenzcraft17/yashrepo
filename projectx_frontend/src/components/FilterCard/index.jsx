import ExpandArrow from "assets/images/header/downArrow.svg";

const FilterCard = ({
  filterTitle,
  selected,
  children,
  id,
  filterActive,
  setFilterActive,
  selectedCount
}) => {
  const openFilter = (i) => {
    setFilterActive(i === filterActive ? null : i);
  };

  const isOpen = filterActive === id;

  return (
    <div className="tripFilterSectionOption">
      <div className="filterTitle" onClick={() => openFilter(id)}>
        <p>
          {filterTitle}{" "}
          {selectedCount?.length > 0 && <span>{selectedCount?.length}</span>}
        </p>
        <img
          src={ExpandArrow}
          alt="ExpandArrow"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
          }}
        />
      </div>
      <div
        style={{
          height: filterActive === id ? "auto" : "0",
          paddingTop: filterActive === id ? "20px" : "0",
          overflow: filterActive === id ? "visible" : "hidden"
        }}
        className="filterChild"
      >
        {children}
      </div>
    </div>
  );
};

export default FilterCard;
