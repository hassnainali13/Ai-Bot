function calculateAge() {
  const birthYear = 2002;
  const birthMonth = 5;
  const today = new Date();

  let age = today.getFullYear() - birthYear;
  if (today.getMonth() < birthMonth) age--;

  return age;
}

module.exports = calculateAge;
