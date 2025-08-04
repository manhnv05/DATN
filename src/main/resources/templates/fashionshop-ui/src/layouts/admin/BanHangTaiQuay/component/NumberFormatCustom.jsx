// FILE: src/components/NumberFormatCustom.jsx

import React, { forwardRef } from "react";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";

const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;
 console.log("Đang chạy phiên bản CÓ MAXLENGTH=15"); 
  return (
    <IMaskInput
      {...other}
      maxLength={15} 
      mask={Number}
      scale={0} // Không có phần thập phân
      thousandsSeparator="." // Dấu phân cách hàng nghìn
      padFractionalZeros={false}
      normalizeZeros={true}
      inputRef={ref}
    
      overwrite
     onAccept={(value) => onChange(value)} 
    />
  );
});

NumberFormatCustom.propTypes = {

  onChange: PropTypes.func.isRequired,
};

export default NumberFormatCustom;