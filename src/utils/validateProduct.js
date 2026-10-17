export function validateProduct(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Enter a coffee name.";
  if (!values.description.trim()) errors.description = "Enter a description.";
  if (!values.origin.trim()) errors.origin = "Enter the origin.";
  if (values.price === "" || Number.isNaN(Number(values.price))) {
    errors.price = "Enter a price as a number.";
  } else if (Number(values.price) <= 0) {
    errors.price = "Price must be greater than 0.";
  }
  return errors;
}
