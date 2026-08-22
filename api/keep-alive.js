import { createClient } from '@supabase/supabase-js';

export default {
  async fetch(request) {
    if (request.method !== 'GET') {
      return Response.json(
        {
          ok: false,
          error: 'Method not allowed',
        },
        { status: 405 },
      );
    }

    const authorization = request.headers.get('authorization');

    if (
      !process.env.CRON_SECRET ||
      authorization !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return Response.json(
        {
          ok: false,
          error: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !publishableKey || !secretKey) {
      return Response.json(
        {
          ok: false,
          error: 'Missing Supabase environment variables',
        },
        { status: 500 },
      );
    }

    // 1 — vraie requête Data API avec la clé publique
    const publicClient = createClient(
      supabaseUrl,
      publishableKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const { data, error: readError } = await publicClient
      .from('keep_alive')
      .select('id,last_ping')
      .eq('id', 1)
      .single();

    if (readError) {
      return Response.json(
        {
          ok: false,
          step: 'public-read',
          error: readError.message,
        },
        { status: 500 },
      );
    }

    // 2 — mise à jour du timestamp pour qu'on puisse vérifier le cron
    const adminClient = createClient(
      supabaseUrl,
      secretKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const now = new Date().toISOString();

    const { error: updateError } = await adminClient
      .from('keep_alive')
      .update({
        last_ping: now,
      })
      .eq('id', 1);

    if (updateError) {
      return Response.json(
        {
          ok: false,
          step: 'admin-update',
          publicRead: true,
          error: updateError.message,
        },
        { status: 500 },
      );
    }

    return Response.json({
      ok: true,
      publicRead: true,
      previousPing: data?.last_ping,
      ping: now,
    });
  },
};