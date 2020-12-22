// Imports

import React from 'react';

import './switch.css';

// Switch

const Switch = ({id, isOn, handleToggle, checkedTitle, uncheckedTitle}) => {
  return (
    <>
      <input checked={isOn} onChange={handleToggle} className="react-switch-checkbox" id={id} type="checkbox"/>
      <label className="react-switch-label" htmlFor={id}>
        <span className="react-switch-button" />
        <span className="react-switch-checked-title">{checkedTitle}</span>
        <span className="react-switch-unchecked-title">{uncheckedTitle}</span>
      </label>
    </>
  );
};

export default Switch;