// app/api/claim/upload/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 5;
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
];

/**
 * POST /api/claim/upload
 * Public endpoint — accepts multipart/form-data with files + claim_id.
 *
 * FormData fields:
 *   - files: one or more files (max 5)
 *   - claim_id: the numeric ID of the claim row (optional; can be empty)
 *
 * Returns: { success: true, uploaded: [...], failed: [...] }
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const claimIdRaw = formData.get('claim_id');

    // Parse claim_id — allow empty (files uploaded before claim exists)
    const claimId =
      claimIdRaw && String(claimIdRaw).trim() !== ''
        ? parseInt(String(claimIdRaw), 10)
        : null;

    if (claimId !== null && isNaN(claimId)) {
      return NextResponse.json(
        { error: 'Invalid claim_id' },
        { status: 400 }
      );
    }

    // Collect all files
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === 'files' && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} files per claim` },
        { status: 400 }
      );
    }

    const uploaded: {
      id: number;
      file_name: string;
      file_path: string;
    }[] = [];
    const failed: { file_name: string; reason: string }[] = [];

    // Generate a unique folder for this upload batch
    const batchFolder = `claim-${claimId ?? 'pending'}-${Date.now()}`;

    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        failed.push({
          file_name: file.name,
          reason: 'File exceeds 5 MB limit',
        });
        continue;
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        failed.push({
          file_name: file.name,
          reason: 'File type not allowed',
        });
        continue;
      }

      // Sanitize filename (remove path separators, special chars)
      const sanitized = file.name
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .slice(0, 100);

      // Storage path: <batch>/<timestamp>-<sanitized-name>
      const storagePath = `${batchFolder}/${Date.now()}-${sanitized}`;

      try {
        // Upload to Supabase Storage
        const arrayBuffer = await file.arrayBuffer();
        const { error: uploadError } = await adminSupabase.storage
          .from('claim-documents')
          .upload(storagePath, arrayBuffer, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          failed.push({
            file_name: file.name,
            reason: uploadError.message || 'Upload failed',
          });
          continue;
        }

        // Insert metadata into DB
        const { data: doc, error: dbError } = await adminSupabase
          .from('claim_documents')
          .insert([
            {
              claim_id: claimId,
              file_name: file.name,
              file_path: storagePath,
              file_size: file.size,
              file_type: file.type,
            },
          ])
          .select('id, file_name, file_path')
          .single();

        if (dbError || !doc) {
          console.error('DB insert error:', dbError);
          failed.push({
            file_name: file.name,
            reason: 'Could not save file record',
          });
          // Clean up storage since DB failed
          await adminSupabase.storage
            .from('claim-documents')
            .remove([storagePath]);
          continue;
        }

        uploaded.push(doc);
      } catch (err: any) {
        console.error('Upload processing error:', err);
        failed.push({
          file_name: file.name,
          reason: err.message || 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      uploaded,
      failed,
      total_uploaded: uploaded.length,
      total_failed: failed.length,
    });
  } catch (error) {
    console.error('POST /api/claim/upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}