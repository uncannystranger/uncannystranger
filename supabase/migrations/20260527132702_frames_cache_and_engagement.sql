create or replace function public.frame_story_from_photo(
  p_title text,
  p_description text,
  p_alt_text text,
  p_category text,
  p_location text
)
returns text
language sql
immutable
set search_path = public, pg_temp
as $$
  select concat_ws(
    ' ',
    coalesce(nullif(p_description, ''), nullif(p_alt_text, ''), nullif(p_title, ''), 'A quiet image from the archive.'),
    case
      when lower(coalesce(p_category, '')) = 'mogadishu' then 'The city lingers in the frame through light, distance, and memory.'
      when lower(coalesce(p_category, '')) in ('street', 'urban life', 'documentary') then 'A passing public moment becomes an intimate record of movement and pause.'
      when lower(coalesce(p_category, '')) in ('nature', 'travel') then 'Air, horizon, and stillness give the image its patient rhythm.'
      when lower(coalesce(p_category, '')) = 'black & white' then 'Without colour, gesture and shadow carry the weight of the scene.'
      else 'The photograph holds its silence long enough for a story to surface.'
    end,
    case when nullif(p_location, '') is not null then 'Seen in ' || p_location || '.' else null end
  );
$$;

create or replace function public.set_unsplash_photo_as_frame()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.source = 'unsplash' then
    new.is_frame = true;
  end if;
  return new;
end;
$$;

drop trigger if exists photos_set_unsplash_frame on public.photos;
create trigger photos_set_unsplash_frame
before insert or update on public.photos
for each row execute function public.set_unsplash_photo_as_frame();
revoke all on function public.set_unsplash_photo_as_frame() from public, anon, authenticated;

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
    coalesce(nullif(new.category, ''), 'Uncategorized'),
    '2 min read',
    true
  )
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

  return new;
end;
$$;

drop trigger if exists photos_upsert_frame_story on public.photos;
create trigger photos_upsert_frame_story
after insert or update on public.photos
for each row execute function public.upsert_frame_for_photo();
revoke all on function public.upsert_frame_for_photo() from public, anon, authenticated;

update public.photos
set is_frame = true
where source = 'unsplash';

create or replace function public.frame_engagement_summary(p_unsplash_id text, p_session_id text)
returns table (views integer, likes integer, liked boolean)
language sql
security definer
set search_path = public, pg_temp
as $$
  select f.views_count, f.likes_count, exists (
    select 1 from public.frame_likes l
    where l.frame_id = f.id and l.anonymous_user_id = p_session_id
  )
  from public.frames f
  join public.photos p on p.id = f.photo_id
  where p.unsplash_id = p_unsplash_id
    and p_unsplash_id ~ '^[A-Za-z0-9_-]{4,80}$'
    and length(p_session_id) between 8 and 128
    and f.is_published = true
  limit 1;
$$;

create or replace function public.frame_record_view(p_unsplash_id text, p_session_id text)
returns table (views integer, likes integer, liked boolean)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target_id uuid;
begin
  if p_unsplash_id !~ '^[A-Za-z0-9_-]{4,80}$' or length(p_session_id) not between 8 and 128 then
    return;
  end if;
  select f.id into target_id
  from public.frames f
  join public.photos p on p.id = f.photo_id
  where p.unsplash_id = p_unsplash_id and f.is_published = true
  limit 1;
  if target_id is null then return; end if;

  if not exists (
    select 1 from public.frame_views v
    where v.frame_id = target_id
      and v.session_id = p_session_id
      and v.created_at >= now() - interval '12 hours'
  ) then
    insert into public.frame_views (frame_id, session_id) values (target_id, p_session_id);
  end if;

  return query select * from public.frame_engagement_summary(p_unsplash_id, p_session_id);
end;
$$;

create or replace function public.frame_toggle_like(p_unsplash_id text, p_session_id text)
returns table (views integer, likes integer, liked boolean)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target_id uuid;
begin
  if p_unsplash_id !~ '^[A-Za-z0-9_-]{4,80}$' or length(p_session_id) not between 8 and 128 then
    return;
  end if;
  select f.id into target_id
  from public.frames f
  join public.photos p on p.id = f.photo_id
  where p.unsplash_id = p_unsplash_id and f.is_published = true
  limit 1;
  if target_id is null then return; end if;

  if exists (
    select 1 from public.frame_likes l
    where l.frame_id = target_id and l.anonymous_user_id = p_session_id
  ) then
    delete from public.frame_likes where frame_id = target_id and anonymous_user_id = p_session_id;
  else
    insert into public.frame_likes (frame_id, anonymous_user_id) values (target_id, p_session_id);
  end if;

  return query select * from public.frame_engagement_summary(p_unsplash_id, p_session_id);
end;
$$;

revoke all on function public.frame_engagement_summary(text, text) from public, authenticated;
revoke all on function public.frame_record_view(text, text) from public, authenticated;
revoke all on function public.frame_toggle_like(text, text) from public, authenticated;
grant execute on function public.frame_engagement_summary(text, text) to anon;
grant execute on function public.frame_record_view(text, text) to anon;
grant execute on function public.frame_toggle_like(text, text) to anon;
