revoke all privileges on table public.photos from anon, authenticated;
revoke all privileges on table public.frames from anon, authenticated;
revoke all privileges on table public.frame_likes from anon, authenticated;
revoke all privileges on table public.frame_views from anon, authenticated;
revoke all privileges on table public.sync_logs from anon, authenticated;

grant select on table public.photos, public.frames to anon, authenticated;
