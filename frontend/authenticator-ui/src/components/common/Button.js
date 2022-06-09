import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

function Button({ title, textColor, backgroundColor, width, height, borderRadius, customStyle }) {
  return (
    <Fragment>
        <button className='custom-btn' style={{...customStyle, 
                                               color: textColor, 
                                               backgroundColor: backgroundColor,
                                               width: width,
                                               height: height,
                                               borderRadius: borderRadius}}>
            {title}
        </button>
    </Fragment>
  )
}

Button.propTypes = {
    title: PropTypes.string,
    textColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    borderRadius: PropTypes.string,
    customStyle: PropTypes.object,
};

Button.defaultProps = {
    title: 'Click Me',
    textColor: 'white',
    backgroundColor: 'blue',
    width: '75%',
    height: '30px',
    borderRadius: '0.5rem'
};
export default Button
