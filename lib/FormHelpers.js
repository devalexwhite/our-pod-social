export const onChange = (e, setter) => {
  const value = e.target.value;
  const name = e.target.name;

  setter((prevState) => ({
    ...prevState,
    [name]: value,
  }));
};
