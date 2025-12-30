import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const userId = formData.get("user_id");

    if (!file) return NextResponse.json({ error: "No file uploaded" });
    if (!userId) return NextResponse.json({ error: "Missing user_id" });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${userId}/${Date.now()}-${file.name}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("datasets")
      .upload(fileName, buffer, { contentType: file.type });

    if (uploadError) throw uploadError;

    const publicUrl =
      supabase.storage.from("datasets").getPublicUrl(fileName).data.publicUrl;

    // Insert into datasets table
    const { data: dataset, error: dbError } = await supabase
      .from("datasets")
      .insert({
        name: file.name,
        file_url: publicUrl,
        user_id: userId,
        rows: null,
        metadata: {},
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // Insert first version
    await supabase.from("dataset_versions").insert({
      dataset_id: dataset.id,
      version_number: 1,
      file_url: publicUrl,
      metadata: {},
    });

    return NextResponse.json({ success: true, dataset });

  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}
