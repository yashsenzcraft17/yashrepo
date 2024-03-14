import LeadDetailsCard from "components/LeadDetailsCard";
import Input from "components/FormElements/Input";
import Skeleton from "components/Skeleton";
import Select from "components/FormElements/CustomSelect";

import "components/LeadDetailsData/ProductInterest/productInterest.scss";

import productLogo from "assets/images/LeadDetails/productLogo.svg";

const ProductInterest = ({
  leadData,
  loading,
  isFieldsDisabled,
  selectedDropdown,
  setIsActive,
  isActive,
  handleChange,
  setIsActiveId,
  isActiveId,
  storeLeadData,
  formValues
}) => {
  // const productOptionsData = selectedDropdown?.module_type?.data || [];
  // const productOptions = ["Please Select...", ...productOptionsData];

  const productOptions = selectedDropdown?.module_type?.data || [];

  // const productKeyOptionsData = selectedDropdown?.key_interest?.data || [];
  // const productKeyOptions = ["Please Select...", ...productKeyOptionsData];

  const productKeyOptions = selectedDropdown?.key_interest?.data || [];

  const unitOfMeasureOptions = ["KW", "MW", "NOS"];

  return (
    <>
      <LeadDetailsCard
        image={productLogo}
        title={"Product Interest"}
        showCircle={false}
        setIsActive={setIsActive}
        isActive={isActive}
        setIsActiveId={setIsActiveId}
        isActiveId={isActiveId}
        commonId="4"
      >
        <div className="productInfo">
          {loading ? (
            <Skeleton width={"800px"} height={"44"} />
          ) : (
            <Select
              title="Key Interest"
              text="Select Key Interest"
              name="key_interest"
              value={formValues?.key_interest || ""}
              disabled={isFieldsDisabled}
              options={productKeyOptions}
              storeLeadData={storeLeadData}
              handleChange={(e) => handleChange(e, "key_interest")}
              keyValue={`abc${formValues?.key_interest}`}
            />
          )}

          {loading ? (
            <Skeleton width={"800px"} height={"44"} />
          ) : (
            <Input
              type="text"
              name="desired_module"
              title="Product Name"
              value={formValues?.desired_module || ""}
              text="Product Name"
              storeLeadData={storeLeadData}
              handleChange={(e) => handleChange(e, "desired_module")}
              disabled={isFieldsDisabled}
            />
          )}

          {loading ? (
            <Skeleton width={"800px"} height={"44"} />
          ) : (
            <Select
              title="Product Type"
              name="module_type"
              value={formValues?.module_type || ""}
              options={productOptions}
              storeLeadData={storeLeadData}
              text="Select Product Type"
              handleChange={(e) => handleChange(e, "module_type")}
              disabled={isFieldsDisabled}
              keyValue={`abc${formValues?.module_type}`}
            />
          )}

          {loading ? (
            <Skeleton width={"800px"} height={"44"} />
          ) : (
            <Input
              type="text"
              name="desired_qty"
              title="Quantity"
              value={formValues?.desired_qty || ""}
              storeLeadData={storeLeadData}
              text="Quantity"
              handleChange={(e) => handleChange(e, "desired_qty")}
              disabled={isFieldsDisabled || true}
            />
          )}

          {loading ? (
            <Skeleton width={"800px"} height={"44"} />
          ) : (
            <Input
              type="text"
              name="desired_capacity"
              title="Capacity"
              disabled={isFieldsDisabled}
              text="Capacity"
              storeLeadData={storeLeadData}
              handleChange={(e) => handleChange(e, "desired_capacity")}
              value={formValues?.desired_capacity || ""}
            />
          )}

          {loading ? (
            <Skeleton width={"800px"} height={"44"} />
          ) : (
            <Select
              title="Unit of measure"
              name="unit_of_measuer"
              value={formValues?.unit_of_measuer || ""}
              storeLeadData={storeLeadData}
              text="Unit of measure"
              handleChange={(e) => handleChange(e, "unit_of_measuer")}
              options={unitOfMeasureOptions}
              disabled={isFieldsDisabled || true}
              keyValue={`abc${formValues?.unit_of_measuer}`}
            />
          )}
        </div>
      </LeadDetailsCard>
    </>
  );
};

export default ProductInterest;
