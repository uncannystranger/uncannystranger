create or replace function public.upsert_frame_for_photo()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  frame_slug text;
  frame_excerpt text;
begin
  if new.source <> 'unsplash' then
    return new;
  end if;

  frame_slug := trim(both '-' from left(
    regexp_replace(lower(coalesce(nullif(new.title, ''), 'frame')), '[^a-z0-9]+', '-', 'g'),
    54
  )) || '-' || lower(regexp_replace(new.unsplash_id, '[^a-zA-Z0-9]+', '-', 'g'));
  frame_excerpt := coalesce(nullif(new.caption, ''), nullif(new.description, ''), nullif(new.alt_text, ''), 'A quiet frame from the archive.');

  insert into public.frames (
    photo_id, slug, title, subtitle, story, excerpt, category, read_time, is_published
  )
  values (
    new.id,
    frame_slug,
    coalesce(nullif(new.title, ''), 'Untitled Frame'),
    frame_excerpt,
    public.frame_story_from_photo(new.title, new.description, new.alt_text, new.category, coalesce(new.location_name, new.location)),
    frame_excerpt,
    coalesce(nullif(new.category, ''), 'Memory'),
    '2 min read',
    true
  )
  on conflict (photo_id) do nothing;

  return new;
end;
$$;

revoke all on function public.upsert_frame_for_photo() from public, anon, authenticated;

create or replace function public.repair_frame_cache(
  p_token text,
  p_rows jsonb,
  p_report jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, extensions
as $$
declare
  persisted integer := 0;
begin
  if p_token is null or not exists (
    select 1
    from private.gallery_sync_credentials
    where token_hash = extensions.digest(p_token, 'sha256')
  ) then
    raise insufficient_privilege using message = 'Unauthorized frame sync.';
  end if;

  update public.photos as p
  set category = row.category,
      updated_at = now()
  from jsonb_to_recordset(coalesce(p_rows, '[]'::jsonb)) as row (
    unsplash_id text,
    slug text,
    title text,
    subtitle text,
    story text,
    excerpt text,
    category text,
    read_time text
  )
  where p.unsplash_id = row.unsplash_id
    and p.source = 'unsplash'
    and row.unsplash_id ~ '^[A-Za-z0-9_-]{4,80}$'
    and nullif(btrim(row.category), '') is not null
    and p.category is distinct from row.category;

  insert into public.frames (
    photo_id, slug, title, subtitle, story, excerpt, category, read_time, is_published
  )
  select
    p.id,
    left(row.slug, 180),
    left(row.title, 240),
    left(row.subtitle, 1000),
    left(row.story, 8000),
    left(row.excerpt, 1000),
    left(row.category, 80),
    left(row.read_time, 40),
    true
  from jsonb_to_recordset(coalesce(p_rows, '[]'::jsonb)) as row (
    unsplash_id text,
    slug text,
    title text,
    subtitle text,
    story text,
    excerpt text,
    category text,
    read_time text
  )
  join public.photos as p
    on p.unsplash_id = row.unsplash_id
   and p.source = 'unsplash'
  where row.unsplash_id ~ '^[A-Za-z0-9_-]{4,80}$'
    and nullif(btrim(row.slug), '') is not null
    and nullif(btrim(row.title), '') is not null
    and nullif(btrim(row.story), '') is not null
  on conflict (photo_id) do update set
    slug = excluded.slug,
    title = excluded.title,
    subtitle = excluded.subtitle,
    story = excluded.story,
    excerpt = excluded.excerpt,
    category = excluded.category,
    read_time = excluded.read_time,
    is_published = excluded.is_published,
    updated_at = now();

  get diagnostics persisted = row_count;

  insert into public.sync_logs (type, status, message)
  values ('frame-stories', 'success', coalesce(p_report, '{}'::jsonb)::text);

  return coalesce(p_report, '{}'::jsonb) || jsonb_build_object('persisted', persisted);
end;
$$;

revoke all on function public.repair_frame_cache(text, jsonb, jsonb) from public, authenticated;
grant execute on function public.repair_frame_cache(text, jsonb, jsonb) to anon;
