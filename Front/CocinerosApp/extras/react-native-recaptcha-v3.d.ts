declare module 'react-native-recaptcha-v3' {
    import * as React from 'react';
  
    interface ReCaptchaV3Props {
      siteKey: string;
      action: string;
      onReceiveToken: (token: string) => void;
      onError?: (error: string) => void;
    }
  
    export default class ReCaptchaV3 extends React.Component<ReCaptchaV3Props> {}
  }
  