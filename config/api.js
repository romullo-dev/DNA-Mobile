export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://www.dnatransportes.shop/api";

export const endpoints = {
  login: `${API_BASE_URL}/login`,
  rotas: `${API_BASE_URL}/rotas`,
  historico: `${API_BASE_URL}/historico`,
};

export async function apiFetch(url, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Não foi possível interpretar a resposta como JSON:", text);
    throw new Error("Resposta inesperada do servidor");
  }

  if (!response.ok) {
    const message = data?.message ?? "Erro de comunicação com o servidor";
    const error = new Error(message);
    error.details = data;
    error.status = response.status;
    throw error;
  }

  return data;
}
