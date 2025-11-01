export const generateJoinCode = () => {
  const letters = Array.from({ length: 3 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");

  const numbers = Math.floor(1000 + Math.random() * 9000); // ensures 4 digits

  return `${letters}${numbers}`;
};
