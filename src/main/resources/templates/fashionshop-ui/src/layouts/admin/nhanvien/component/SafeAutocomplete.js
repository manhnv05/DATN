import Autocomplete from "@mui/material/Autocomplete";
import PropTypes from "prop-types";

export default function SafeAutocomplete(props) {
    const options = Array.isArray(props.options) ? props.options : [];
    const value = props.value === undefined ? null : props.value;
    return <Autocomplete {...props} options={options} value={value} />;
}

SafeAutocomplete.propTypes = {
    options: PropTypes.array,
    value: PropTypes.any,
};