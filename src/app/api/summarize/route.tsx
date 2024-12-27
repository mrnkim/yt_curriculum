import { NextResponse } from "next/server";

export const maxDuration = 60;

const API_KEY = process.env.TWELVELABS_API_KEY;
const TWELVELABS_API_BASE_URL = process.env.TWELVELABS_API_BASE_URL;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    console.log("🚀 > GET > videoId=", videoId)
    const type = searchParams.get("type");
    console.log("🚀 > GET > type=", type)

    if (!videoId) {
      return NextResponse.json(
        { error: "videoId is required" },
        { status: 400 }
      );
    }

      const url = `${TWELVELABS_API_BASE_URL}/summarize`;
      const options = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "x-api-key": `${API_KEY}`,
            },
            body: JSON.stringify({type: type, video_id: videoId, prompt: "Provide one line summary."})
        };

      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();

        if (!responseData) {
          throw new Error("Empty response from API");
        }

        return NextResponse.json(responseData, { status: 200 });
      } catch (error) {
        console.error("Error in GET function:", error);
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "Internal Server Error" },
          { status: 500 }
        );
      }
}
