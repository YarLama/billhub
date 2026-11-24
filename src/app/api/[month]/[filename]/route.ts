import { serverStorage } from "@/shared/lib/storage";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ month: string, filename: string }> }
) {
  const { month, filename } = await params;

  if (month.includes("..") || filename.includes("..")) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  try {
    const fileBuffer = await serverStorage.readFile(`static/${month}/${filename}`);

    if (!fileBuffer) {
      return new NextResponse("File not found", { status: 404 });
    }

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${encodeURIComponent(filename)}"`
      }
    });
  } catch {
    return new NextResponse("File not found", { status: 404 });
  }
}
