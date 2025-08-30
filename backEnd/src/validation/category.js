exports.validateCategoryName=(cname) =>{
  if (!cname) {
    return "category name is required";
  }

  for (let i = 0; i < cname.length; i++) {
    let ch = cname[i];

    // Allow only uppercase, lowercase letters and space
    if (!(
        (ch >= "A" && ch <= "Z") ||
        (ch >= "a" && ch <= "z") ||
        ch === " "
      )) {
      return "category name must contain only alphabets and spaces";
    }
  }

  return null; // 
}