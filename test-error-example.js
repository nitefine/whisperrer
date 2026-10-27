// test-error.js
function calculateSalary() {
  const employee = null;
  console.log(employee.name); // It will definitely result in a TypeError.
}

calculateSalary();