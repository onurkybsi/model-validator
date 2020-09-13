// In this module, the public methods of the model module have been validated.
exports.validateAddProperty = function (
  propertyName,
  propertyType,
  properties
) {
  // Type checks
  let typeCheckIsValid = checkTypeOfParams({
    propertyName: [propertyName, "string"],
    propertyType: [propertyType, "string"],
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
    "array",
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

const checkTypeOfParams = function (params) {
  let result = {
    errorMessage: null,
    isValid: true,
  };

  for (let param in params) {
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

        for (let rules in propertyRules) {
          if (propertyRules[rules].hasOwnProperty(rule)) {
            result.errorMessage = null;
            result.isValid = true;
          }
        }

        if (!result.isValid) return;
      });
    } else {
      if (typeof params[param][0] !== params[param][1]) {
        result.errorMessage = `${param} must be ${params[param][1]}!`;
        result.isValid = false;
      }
    }

    if (!result.isValid) break;
  }

  return result;
};
