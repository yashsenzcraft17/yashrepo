import useScreenMobile from "hooks/useScreenMobile";

import "components/LoginWelcome/loginWelcome.scss";

import loginForm from "assets/images/login/loginFormBackground.png";
import loginFormMobile from "assets/images/login/loginFormMobile.png";

const LoginWelcome = () => {
  const isMobile = useScreenMobile({ size: 992 });
  const imageSource = isMobile ? loginFormMobile : loginForm;

  return (
    <div className="formImageParent">
      <img className="formImageBackground" src={imageSource} alt="image" />
      <p className="formImagePara">
        Sign in to <span className="formImageSpecial">turbocharge</span> your
        processes!
      </p>
    </div>
  );
};

export default LoginWelcome;
