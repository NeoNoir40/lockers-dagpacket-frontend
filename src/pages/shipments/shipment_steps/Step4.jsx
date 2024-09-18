import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Step4({ shippingData }) {
  const parseToFloat = (value) => parseFloat(value) || 0;

  // Estado para almacenar los datos del envío
  const [data, setData] = useState({
    pais_origen: shippingData.sender.country,
    pais_destino: shippingData.recipient.country,
    cp_origen: shippingData.sender.zipCode,
    cp_destino: shippingData.recipient.zipCode,
    alto: parseToFloat(shippingData.package.height),
    ancho: parseToFloat(shippingData.package.width),
    largo: parseToFloat(shippingData.package.length),
    peso: parseToFloat(shippingData.package.weight),
    seguro: false,
    valor_declarado: parseToFloat(shippingData.package.value),
  });

  // Estado para almacenar las cotizaciones
  const [quotes, setQuotes] = useState([]);

  const company = shippingData.company.name;

  useEffect(() => {
    if (company === "DHL") {
      const fetchQuote = async () => {
        const orderedData = {
          pais_origen: data.pais_origen,
          pais_destino: data.pais_destino,
          cp_origen: data.cp_origen,
          cp_destino: data.cp_destino,
          alto: data.alto,
          ancho: data.ancho,
          largo: data.largo,
          peso: data.peso,
          seguro: data.seguro,
          valor_declarado: data.valor_declarado,
        };

        try {
          const response = await axios.post(
            "http://localhost:3000/api/v1/dhl/quote",
            orderedData
          );
          // Guardar las cotizaciones en el estado
          setQuotes(response.data.dhl.data.paqueterias);
          console.log("Quotes:", response.data.dhl.data.paqueterias);
        } catch (error) {
          console.error("Error fetching DHL quote:", error);
        }
      };

      fetchQuote();
    }
  }, [company, data]);

  return (
    <div className="p-10 shadow-xl bg-gray-50">
      <h1>Cotizaciones de DHL</h1>
      {/* Comprobar si hay cotizaciones */}
      {quotes.length > 0 ? (
        <div className="text-xl font-bold mb-4 ">
          {quotes.map((quote, index) => (
            <div key={index} className="bg-white mb-5 rounded-md shadow-md+ quote-card grid grid-cols-4 px-5 py-5  ">
              <img src={quote.logo} alt={`${quote.proveedor} logo`} />
              <h2>{quote.nombre_servicio}</h2>
              <p>Tiempo de entrega: {new Date(quote.tiempo_de_entrega).toLocaleDateString()}</p>
              <p>Precio: ${quote.precio}</p>
              <p>Kilos a cobrar: {quote.kilos_a_cobrar}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron cotizaciones.</p>
      )}
    </div>
  );
}
