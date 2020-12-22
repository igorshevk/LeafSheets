const isSheetInCartItems = (sheet, cartItems) => {
  let inCart = false;
  cartItems.forEach(order_item => {
    if (order_item.item.sheet.id === sheet.id) {
      inCart = true;
    }
  }) 
  return inCart;
}

const isSheetInUserSheets = (sheet, userSheets) => {
  let inUserSheets = false;
  userSheets.forEach(userSheet => {
    if (userSheet.sheet.id === sheet.id) {
      inUserSheets = true;
    }
  }) 
  return inUserSheets;
}

const getUpdatedUserVariableDict = (userSheet, updates) => {
  const userVariableDict = userSheet.user_variable_dict;
  userVariableDict.context.forEach(variable => {
    Object.keys(updates).forEach(updateKey => {
      if (updateKey === variable.find) {
        variable.replace = updates[updateKey];
      }
    });
  })
  return userVariableDict;
}

export { isSheetInCartItems, isSheetInUserSheets, getUpdatedUserVariableDict }