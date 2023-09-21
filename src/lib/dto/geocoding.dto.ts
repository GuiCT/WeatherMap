export type GeoCodingEntry = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  country: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
};

export type GeoCodingResponse = {
  results?: GeoCodingEntry[];
  generationtime_ms: number;
};
