export const formatDate = (ms: number) => {
  const d = new Date(ms);
  const day = d.getDate().toString().padStart(2, "0");
  const months = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};
