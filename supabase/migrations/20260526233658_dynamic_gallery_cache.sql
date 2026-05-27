alter table public.photos
  add column if not exists image_url_raw text,
  add column if not exists image_url_thumb text,
  add column if not exists album_name text,
  add column if not exists collection_name text,
  add column if not exists moment_group text,
  add column if not exists location_name text,
  add column if not exists year integer,
  add column if not exists month integer,
  add column if not exists aspect_ratio numeric(12, 6),
  add column if not exists photographer_name text,
  add column if not exists photographer_url text,
  add column if not exists is_pinned boolean not null default false,
  add column if not exists is_favorite boolean not null default false,
  add column if not exists synced_at timestamptz,
  add column if not exists search_text text;

update public.photos
set
  image_url_raw = coalesce(image_url_raw, image_url_full, image_url_regular),
  image_url_thumb = coalesce(image_url_thumb, image_url_small),
  location_name = coalesce(location_name, location),
  photographer_name = coalesce(photographer_name, author_name),
  year = coalesce(year, extract(year from created_at_unsplash)::integer),
  month = coalesce(month, extract(month from created_at_unsplash)::integer),
  aspect_ratio = case
    when aspect_ratio is not null then aspect_ratio
    when width > 0 and height > 0 then round(width::numeric / height::numeric, 6)
    else null
  end,
  synced_at = coalesce(synced_at, updated_at),
  search_text = coalesce(
    search_text,
    concat_ws(' ', title, description, alt_text, category, location, author_name, array_to_string(tags, ' '))
  )
where source = 'unsplash';

create index if not exists photos_visible_latest_idx
  on public.photos (created_at_unsplash desc nulls last)
  where is_visible = true and source = 'unsplash';
create index if not exists photos_pinned_latest_idx
  on public.photos (is_pinned desc, created_at_unsplash desc nulls last)
  where is_visible = true and source = 'unsplash';
create index if not exists photos_featured_latest_idx
  on public.photos (is_featured desc, created_at_unsplash desc nulls last)
  where is_visible = true and source = 'unsplash';
create index if not exists photos_category_idx on public.photos (category);
create index if not exists photos_album_idx on public.photos (album_name);
create index if not exists photos_collection_idx on public.photos (collection_name);
create index if not exists photos_moment_idx on public.photos (moment_group);
create index if not exists photos_year_month_idx
  on public.photos (year desc, month desc, created_at_unsplash desc nulls last);

alter table public.photos enable row level security;
revoke all privileges on table public.photos from anon, authenticated;
grant select on table public.photos to anon, authenticated;
grant select, insert, update, delete on table public.photos to service_role;
