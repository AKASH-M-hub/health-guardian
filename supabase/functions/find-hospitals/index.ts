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
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

    if (!apiKey) {
      throw new Error("Google Maps API key not configured");
    }

    if (!lat || !lng) {
      throw new Error("Latitude and longitude are required");
    }

    // Use Google Places API to find nearby hospitals
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;
    
    const response = await fetch(placesUrl);
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places API error:", data);
      throw new Error(`Google Places API error: ${data.status}`);
    }

    // Transform the results
    const hospitals = (data.results || []).map((place: any, index: number) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      lat: place.geometry?.location?.lat,
      lng: place.geometry?.location?.lng,
      rating: place.rating || 0,
      totalRatings: place.user_ratings_total || 0,
      isOpen: place.opening_hours?.open_now ?? null,
      types: place.types || [],
      photoRef: place.photos?.[0]?.photo_reference || null,
      distance: calculateDistance(lat, lng, place.geometry?.location?.lat, place.geometry?.location?.lng)
    }));

    // Sort by distance
    hospitals.sort((a: any, b: any) => a.distance - b.distance);

    return new Response(JSON.stringify({ hospitals }), {
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

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
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
