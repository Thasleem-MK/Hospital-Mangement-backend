import Joi from "joi";

export const RegistrationSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Hospital name is required.",
    "any.required": "Hospital name is a required field.",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is a required field.",
  }),

  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be exactly 10 digits.",
      "string.empty": "Mobile number is required.",
      "any.required": "Mobile number is a required field.",
    }),

  address: Joi.string().required().messages({
    "string.empty": "Address is required.",
    "any.required": "Address is a required field.",
  }),

  latitude: Joi.number().required().messages({
    "number.base": "Latitude must be a number.",
    "any.required": "Latitude is a required field.",
  }),

  longitude: Joi.number().required().messages({
    "number.base": "Longitude must be a number.",
    "any.required": "Longitude is a required field.",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "string.empty": "Password is required.",
    "any.required": "Password is a required field.",
  }),

  workingHours: Joi.object({
    Monday: Joi.object({
      open: Joi.string()
        .allow("")
        .when("isHoliday", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required().messages({
            "string.empty": "Opening time is required on Monday.",
          }),
        }),
      close: Joi.string()
        .allow("")
        .when("isHoliday", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required().messages({
            "string.empty": "Closing time is required on Monday.",
          }),
        }),
      isHoliday: Joi.boolean().required().messages({
        "any.required": "Holiday status is required on Monday.",
      }),
    }),
    Tuesday: Joi.object({
      open: Joi.string()
        .allow("")
        .when("isHoliday", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required().messages({
            "string.empty": "Opening time is required on Tuesday.",
          }),
        }),
      close: Joi.string()
        .allow("")
        .when("isHoliday", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required().messages({
            "string.empty": "Closing time is required on Tuesday.",
          }),
        }),
      isHoliday: Joi.boolean().required().messages({
        "any.required": "Holiday status is required on Tuesday.",
      }),
    }),
    Wednesday: Joi.object({
      open: Joi.string()
        .allow("")
        .when("isHoliday", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required().messages({
            "string.empty": "Opening time is required on Wednesday.",
          }),
        }),
      close: Joi.string()
        .allow("")
        .when("isHoliday", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required().messages({
            "string.empty": "Closing time is required on Wednesday.",
          }),
        }),
      isHoliday: Joi.boolean().required().messages({
        "any.required": "Holiday status is required on Wednesday.",
      }),
    }),
    Thursday: Joi.object({
      open: Joi.string()
        .allow("")
        .when("isHoliday", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required().messages({
            "string.empty": "Opening time is required on Thursday.",
          }),
        }),
      close: Joi.string()
        .allow("")
        .when("isHoliday", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required().messages({
            "string.empty": "Closing time is required on Thursday.",
          }),
        }),
      isHoliday: Joi.boolean().required().messages({
        "any.required": "Holiday status is required on Thursday.",
      }),
    }),
    Friday: Joi.object({
      open: Joi.string()
        .allow("")
        .when("isHoliday", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required().messages({
            "string.empty": "Opening time is required on Friday.",
          }),
        }),
      close: Joi.string()
        .allow("")
        .when("isHoliday", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required().messages({
            "string.empty": "Closing time is required on Friday.",
          }),
        }),
      isHoliday: Joi.boolean().required().messages({
        "any.required": "Holiday status is required on Friday.",
      }),
    }),
    Saturday: Joi.object({
      open: Joi.string()
        .allow("")
        .when("isHoliday", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required().messages({
            "string.empty": "Opening time is required on Saturday.",
          }),
        }),
      close: Joi.string()
        .allow("")
        .when("isHoliday", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required().messages({
            "string.empty": "Closing time is required on Saturday.",
          }),
        }),
      isHoliday: Joi.boolean().required().messages({
        "any.required": "Holiday status is required on Saturday.",
      }),
    }),
    Sunday: Joi.object({
      open: Joi.string()
        .allow("")
        .when("isHoliday", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required().messages({
            "string.empty": "Opening time is required on Sunday.",
          }),
        }),
      close: Joi.string()
        .allow("")
        .when("isHoliday", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required().messages({
            "string.empty": "Closing time is required on Sunday.",
          }),
        }),
      isHoliday: Joi.boolean().required().messages({
        "any.required": "Holiday status is required on Sunday.",
      }),
    }),
  })
    .required()
    .messages({
      "object.base":
        "Working hours must be an object with day-specific timings.",
    }),
});