// In this module, the public methods of the model module have been validated.

const propertyRules = require("./propertyRules");

exports.validateAddProperty = function (
  propertyName,
  propertyType,
  propertyRules,
  properties
) {
  // Type checks
  let typeCheckIsValid = checkType({
    propertyName: [propertyName, "string"],
    propertyType: [propertyType, "string"],
    propertyRules: [propertyRules, "array"],
  });

  if (!typeCheckIsValid.isValid) {
    return {
      errorMessage: typeCheckIsValid.errorMessage,
      isValid: typeCheckIsValid.isValid,
    };
  }

  // If there is such a property, we throw an error. propertyName must be unique
  for (const prop in properties) {
    if (prop === propertyName) {
      return {
        errorMessage: `${propertyName} is already exist!`,
        isValid: false,
      };
    }
  }

  const availableType = [
    "undefined",
    "object",
    "boolean",
    "number",
    "bigint",
    "string",
    "symbol",
    "function",
    "object",
  ];

  if (availableType.indexOf(propertyType.toLowerCase()) === -1) {
    return {
      errorMessage: `${propertyType} is not one of the valid types!`,
      isValid: false,
    };
  }

  return {
    errorMessage: null,
    isValid: true,
  };
};

checkType = function (params) {
  let result = {
    errorMessage: null,
    isValid: true,
  };

  for (param in params) {
    if (params[param][1] === "array" && !Array.isArray(params[param][0])) {
      result.errorMessage = `${param} must be array!`;
      result.isValid = false;
    } else if (
      params[param][1] === "array" &&
      Array.isArray(params[param][0])
    ) {
      params[param][0].forEach((rule) => {
        result.errorMessage = `${rule} rule is not possible.Must be one of the 'propertyRules'!`;
        result.isValid = false;

        for (rules in propertyRules) {
          if (propertyRules[rules].hasOwnProperty(rule)) {
            result.errorMessage = null;
            result.isValid = true;
          }
        }

        if (!result.isValid) return;
      });
    } else if (
      params[param][1] !== "array" &&
      typeof params[param][0] !== params[param][1]
    ) {
      result.errorMessage = `${param} must be ${params[param][1]}!`;
      result.isValid = false;
    }

    if (!result.isValid) break;
  }

  return result;
};
