interface PixData {
  key: string;
  name: string;
  city: string;
  txid: string;
  value?: number;
  message?: string;
}

function crc16ccitt(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) > 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

function formatField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

export function generatePixPayload({ key, name, city, txid, value, message }: PixData): string {
  const payloadKey = formatField("01", key); // Chave Pix
  
  // Se houver mensagem, pode ser incluída na descrição (opcional, nem todos apps leem)
  // O padrão EMV do Pix é meio rígido. Vamos focar no básico funcional.
  
  const merchantAccountInfo = [
    formatField("00", "BR.GOV.BCB.PIX"),
    payloadKey,
    message ? formatField("02", message.substring(0, 50)) : "", // Descrição opcional
  ].join("");

  const merchantCategory = "0000"; // MCC genérico
  const transactionCurrency = "986"; // BRL

  const payload = [
    formatField("00", "01"), // Payload Format Indicator
    formatField("26", merchantAccountInfo), // Merchant Account Information
    formatField("52", merchantCategory), // Merchant Category Code
    formatField("53", transactionCurrency), // Transaction Currency
  ];

  if (value) {
    payload.push(formatField("54", value.toFixed(2))); // Transaction Amount
  }

  payload.push(formatField("58", "BR")); // Country Code
  payload.push(formatField("59", name.substring(0, 25))); // Merchant Name
  payload.push(formatField("60", city.substring(0, 15))); // Merchant City
  
  const additionalData = formatField("05", txid || "***"); // Reference Label (txid)
  payload.push(formatField("62", additionalData));

  // CRC16
  const payloadString = payload.join("") + "6304";
  const crc = crc16ccitt(payloadString);

  return `${payloadString}${crc}`;
}
