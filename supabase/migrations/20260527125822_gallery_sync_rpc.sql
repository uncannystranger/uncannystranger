create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.gallery_sync_credentials (
  id boolean primary key default true check (id),
  token_hash bytea not null,
  updated_at timestamptz not null default now()
);

alter table private.gallery_sync_credentials enable row level security;
revoke all privileges on table private.gallery_sync_credentials from public, anon, authenticated;

create or replace function public.sync_gallery_cache(
  p_token text,
  p_rows jsonb,
  p_report jsonb
)
returns void
language plpgsql
security definer
set search_path = public, private, extensions
as $$
begin
  if p_token is null or not exists (
    select 1
    from private.gallery_sync_credentials
    where token_hash = extensions.digest(p_token, 'sha256')
  ) then
    raise insufficient_privilege using message = 'Unauthorized gallery sync.';
  end if;

  insert into public.photos (
    unsplash_id,
    unsplash_url,
    image_url_raw,
    image_url_thumb,
    image_url_small,
    image_url_regular,
    image_url_full,
    title,
    caption,
    description,
    alt_text,
    category,
    album_name,
    collection_name,
    moment_group,
    location,
    location_name,
    year,
    month,
    source,
    author_name,
    author_username,
    photographer_name,
    photographer_url,
    created_at_unsplash,
    updated_at_unsplash,
    synced_at,
    width,
    height,
    aspect_ratio,
    color,
    blur_hash,
    tags,
    is_pinned,
    is_featured,
    is_favorite,
    is_visible,
    search_text
  )
  select
    row.unsplash_id,
    row.unsplash_url,
    row.image_url_raw,
    row.image_url_thumb,
    row.image_url_small,
    row.image_url_regular,
    row.image_url_full,
    row.title,
    row.caption,
    row.description,
    row.alt_text,
    row.category,
    row.album_name,
    row.collection_name,
    row.moment_group,
    row.location,
    row.location_name,
    row.year,
    row.month,
    row.source,
    row.author_name,
    row.author_username,
    row.photographer_name,
    row.photographer_url,
    row.created_at_unsplash,
    row.updated_at_unsplash,
    row.synced_at,
    row.width,
    row.height,
    row.aspect_ratio,
    row.color,
    row.blur_hash,
    coalesce(row.tags, '{}'::text[]),
    coalesce(row.is_pinned, false),
    coalesce(row.is_featured, false),
    coalesce(row.is_favorite, false),
    coalesce(row.is_visible, true),
    row.search_text
  from jsonb_to_recordset(coalesce(p_rows, '[]'::jsonb)) as row (
    unsplash_id text,
    unsplash_url text,
    image_url_raw text,
    image_url_thumb text,
    image_url_small text,
    image_url_regular text,
    image_url_full text,
    title text,
    caption text,
    description text,
    alt_text text,
    category text,
    album_name text,
    collection_name text,
    moment_group text,
    location text,
    location_name text,
    year integer,
    month integer,
    source text,
    author_name text,
    author_username text,
    photographer_name text,
    photographer_url text,
    created_at_unsplash timestamptz,
    updated_at_unsplash timestamptz,
    synced_at timestamptz,
    width integer,
    height integer,
    aspect_ratio numeric,
    color text,
    blur_hash text,
    tags text[],
    is_pinned boolean,
    is_featured boolean,
    is_favorite boolean,
    is_visible boolean,
    search_text text
  )
  on conflict (unsplash_id) do update set
    unsplash_url = excluded.unsplash_url,
    image_url_raw = excluded.image_url_raw,
    image_url_thumb = excluded.image_url_thumb,
    image_url_small = excluded.image_url_small,
    image_url_regular = excluded.image_url_regular,
    image_url_full = excluded.image_url_full,
    title = excluded.title,
    caption = excluded.caption,
    description = excluded.description,
    alt_text = excluded.alt_text,
    category = excluded.category,
    album_name = excluded.album_name,
    collection_name = excluded.collection_name,
    moment_group = excluded.moment_group,
    location = excluded.location,
    location_name = excluded.location_name,
    year = excluded.year,
    month = excluded.month,
    source = excluded.source,
    author_name = excluded.author_name,
    author_username = excluded.author_username,
    photographer_name = excluded.photographer_name,
    photographer_url = excluded.photographer_url,
    created_at_unsplash = excluded.created_at_unsplash,
    updated_at_unsplash = excluded.updated_at_unsplash,
    synced_at = excluded.synced_at,
    width = excluded.width,
    height = excluded.height,
    aspect_ratio = excluded.aspect_ratio,
    color = excluded.color,
    blur_hash = excluded.blur_hash,
    tags = excluded.tags,
    is_pinned = excluded.is_pinned,
    is_featured = excluded.is_featured,
    is_favorite = excluded.is_favorite,
    is_visible = excluded.is_visible,
    search_text = excluded.search_text,
    updated_at = now();

  insert into public.sync_logs (type, status, message)
  values ('unsplash-gallery', 'success', coalesce(p_report, '{}'::jsonb)::text);
end;
$$;

revoke all on function public.sync_gallery_cache(text, jsonb, jsonb) from public, authenticated;
grant execute on function public.sync_gallery_cache(text, jsonb, jsonb) to anon;
