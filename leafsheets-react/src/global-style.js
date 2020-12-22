import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600&family=Barlow:wght@300;400;500&family=Roboto:wght@400;500&display=swap');

  // General
  * {
    box-sizing: border-box !important;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -o-user-select:none;
    user-select: none; 
  }

  body {
    background-color: #151515 !important;
    box-sizing: border-box !important;
    font-family: 'Barlow Condensed', sans-serif;
    margin: 0 !important;
    height: 100%;
  }

  html {
    height: 100%;
  }

  a,
  a:-webkit-any-link {
    text-decoration: none;
  }

  a:hover {
    color: #30E1A5;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active  {
      -webkit-box-shadow: 0 0 0 30px white inset !important;
  }

  // Hide Overflow
  .overflowHidden {
    overflow: hidden;
  }

  .checkbox-container,
  .radio-container {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    position: relative;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  /* Hide the browser's default radio button */
  .checkbox-container input,
  .radio-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  
  /* Create a custom radio button */
  .checkbox-checkmark,
  .radio-checkmark {
    position: relative;
    height: 24px;
    max-height: 24px;
    width: 24px;
    max-width: 24px;
    background-color: #eee;
    border-radius: 50%;
  }
  
  /* On mouse-over, add a grey background color */
  .checkbox-container:hover input ~ .checkbox-checkmark,
  .radio-container:hover input ~ .radio-checkmark {
    background-color: ;
  }
  
  /* When the radio button is checked, add a blue background */
  .checkbox-container input:checked ~ .checkbox-checkmark,
  .radio-container input:checked ~ .radio-checkmark {
    background-color: rgb(161, 178, 184);
  }
  
  /* Create the indicator (the dot/circle - hidden when not checked) */
  .checkbox-checkmark:after,
  .radio-checkmark:after {
    content: "";
    display: none;
  }
  
  /* Show the indicator (dot/circle) when checked */
  .checkbox-container input:checked ~ .checkbox-checkmark:after,
  .radio-container input:checked ~ .radio-checkmark:after {
    display: block;
  }
  
  /* Style the indicator (dot/circle) */
  .checkbox-container .checkbox-checkmark:after,
  .radio-container .radio-checkmark:after {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
  }

  /* Numeric Input */
  .react-numeric-input b:first-of-type:before {
    content: '';
    position: absolute;
    top: 8px;
    right: 0;
    border-bottom: 8px solid rgb(195, 195, 195);
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
  }
  .react-numeric-input b:first-of-type:after {
    content: '';
    position: absolute;
    right: 2px;
    top: 10px;
    border-bottom: 6px solid #fff;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
  }
  .react-numeric-input b:first-of-type:hover:before {
    border-bottom: 8px solid #30E1A5;
  }
  .react-numeric-input b:nth-of-type(2):before {
    content: '';
    position: absolute;
    top: 6px;
    right: 0;
    border-top: 8px solid rgb(195, 195, 195);
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
  }
  .react-numeric-input b:nth-of-type(2):after {
    content: '';
    position: absolute;
    right: 2px;
    top: 6px;
    border-top: 6px solid #fff;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
  }
  .react-numeric-input b:nth-of-type(2):hover:before {
    border-top: 8px solid #30E1A5;
  }
  .react-numeric-input input::placeholder {
    color: #b2bfc4;
  }

  // Tabs

  .rc-tabs-bar,
  .rc-tabs-top {
    border-bottom: 0px !important;
  }

  .rc-tabs-nav-container {
    width: 100%;
  }

  .rc-tabs-top .rc-tabs-tab {
    margin-left: 10px !important;
    margin-right: 10px !important;
  }

  .rc-tabs-tab:hover,
  .rc-tabs-tab-active,
  .rc-tabs-tab-active:hover,
  .rc-tabs-tab-active .rc-tabs-tab,
  .rc-tabs-tab-active .rc-tabs-tab-active:hover {
    color: #30E1A5 !important;
  }

  .rc-tabs-top .rc-tabs-ink-bar {
    background-color: #30E1A5 !important;
  }

`

export default GlobalStyle;