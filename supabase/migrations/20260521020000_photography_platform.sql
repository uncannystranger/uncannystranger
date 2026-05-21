create extension if not exists pgcrypto;

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  unsplash_id text not null unique,
  unsplash_url text not null,
  image_url_small text not null,
  image_url_regular text not null,
  image_url_full text,
  title text not null,
  caption text,
  description text,
  alt_text text,
  category text,
  source text not null default 'unsplash',
  location text,
  author_name text,
  author_username text,
  created_at_unsplash timestamptz,
  updated_at_unsplash timestamptz,
  width integer,
  height integer,
  color text,
  blur_hash text,
  tags text[] not null default '{}',
  is_frame boolean not null default false,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.frames (
  id uuid primary key default gen_random_uuid(),
  photo_id uuid not null unique references public.photos(id) on delete cascade,
  slug text not null unique,
  title text not null,
  subtitle text,
  story text not null,
  excerpt text,
  category text,
  read_time text,
  views_count integer not null default 0 check (views_count >= 0),
  likes_count integer not null default 0 check (likes_count >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.frame_likes (
  id uuid primary key default gen_random_uuid(),
  frame_id uuid not null references public.frames(id) on delete cascade,
  anonymous_user_id text not null,
  created_at timestamptz not null default now(),
  unique (frame_id, anonymous_user_id)
);

create table if not exists public.frame_views (
  id uuid primary key default gen_random_uuid(),
  frame_id uuid not null references public.frames(id) on delete cascade,
  session_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.sync_logs (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  status text not null,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists photos_created_at_unsplash_idx on public.photos (created_at_unsplash desc nulls last);
create index if not exists photos_visible_idx on public.photos (is_visible, created_at_unsplash desc);
create index if not exists frames_published_idx on public.frames (is_published, created_at desc);
create index if not exists frame_views_frame_session_created_idx on public.frame_views (frame_id, session_id, created_at desc);
create index if not exists frame_likes_frame_user_idx on public.frame_likes (frame_id, anonymous_user_id);
create index if not exists sync_logs_created_idx on public.sync_logs (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists photos_set_updated_at on public.photos;
create trigger photos_set_updated_at
before update on public.photos
for each row execute function public.set_updated_at();

drop trigger if exists frames_set_updated_at on public.frames;
create trigger frames_set_updated_at
before update on public.frames
for each row execute function public.set_updated_at();

create or replace function public.increment_frame_views_count()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  update public.frames
  set views_count = views_count + 1
  where id = new.frame_id;
  return new;
end;
$$;

drop trigger if exists frame_views_increment_count on public.frame_views;
create trigger frame_views_increment_count
after insert on public.frame_views
for each row execute function public.increment_frame_views_count();

create or replace function public.adjust_frame_likes_count()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    update public.frames set likes_count = likes_count + 1 where id = new.frame_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.frames set likes_count = greatest(0, likes_count - 1) where id = old.frame_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists frame_likes_increment_count on public.frame_likes;
create trigger frame_likes_increment_count
after insert on public.frame_likes
for each row execute function public.adjust_frame_likes_count();

drop trigger if exists frame_likes_decrement_count on public.frame_likes;
create trigger frame_likes_decrement_count
after delete on public.frame_likes
for each row execute function public.adjust_frame_likes_count();

alter table public.photos enable row level security;
alter table public.frames enable row level security;
alter table public.frame_likes enable row level security;
alter table public.frame_views enable row level security;
alter table public.sync_logs enable row level security;

drop policy if exists "Public can read visible photos" on public.photos;
create policy "Public can read visible photos"
on public.photos for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "Public can read published frames" on public.frames;
create policy "Public can read published frames"
on public.frames for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Public can read frame like counts" on public.frame_likes;
drop policy if exists "Public cannot read raw frame likes" on public.frame_likes;
create policy "Public cannot read raw frame likes"
on public.frame_likes for select
to anon, authenticated
using (false);

drop policy if exists "Public can add frame views" on public.frame_views;

drop policy if exists "Public cannot read raw frame views" on public.frame_views;
create policy "Public cannot read raw frame views"
on public.frame_views for select
to anon, authenticated
using (false);

drop policy if exists "No public sync log access" on public.sync_logs;
create policy "No public sync log access"
on public.sync_logs for all
to anon, authenticated
using (false)
with check (false);

grant usage on schema public to anon, authenticated;
grant select on public.photos, public.frames to anon, authenticated;
grant select, insert, update, delete on public.photos, public.frames, public.frame_likes, public.frame_views, public.sync_logs to service_role;
grant usage, select on all sequences in schema public to anon, authenticated, service_role;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'frames'
  ) then
    alter publication supabase_realtime add table public.frames;
  end if;
end;
$$;
