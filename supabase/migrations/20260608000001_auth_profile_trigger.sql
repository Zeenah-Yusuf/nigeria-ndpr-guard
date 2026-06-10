-- Ensure profiles default to unverified
alter table public.user_profiles
  alter column is_verified set default false; [cite: 56]

-- Trigger function to handle profile and sector creation safely on the backend
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb); [cite: 58]
  v_role text := coalesce(meta->>'role', 'organization'); [cite: 59]
  v_sector_slug text := meta->>'sector_slug'; [cite: 59]
  v_sector_id uuid; [cite: 59]
begin
  -- Block public signups from claiming the admin role
  if v_role = 'admin' then v_role := 'organization'; end if; [cite: 60]

  insert into public.user_profiles (
    id, role, company_name, company_size, website_url, phone_number,
    registration_number, license_url, is_verified
  ) values (
    new.id,
    v_role,
    coalesce(meta->>'company_name', split_part(new.email,'@',1)),
    nullif(meta->>'company_size',''),
    nullif(meta->>'website_url',''),
    nullif(meta->>'phone_number',''),
    nullif(meta->>'registration_number',''),
    nullif(meta->>'license_url',''),
    false
  )
  on conflict (id) do nothing; [cite: 61]

  if v_sector_slug is not null then
    select id into v_sector_id from public.sectors where slug = v_sector_slug; [cite: 62]
    if v_sector_id is not null then
      insert into public.user_sectors (user_id, sector_id)
      values (new.id, v_sector_id)
      on conflict do nothing; [cite: 63]
    end if; [cite: 64]
  end if;

  return new;
end;
$$;

-- Attach the trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users; [cite: 64]
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user(); [cite: 65]

-- Bootstrap and promote your explicit admin account
update public.user_profiles up
   set role = 'admin', is_verified = true
  from auth.users u
 where u.id = up.id
   and u.email = 'yusufzeenah12@gmail.com'; [cite: 67]

-- Setup fundamental RLS policies so users can see/edit their data
alter table public.user_profiles enable row level security; [cite: 69]
drop policy if exists "users read own profile" on public.user_profiles; [cite: 70]
create policy "users read own profile" on public.user_profiles
  for select to authenticated using (auth.uid() = id); [cite: 71]

drop policy if exists "users update own profile" on public.user_profiles; [cite: 72]
create policy "users update own profile" on public.user_profiles
  for update to authenticated using (auth.uid() = id); [cite: 73]

grant select, update on public.user_profiles to authenticated; [cite: 74]