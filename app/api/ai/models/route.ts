import { NextResponse } from "next/server"
import { listModels } from "@/features/agent/registry"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({ models: listModels() })
}
