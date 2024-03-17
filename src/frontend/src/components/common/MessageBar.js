import { MessageBar, MessageBarType } from "@fluentui/react";
import { Link } from "@fluentui/react";
export const ErrorMessageBar = (props) => {
  return (
    <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
      {props.text}
    </MessageBar>
  );
};

export const SuccessMessageBar = (props) => {
  return (
    <MessageBar messageBarType={MessageBarType.success} isMultiline={true}>
      New Password has been sent on email.
      <br />
      Email Id : {props.emailId}
      <br />
      In case you do not see email, please check subfolders (update/spam) before
      regenerating the password.
      <br />
      <Link onClick={() => props.goToLoginPage("/login")}>Click here</Link> to
      login with new password.
    </MessageBar>
  );
};

export const Success = (props) => {
  return (
    <MessageBar messageBarType={MessageBarType.success} isMultiline={true}>
      {props.text}
      <br />
      <Link onClick={() => props.goToLoginPage("/login")}>Click here</Link> to
      login with new password.
    </MessageBar>
  );
};
