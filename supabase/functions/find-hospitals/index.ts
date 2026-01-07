import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lng, radius = 5000, type = "hospital" } = await req.json();

    if (!lat || !lng) {
      throw new Error("Latitude and longitude are required");
    }

    console.log(`Searching for ${type} near ${lat}, ${lng} within ${radius}m`);

    // Simple Overpass query - just find hospitals
    const overpassQuery = `
      [out:json][timeout:30];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        way["amenity"="hospital"](around:${radius},${lat},${lng});
        node["amenity"="clinic"](around:${radius},${lat},${lng});
        way["amenity"="clinic"](around:${radius},${lat},${lng});
        node["amenity"="doctors"](around:${radius},${lat},${lng});
        way["amenity"="doctors"](around:${radius},${lat},${lng});
      );
      out center;
    `;

    const overpassUrl = "https://overpass-api.de/api/interpreter";
    
    console.log("Sending request to Overpass API...");
    const response = await fetch(overpassUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    if (!response.ok) {
      console.error("Overpass API error:", response.status, await response.text());
      throw new Error(`Overpass API returned status ${response.status}`);
    }

    const data = await response.json();
    console.log(`Overpass API returned ${data.elements?.length || 0} results`);

    // Transform the results
    const hospitals = (data.elements || []).map((place: any, index: number) => {
      const placeLat = place.lat || place.center?.lat;
      const placeLng = place.lon || place.center?.lon;
      
      if (!placeLat || !placeLng) return null;
      
      return {
        id: `osm-${place.id}`,
        name: place.tags?.name || `Medical Facility ${index + 1}`,
        address: formatAddress(place.tags),
        lat: placeLat,
        lng: placeLng,
        rating: 4.0,
        totalRatings: 0,
        isOpen: null,
        types: [place.tags?.amenity || "hospital"],
        phone: place.tags?.phone || null,
        website: place.tags?.website || null,
        emergency: place.tags?.emergency === "yes",
        distance: calculateDistance(lat, lng, placeLat, placeLng)
      };
    }).filter((h: any) => h !== null);

    // Sort by distance and limit to 15 results for better display
    hospitals.sort((a: any, b: any) => a.distance - b.distance);
    const limitedHospitals = hospitals.slice(0, 15);

    return new Response(JSON.stringify({ hospitals: limitedHospitals }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in find-hospitals:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function formatAddress(tags: any): string {
  if (!tags) return "Address not available";
  
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:city"],
    tags["addr:postcode"],
  ].filter(Boolean);
  
  return parts.length > 0 ? parts.join(", ") : (tags.address || "Address not available");
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  if (!lat1 || !lng1 || !lat2 || !lng2) return 999;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100; // Distance in km with 2 decimal places
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
