import { Transaccion } from "@/app/(tabs)/transacciones";

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

export const datosBarChart = (arrayTransacciones: Transaccion[]) => {
  const groupedData = arrayTransacciones.reduce(
    (acc: { [key: string]: { etiqueta: string; monto: number } }, item) => {
      const fecha = formatDate(item.transaccion_fecha); // ej: "30/Sep/2025"
      // solo tomamos hasta el segundo /
      const slashIndex = fecha.indexOf("/", fecha.indexOf("/") + 1);
      const fechaCorta = fecha.slice(0, slashIndex); // ej: "30/Sep"

      if (!acc[fechaCorta]) {
        acc[fechaCorta] = { etiqueta: fechaCorta, monto: 0 };
      }
      acc[fechaCorta].monto += item.transaccion_monto;
      return acc;
    },
    {}
  );

  const monthMap: { [key: string]: number } = {
    Ene: 1,
    Feb: 2,
    Mar: 3,
    Abr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Ago: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dic: 12,
  };

  const chartDataArray = Object.keys(groupedData)
    .sort((a, b) => {
      const [diaA, mesA] = a.split('/');
      const [diaB, mesB] = b.split('/');
      if (monthMap[mesB] === monthMap[mesA]) {
        return Number(diaB) - Number(diaA);
      }
      return monthMap[mesB] - monthMap[mesA];
    })
    .map(fecha => ({
      label: groupedData[fecha].etiqueta,
      value: groupedData[fecha].monto
    }));
  return chartDataArray
};
