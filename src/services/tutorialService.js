const API_BASE_URL = "http://localhost:8080/saathi/api";

export async function getTutorialsByRole(role) {
  const response = await fetch(
    `${API_BASE_URL}/details/v1`,
    {
      method: "GET",
      headers: {
        "X-Role": role,
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
     console.log("BACKEND RESPONSE:", data);
    throw new Error(
      data.message ||
      data.error ||
      "Failed to fetch tutorials"
    );
  }

  return data;
}


export async function getVideo(videoId, role) {
  const response = await fetch(
    `${API_BASE_URL}/v1/${videoId}`,
    {
      method: "GET",
      headers: {
        "X-Role": role,
      },
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.message ||
      data?.error ||
      "Failed to load video"
    );
  }

  const blob = await response.blob();

  return URL.createObjectURL(blob);
}