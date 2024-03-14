import success from "assets/images/login/Success.svg";
import error from "assets/images/login/closeError.svg";

export const PasswordRules = [
  {
    successImage: success,
    text: "A Upper case",
    errorImage: error,
    regex: /[A-Z]/
  },
  {
    successImage: success,
    text: "A Lower case",
    errorImage: error,
    regex: /[a-z]/
  },
  {
    successImage: success,
    text: "1 Special character",
    errorImage: error,
    regex: /[!@#$%^&*()_+{}[\]:;<>,.?~\\-]/
  },
  {
    successImage: success,
    text: "Numbers",
    errorImage: error,
    regex: /\d/
  },
  {
    successImage: success,
    text: "8 Characters",
    errorImage: error,
    regex: /^.{8,}$/
  }
];
