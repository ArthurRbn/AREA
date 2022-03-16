import React from "react";
import Dialog from "@material-ui/core/Dialog";
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

class ModalAuth extends React.Component<{
  open: boolean;
  handleClose: any;
  isLogin: boolean;
  setError: React.Dispatch<React.SetStateAction<string>>;
}> {
  render() {
    const { open, handleClose, isLogin, setError } = this.props
    return (
      <Dialog open={open} onClose={handleClose}>
        { isLogin ? <LoginForm handleClose={handleClose} setError={setError} /> : <RegisterForm handleClose={handleClose} setError={setError} /> }
      </Dialog>
    );
  }
}

export default ModalAuth;
