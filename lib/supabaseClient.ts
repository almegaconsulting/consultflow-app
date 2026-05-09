// Cliente de Supabase
// Este archivo se encarga de conectar nuestra app con la base de datos

import { createClient } from "@supabase/supabase-js";

// Leemos variables del .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Creamos la conexión
export const supabase = createClient(supabaseUrl, supabaseAnonKey);