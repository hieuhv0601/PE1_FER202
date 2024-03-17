import { useState } from "react";

const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (checked) {
        setValues((prevValues) => ({
          ...prevValues,
          [name]: [...(prevValues[name] || []), value],
        }));
      } else {
        setValues((prevValues) => ({
          ...prevValues,
          [name]: prevValues[name].filter((v) => v !== value),
        }));
      }
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  const setFieldValue = (name, value) => {
    setValues({ ...values, [name]: value });
  };

  const reset = () => {
    setValues(initialValues);
  };

  const getInputProps = (name, type, value) => {
    switch (type) {
      case "checkbox":
        return {
          name,
          value,
          checked: (values[name] || []).includes(value),
          onChange: handleInputChange,
        };
      case "radio":
        return {
          name,
          value,
          checked: values[name] === value,
          onChange: handleInputChange,
        };
      default:
        return {
          name,
          value: values[name] || "",
          onChange: handleInputChange,
        };
    }
  };
  return { values, reset, setFieldValue, getInputProps };
};

export default useForm;
