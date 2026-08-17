import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

const CommuteInputSchema = z.object({
  originLat: z.number(),
  originLng: z.number(),
  destinations: z
    .array(
      z.object({
        id: z.string(),
        lat: z.number(),
        lng: z.number(),
      }),
    )
    .min(1)
    .max(40),
});

export type CommuteResult = {
  id: string;
  transitMinutes: number | null;
  driveMinutes: number | null;
};

async function computeMatrix(
  originLat: number,
  originLng: number,
  destinations: Array<{ id: string; lat: number; lng: number }>,
  travelMode: "TRANSIT" | "DRIVE",
): Promise<Map<string, number | null>> {
  const lovableApiKey = process.env.LOVABLE_API_KEY;
  const gmapsKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!lovableApiKey || !gmapsKey) {
    throw new Error("Google Maps connector credentials missing");
  }

  const body: Record<string, unknown> = {
    origins: [
      {
        waypoint: {
          location: {
            latLng: { latitude: originLat, longitude: originLng },
          },
        },
      },
    ],
    destinations: destinations.map((d) => ({
      waypoint: {
        location: { latLng: { latitude: d.lat, longitude: d.lng } },
      },
    })),
    travelMode,
  };
  if (travelMode === "DRIVE") {
    body.routingPreference = "TRAFFIC_AWARE";
  }

  const res = await fetch(
    `${GATEWAY_URL}/routes/distanceMatrix/v2:computeRouteMatrix`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "X-Connection-Api-Key": gmapsKey,
        "Content-Type": "application/json",
        "X-Goog-FieldMask":
          "originIndex,destinationIndex,duration,condition,status",
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Routes API failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as Array<{
    destinationIndex: number;
    duration?: string;
    condition?: string;
  }>;

  const out = new Map<string, number | null>();
  for (const row of data) {
    const dest = destinations[row.destinationIndex];
    if (!dest) continue;
    if (row.condition !== "ROUTE_EXISTS" || !row.duration) {
      out.set(dest.id, null);
      continue;
    }
    // duration looks like "1234s"
    const seconds = parseInt(row.duration.replace(/[^0-9]/g, ""), 10);
    out.set(dest.id, Number.isFinite(seconds) ? Math.round(seconds / 60) : null);
  }
  return out;
}

export const getCommutes = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => CommuteInputSchema.parse(data))
  .handler(async ({ data }) => {
    const [transit, drive] = await Promise.all([
      computeMatrix(data.originLat, data.originLng, data.destinations, "TRANSIT").catch(
        () => new Map<string, number | null>(),
      ),
      computeMatrix(data.originLat, data.originLng, data.destinations, "DRIVE").catch(
        () => new Map<string, number | null>(),
      ),
    ]);

    const results: CommuteResult[] = data.destinations.map((d) => ({
      id: d.id,
      transitMinutes: transit.get(d.id) ?? null,
      driveMinutes: drive.get(d.id) ?? null,
    }));
    return { results };
  });

const GeocodeInputSchema = z.object({
  address: z.string().min(2).max(300),
});

export const geocodeAddress = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => GeocodeInputSchema.parse(data))
  .handler(async ({ data }) => {
    const lovableApiKey = process.env.LOVABLE_API_KEY;
    const gmapsKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!lovableApiKey || !gmapsKey) {
      throw new Error("Google Maps connector credentials missing");
    }

    const url = `${GATEWAY_URL}/maps/api/geocode/json?address=${encodeURIComponent(
      data.address,
    )}&components=administrative_area:NY|country:US`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "X-Connection-Api-Key": gmapsKey,
      },
    });

    if (!res.ok) {
      throw new Error(`Geocoding failed: ${res.status}`);
    }
    const json = (await res.json()) as {
      status: string;
      results: Array<{
        formatted_address: string;
        geometry: { location: { lat: number; lng: number } };
      }>;
    };

    if (json.status !== "OK" || !json.results.length) {
      return { ok: false as const, error: json.status };
    }
    const top = json.results[0];
    return {
      ok: true as const,
      address: top.formatted_address,
      lat: top.geometry.location.lat,
      lng: top.geometry.location.lng,
    };
  });
