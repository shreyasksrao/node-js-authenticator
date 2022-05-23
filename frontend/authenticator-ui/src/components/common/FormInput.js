import React from 'react';
import PropTypes from 'prop-types';

export default function FormInput({ inputId, inputType, labelValue }) {
  return (
    <div className='form-input-div'>
        <label className="form-label" id={`${inputId}-label`}  htmlFor={inputId}>{labelValue}</label>
        <input className="form-input" id={inputId} type={inputType}/>
    </div>
  )
}

FormInput.propTypes = {
    inputType: PropTypes.string.isRequired,
    labelValue: PropTypes.string.isRequired,
}

FormInput.defaultProps = {
    inputType: "text",
    labelValue: "Name"
}
