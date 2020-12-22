// Custom Styles

export const borderColorForState = state => {
    if (state.isFocused) {
      return "#30E1A5 !important"
    } else {
      return "#b2bfc4 !important"
    }
  }

const popoutStyles = {
    dropdownIndicator: (provided, state) => ({
        ...provided,
        height: 48,
        marginBottom: 24,
        borderColor: borderColorForState(state),
        "&:hover": {
            borderColor: "#30E1A5 !important",
        },
        outline: "none",
        width: "100%"
    }),
}

export { popoutStyles };