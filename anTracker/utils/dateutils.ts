import { Transaccion } from "@/app/(tabs)/transacciones";
import i18n from "./i18n";

export const formatDate = (ms: number) => {
  const d = new Date(ms);
  const day = d.getDate().toString().padStart(2, "0");

  const months = i18n.t("Transactions.Months") as string[];
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

export const datosBarChart = (arrayTransacciones: Transaccion[]) => {
  const groupedData = arrayTransacciones.reduce(
    (acc: { [key: string]: { etiqueta: string; monto: number } }, item) => {
      const fecha = formatDate(item.transaccion_fecha);
      const slashIndex = fecha.indexOf("/", fecha.indexOf("/") + 1);
      const fechaCorta = fecha.slice(0, slashIndex);

      if (!acc[fechaCorta]) {
        acc[fechaCorta] = { etiqueta: fechaCorta, monto: 0 };
      }
      acc[fechaCorta].monto += item.transaccion_monto;
      return acc;
    },
    {}
  );

  const monthsShort = i18n.t("Transactions.Months") as string[];

  const monthMap: { [key: string]: number } = monthsShort.reduce(
    (acc: { [key: string]: number }, mes: string, index: number) => {
      acc[mes] = index + 1;
      return acc;
    },
    {}
  );

  const chartDataArray = Object.keys(groupedData)
    .sort((a, b) => {
      const [diaA, mesA] = a.split("/");
      const [diaB, mesB] = b.split("/");
      if (monthMap[mesB] === monthMap[mesA]) {
        return Number(diaB) - Number(diaA);
      }
      return monthMap[mesB] - monthMap[mesA];
    })
    .map((fecha) => ({
      label: groupedData[fecha].etiqueta,
      value: groupedData[fecha].monto,
    }));

  return chartDataArray;
};
