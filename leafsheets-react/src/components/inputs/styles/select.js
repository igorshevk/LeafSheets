// Custom Styles

export const borderColorForState = state => {
  if (state.isFocused) {
    return "#30E1A5 !important"
  } else {
    return "#b2bfc4 !important"
  }
}

export const selectStyles = {
  container: (provided) => ({
    ...provided,
    height: 48,
    marginBottom: 24,
    borderColor: "transparent",
    "&:hover": {
      borderColor: "#30E1A5 !important",
    },
    outline: "none",
    width: "100%"
  }),
  control: (provided, state) => ({
    ...provided,
    borderColor: borderColorForState(state),
    cursor: "pointer",
    "&:hover": {
      borderColor: "#30E1A5 !important",
    },
    boxShadow: "none",
    height: 48,
    paddingLeft: 12,
    outline: "none",
  }),
  input: (provided) => ({
    ...provided,
    fontFamily: "Barlow",
    fontSize: 18,
    fontWeight: "400",
    borderColor: "transparent",
    outline: "none",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontFamily: "Barlow",
    fontSize: 18,
    fontWeight: "400",
    color: "#b2bfc4"
  }),
  menuList: (provided) => ({
    ...provided,
    "& *:hover": {
      backgroundColor: "#e5fbf3",
      color: "black",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#30E1A5" : "transparent",
    "& *:active": {
      backgroundColor: "#e5fbf3",
      color: "black",
    },
    "&:active": {
      backgroundColor: "#e5fbf3",
      color: "black",
    },
    fontFamily: "Barlow",
    fontSize: 18,
    fontWeight: "400",
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return { 
      ...provided,
      opacity, transition,
      fontFamily: "Barlow",
      fontSize: 18,
      fontWeight: "400",
    };
  }
}