import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";

// Public on purpose: used both by the (unauthenticated) /hire project-brief
// upload and by admin milestone media uploads. Type/size are validated in
// uploadToR2 regardless of caller — there's nothing sensitive stored here
// beyond what the person submitting is choosing to attach.
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  const folder = (formData.get("folder") as string) || "uploads";

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const result = await uploadToR2(file, folder);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ url: result.url }, { status: 201 });
}
