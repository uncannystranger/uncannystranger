drop trigger if exists photos_upsert_frame_story on public.photos;

revoke all on function public.sync_gallery_cache(text, jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.repair_frame_cache(text, jsonb, jsonb) from public, anon, authenticated;

-- The backend route uses CRON_SECRET; each function validates the same token
-- against private.gallery_sync_credentials before any write is possible.
grant execute on function public.sync_gallery_cache(text, jsonb, jsonb) to anon, service_role;
grant execute on function public.repair_frame_cache(text, jsonb, jsonb) to anon, service_role;
