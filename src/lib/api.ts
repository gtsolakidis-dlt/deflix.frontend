import { useBaseUrl } from "../contexts/BaseUrlContext";
import { BaseUrls } from "../types";

type ImgPath = string | null | undefined;

type FetchOptions = {
  method?: "GET" | "POST" | "DELETE" | "PUT";
  body?: any;
  headers?: HeadersInit;
  init?: RequestInit;
};

export class MYAPI {
  getImageURL(path: ImgPath, size: string) {
    if (!path) return;
    if (size !== "original") {
      return (path = path?.replace("/original/", `/${size}/`));
    }
    return path;
  }

  getPosterURL(posterPath: ImgPath, size = "w185") {
    if (!posterPath) return "/poster_placeholder.png";
    return this.getImageURL(posterPath, size);
  }

  getBackdropURL(backdropPath: ImgPath, size = "w780") {
    if (!backdropPath) return "/still_placeholder.png";
    return this.getImageURL(backdropPath, size);
  }

  getLogoURL(logoPath: ImgPath, size = "w300") {
    return this.getImageURL(logoPath, size);
  }

  async makeRequest<T = any>(
    endpoint: string,
    options: FetchOptions,
    service: keyof BaseUrls = "monolithic"
  ): Promise<T> {
    const { baseUrl } = useBaseUrl();
    const serviceBaseUrl = baseUrl[service] || baseUrl["monolithic"];

    try {
      const res = await fetch(`${serviceBaseUrl}${endpoint}`, options);
      if (!res.ok) throw res;
      return res.json();
    } catch (e) {
      if (e instanceof Response) throw e;
      throw new Error(`Something went horribly wrong: ${(e as Error).message}`);
    }
  }

  makeEndpoint(endpoint: string, service: keyof BaseUrls = "monolithic") {
    const { baseUrl } = useBaseUrl();
    const serviceBaseUrl = baseUrl[service] || baseUrl["monolithic"];
    return `${serviceBaseUrl}${endpoint}`;
  }
}

export const api = new MYAPI();
