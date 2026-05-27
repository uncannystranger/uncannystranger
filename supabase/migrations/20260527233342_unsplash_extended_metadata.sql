alter table public.photos
  add column if not exists unsplash_views_count bigint check (unsplash_views_count >= 0),
  add column if not exists unsplash_exif jsonb;

create or replace function public.sync_gallery_statistics(
  p_token text,
  p_rows jsonb
)
returns integer
language plpgsql
security definer
set search_path = public, private, extensions
as $$
declare
  affected integer := 0;
begin
  if p_token is null or not exists (
    select 1
    from private.gallery_sync_credentials
    where token_hash = extensions.digest(p_token, 'sha256')
  ) then
    raise insufficient_privilege using message = 'Unauthorized gallery statistic sync.';
  end if;

  with changed as (
    update public.photos photo
    set
      unsplash_likes_count = coalesce(row.unsplash_likes_count, photo.unsplash_likes_count),
      unsplash_downloads_count = coalesce(row.unsplash_downloads_count, photo.unsplash_downloads_count),
      unsplash_views_count = coalesce(row.unsplash_views_count, photo.unsplash_views_count),
      unsplash_exif = coalesce(row.unsplash_exif, photo.unsplash_exif),
      updated_at = now()
    from jsonb_to_recordset(coalesce(p_rows, '[]'::jsonb)) as row (
      unsplash_id text,
      unsplash_likes_count bigint,
      unsplash_downloads_count bigint,
      unsplash_views_count bigint,
      unsplash_exif jsonb
    )
    where photo.unsplash_id = row.unsplash_id
      and photo.source = 'unsplash'
    returning photo.id
  )
  select count(*)::integer into affected from changed;

  return affected;
end;
$$;

revoke all on function public.sync_gallery_statistics(text, jsonb) from public, anon, authenticated;
grant execute on function public.sync_gallery_statistics(text, jsonb) to anon, service_role;
