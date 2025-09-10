import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-public-anon-key';

/**
 * Supabase client instance.
 * Ganti URL dan Key dengan kredensial proyek Supabase Anda yang sebenarnya.
 * 
 * Anda juga perlu membuat tabel di proyek Supabase Anda.
 * Contoh SQL untuk tabel 'history':
 * 
 * CREATE TABLE history (
 *   id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 *   read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *   name TEXT NOT NULL,
 *   card_number TEXT NOT NULL,
 *   balance NUMERIC NOT NULL
 * );
 * 
 * Pastikan RLS (Row Level Security) dikonfigurasi dengan sesuai.
 * Untuk contoh ini, Anda mungkin ingin mengizinkan akses baca/tulis publik.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured =
    supabaseUrl !== 'https://your-project-url.supabase.co' &&
    supabaseKey !== 'your-public-anon-key';