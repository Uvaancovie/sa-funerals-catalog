import { withSupabase } from "@supabase/server"

/**
 * Example Supabase request handler using @supabase/server.
 * 
 * This endpoint demonstrates how to use `withSupabase` from "@supabase/server".
 * It connects to Supabase, validates the authentication context, and exposes:
 * - `ctx.supabase`: An RLS-scoped client
 * - `ctx.supabaseAdmin`: An admin client that bypasses RLS
 */
export default {
  fetch: withSupabase({ auth: "none" }, async (_req, ctx) => {
    // 1. Fetch public products from the 'Products' table using the RLS-scoped client
    const { data, error } = await ctx.supabase
      .from("Products")
      .select("id, name, category, price")
      .limit(5)

    if (error) {
      console.error("Supabase API query error:", error)
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return Response.json({
      success: true,
      message: "Fetched successfully using @supabase/server ctx.supabase client",
      products: data,
    })
  }),
}
