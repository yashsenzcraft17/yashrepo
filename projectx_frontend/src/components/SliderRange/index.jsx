import React, { useEffect, useState } from "react";
import ReactSlider from "react-slider";

import "components/SliderRange/sliderRange.scss";

const formatValue = (value, selectKey) => {
  return selectKey === "cost_range" ? value.toLocaleString() : value;
};

const SliderRange = ({
  spanValue,
  addFilterValue,
  multiselectValue = {},
  selectKey,
  resetSlider
}) => {
  const getMaxMinValues = (key) => {
    switch (key) {
      case "cost_range":
        return { max: 100000, min: 0 };
      case "distance":
        return { max: 5000, min: 0 };
      default:
        return { max: 1000000, min: 0 };
    }
  };

  const { max, min } = getMaxMinValues(selectKey);

  const [sliderValue, setSliderValue] = useState([min, max]);

  useEffect(() => {
    if (resetSlider) {
      setSliderValue([min, max]);
    }
  }, [resetSlider, max, min]);

  const handleSliderChange = (selected) => {
    setSliderValue(selected);
    addFilterValue({
      data: { max: selected[1], min: selected[0] }
    });
  };

  return (
    <div className="sliderRange">
      <ReactSlider
        className="horizontal-slider"
        thumbClassName="thumb"
        trackClassName="track"
        defaultValue={sliderValue}
        max={max}
        min={min}
        ariaLabelledby={["first-slider-label", "second-slider-label"]}
        ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
        renderThumb={(props, state) => (
          <div {...props}>
            <span>
              {selectKey === "cost_range" ? (
                <>
                  {spanValue}
                  {formatValue(state.valueNow, selectKey)}
                </>
              ) : (
                <>
                  {state.valueNow}
                  {spanValue}
                </>
              )}
            </span>
          </div>
        )}
        value={sliderValue}
        pearling={false}
        onChange={handleSliderChange}
        minDistance={10}
      />
    </div>
  );
};

export default SliderRange;
