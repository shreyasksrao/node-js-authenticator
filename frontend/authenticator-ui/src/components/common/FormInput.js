import React from 'react';
import PropTypes from 'prop-types';

export default function FormInput({ inputId, inputType, labelValue, onChangeHandler }) {
  return (
    <div className='form-input-div'>
        <label className="form-input-label" id={`${inputId}-label`}  htmlFor={inputId}>{labelValue}</label>
        <input className="form-input" id={inputId} type={inputType} onChange={onChangeHandler}/>
    </div>
  )
}

FormInput.propTypes = {
    inputType: PropTypes.string.isRequired,
    labelValue: PropTypes.string.isRequired,
    inputId: PropTypes.string.isRequired,
    onChangeHandler:PropTypes.func,
}

FormInput.defaultProps = {
    inputType: "text",
    labelValue: "Name"
}
