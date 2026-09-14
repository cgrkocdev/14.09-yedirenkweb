import { fetchOfficialExchangeRates } from "../scripts/server.js";

export default async function handler(request, response) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  if (request.method !== "GET") {
    response.setHeader("Cache-Control", "no-store");
    return response.status(405).json({ message: "Yöntem desteklenmiyor." });
  }
  try {
    const payload = await fetchOfficialExchangeRates();
    response.setHeader(
      "Cache-Control",
      "public, max-age=60, s-maxage=300, stale-while-revalidate=300",
    );
    return response.status(200).json(payload);
  } catch (error) {
    response.setHeader("Cache-Control", "no-store");
    return response.status(503).json({
      message:
        error instanceof Error
          ? error.message
          : "Resmî döviz kurları alınamadı.",
    });
  }
}
