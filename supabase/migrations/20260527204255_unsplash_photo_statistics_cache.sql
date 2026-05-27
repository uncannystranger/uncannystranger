alter table public.photos
  add column if not exists unsplash_likes_count bigint check (unsplash_likes_count >= 0),
  add column if not exists unsplash_downloads_count bigint check (unsplash_downloads_count >= 0);

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
      updated_at = now()
    from jsonb_to_recordset(coalesce(p_rows, '[]'::jsonb)) as row (
      unsplash_id text,
      unsplash_likes_count bigint,
      unsplash_downloads_count bigint
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

-- The RPC is callable through the existing server route only after it proves
-- knowledge of the high-entropy token stored in the private credentials table.
grant execute on function public.sync_gallery_statistics(text, jsonb) to anon, service_role;
