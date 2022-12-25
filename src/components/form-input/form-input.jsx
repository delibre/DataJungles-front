import './form-input.scss'

const FormInput = ({handleChange, label, i, value, error, name, clearError, ...otherProps}) => {

    let inputClasses =  '';
    let labelClasses = `${value.length ? 'shrink' : ''} form-input-label`;
    let lableText = label;
    if (error !== null) {
        inputClasses =  error.errorState  ? 'error' : '';
        labelClasses = `${value.length ? 'shrink' : ''} ${error.errorState  ? 'error' : ''} form-input-label`;
        lableText = error.errorState ? label + error.messagge : label;
    }
        

    return (
        <div className="group" id={`registration-input-${name}`}>
            <input
                onFocus={clearError} 
                className={inputClasses}
                onChange={handleChange}
                name={name} 
                value={value}
                {...otherProps}
                />
            <label className={labelClasses}>{lableText}</label>
            {i ? i : null}
        </div>
    )
}

export default FormInput;