create extension if not exists "pgcrypto";

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'superadmin')),
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text,
  title text,
  category text not null default 'both',
  description text,
  features text[] not null default '{}',
  price numeric(10, 2) not null default 0,
  duration_minutes integer not null default 0,
  duration_label text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  updated_by uuid,
  constraint services_category_check check (category in ('car', 'bike', 'both'))
);

alter table public.services add column if not exists name text;
alter table public.services add column if not exists title text;
alter table public.services add column if not exists category text;
alter table public.services add column if not exists description text;
alter table public.services add column if not exists features text[] not null default '{}';
alter table public.services add column if not exists price numeric(10, 2) not null default 0;
alter table public.services add column if not exists duration_minutes integer not null default 0;
alter table public.services add column if not exists duration_label text;
alter table public.services add column if not exists is_active boolean not null default true;
alter table public.services add column if not exists sort_order integer not null default 0;
alter table public.services add column if not exists updated_at timestamptz not null default now();
alter table public.services add column if not exists created_by uuid default auth.uid();
alter table public.services add column if not exists updated_by uuid;

alter table public.services alter column category set default 'both';
update public.services set category = 'both' where category is null;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'services_category_check'
      and conrelid = 'public.services'::regclass
  ) then
    alter table public.services drop constraint services_category_check;
  end if;
end $$;

alter table public.services
  add constraint services_category_check
  check (category in ('car', 'bike', 'both'));

create table if not exists public.service_prices (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services (id) on delete cascade,
  size_key text not null check (
    size_key in (
      'small',
      'medium',
      'large',
      'extraLarge',
      'motorcycleStandard',
      'motorcycleMoge',
      'motorcycleExtraLarge'
    )
  ),
  amount numeric(10, 2) not null check (amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  updated_by uuid,
  unique (service_id, size_key)
);

create table if not exists public.queues (
  id uuid primary key default gen_random_uuid(),
  queue_number text not null,
  customer_name text not null,
  phone_number text,
  vehicle_type text not null check (vehicle_type in ('car', 'motorcycle')),
  vehicle_size text check (
    vehicle_size in (
      'small',
      'medium',
      'large',
      'extraLarge',
      'motorcycleStandard',
      'motorcycleMoge',
      'motorcycleExtraLarge'
    )
  ),
  vehicle_model_query text,
  vehicle_plate text not null,
  service_id uuid references public.services (id) on delete restrict,
  service_name text,
  price numeric(10, 2) not null default 0,
  status text not null default 'waiting' check (status in ('waiting', 'in-progress', 'completed', 'cancelled')),
  notes text,
  queued_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  updated_by uuid
);

alter table public.queues add column if not exists queue_number text;
alter table public.queues add column if not exists phone_number text;
alter table public.queues add column if not exists vehicle_type text;
alter table public.queues add column if not exists vehicle_size text;
alter table public.queues add column if not exists vehicle_model_query text;
alter table public.queues add column if not exists service_name text;
alter table public.queues add column if not exists price numeric(10, 2) not null default 0;
alter table public.queues add column if not exists notes text;
alter table public.queues add column if not exists completed_at timestamptz;
alter table public.queues add column if not exists created_at timestamptz not null default now();
alter table public.queues add column if not exists updated_at timestamptz not null default now();
alter table public.queues add column if not exists created_by uuid default auth.uid();
alter table public.queues add column if not exists updated_by uuid;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'queues_status_check'
      and conrelid = 'public.queues'::regclass
  ) then
    alter table public.queues drop constraint queues_status_check;
  end if;
end $$;

update public.queues
set status = case
  when status = 'in_progress' then 'in-progress'
  when status = 'done' then 'completed'
  when status = 'canceled' then 'cancelled'
  else status
end
where status in ('in_progress', 'done', 'canceled');

alter table public.queues
  add constraint queues_status_check
  check (status in ('waiting', 'in-progress', 'completed', 'cancelled'));

create index if not exists idx_queues_status on public.queues (status);
create index if not exists idx_queues_queued_at on public.queues (queued_at desc);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income', 'expense')),
  category text not null,
  amount numeric(10, 2) not null check (amount >= 0),
  description text not null,
  transaction_at timestamptz not null default now(),
  queue_id uuid references public.queues (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  updated_by uuid
);

create index if not exists idx_transactions_type on public.transactions (type);
create index if not exists idx_transactions_transaction_at on public.transactions (transaction_at desc);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  rating integer not null check (rating between 1 and 5),
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  updated_by uuid
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  image_path text,
  category text not null default 'Service',
  alt_text text,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  updated_by uuid
);

alter table public.gallery_images add column if not exists image_path text;
alter table public.gallery_images add column if not exists category text not null default 'Service';
alter table public.gallery_images add column if not exists sort_order integer not null default 0;
alter table public.gallery_images add column if not exists updated_by uuid;

create table if not exists public.gallery_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_image_tags (
  id uuid primary key default gen_random_uuid(),
  image_id uuid not null references public.gallery_images (id) on delete cascade,
  tag_id uuid not null references public.gallery_tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (image_id, tag_id)
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  description text not null,
  photo_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  updated_by uuid
);

create table if not exists public.contact_info (
  id boolean primary key default true check (id = true),
  address text not null,
  phone1 text not null,
  phone2 text,
  email1 text not null,
  email2 text,
  hours text not null,
  facebook text,
  instagram text,
  social_media jsonb default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid
);

insert into public.contact_info (
  id,
  address,
  phone1,
  phone2,
  email1,
  email2,
  hours,
  facebook,
  instagram
)
values (
  true,
  '',
  '',
  null,
  '',
  null,
  '',
  null,
  null
)
on conflict (id) do nothing;

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null check (action in ('create', 'update', 'delete')),
  table_name text not null,
  record_id uuid,
  changes jsonb,
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update set public = excluded.public;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.sync_service_fields()
returns trigger
language plpgsql
as $$
begin
  if coalesce(trim(new.title), '') = '' then
    new.title = coalesce(new.name, '');
  end if;

  if coalesce(trim(new.name), '') = '' then
    new.name = coalesce(new.title, '');
  end if;

  if new.duration_label is null and coalesce(new.duration_minutes, 0) > 0 then
    new.duration_label = new.duration_minutes::text || ' minutes';
  end if;

  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role in ('admin', 'superadmin')
  );
$$;

create or replace function public.is_superadmin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = 'superadmin'
  );
$$;

create or replace function public.audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  record_uuid uuid;
begin
  if tg_table_name = 'audit_logs' then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  if tg_op in ('INSERT', 'UPDATE') then
    if (to_jsonb(new) ->> 'id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
      record_uuid = (to_jsonb(new) ->> 'id')::uuid;
    else
      record_uuid = null;
    end if;
  elsif tg_op = 'DELETE' then
    if (to_jsonb(old) ->> 'id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
      record_uuid = (to_jsonb(old) ->> 'id')::uuid;
    else
      record_uuid = null;
    end if;
  end if;

  if tg_op = 'INSERT' then
    insert into public.audit_logs (actor_id, action, table_name, record_id, changes)
    values (auth.uid(), 'create', tg_table_name, record_uuid, to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    insert into public.audit_logs (actor_id, action, table_name, record_id, changes)
    values (
      auth.uid(),
      'update',
      tg_table_name,
      record_uuid,
      jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new))
    );
    return new;
  elsif tg_op = 'DELETE' then
    insert into public.audit_logs (actor_id, action, table_name, record_id, changes)
    values (auth.uid(), 'delete', tg_table_name, record_uuid, to_jsonb(old));
    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists services_sync_fields on public.services;
drop trigger if exists services_set_updated_at on public.services;
drop trigger if exists service_prices_set_updated_at on public.service_prices;
drop trigger if exists queues_set_updated_at on public.queues;
drop trigger if exists transactions_set_updated_at on public.transactions;
drop trigger if exists testimonials_set_updated_at on public.testimonials;
drop trigger if exists gallery_set_updated_at on public.gallery_images;
drop trigger if exists team_members_set_updated_at on public.team_members;
drop trigger if exists contact_info_set_updated_at on public.contact_info;
drop trigger if exists audit_logs_audit on public.audit_logs;

drop trigger if exists services_audit on public.services;
drop trigger if exists service_prices_audit on public.service_prices;
drop trigger if exists queues_audit on public.queues;
drop trigger if exists transactions_audit on public.transactions;
drop trigger if exists testimonials_audit on public.testimonials;
drop trigger if exists gallery_audit on public.gallery_images;
drop trigger if exists gallery_image_tags_audit on public.gallery_image_tags;
drop trigger if exists team_members_audit on public.team_members;
drop trigger if exists contact_info_audit on public.contact_info;

create trigger services_sync_fields
before insert or update on public.services
for each row execute function public.sync_service_fields();

create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create trigger service_prices_set_updated_at
before update on public.service_prices
for each row execute function public.set_updated_at();

create trigger queues_set_updated_at
before update on public.queues
for each row execute function public.set_updated_at();

create trigger transactions_set_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();

create trigger testimonials_set_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

create trigger gallery_set_updated_at
before update on public.gallery_images
for each row execute function public.set_updated_at();

create trigger team_members_set_updated_at
before update on public.team_members
for each row execute function public.set_updated_at();

create trigger contact_info_set_updated_at
before update on public.contact_info
for each row execute function public.set_updated_at();

create trigger services_audit
after insert or update or delete on public.services
for each row execute function public.audit_log();

create trigger service_prices_audit
after insert or update or delete on public.service_prices
for each row execute function public.audit_log();

create trigger queues_audit
after insert or update or delete on public.queues
for each row execute function public.audit_log();

create trigger transactions_audit
after insert or update or delete on public.transactions
for each row execute function public.audit_log();

create trigger testimonials_audit
after insert or update or delete on public.testimonials
for each row execute function public.audit_log();

create trigger gallery_audit
after insert or update or delete on public.gallery_images
for each row execute function public.audit_log();

create trigger gallery_image_tags_audit
after insert or update or delete on public.gallery_image_tags
for each row execute function public.audit_log();

create trigger team_members_audit
after insert or update or delete on public.team_members
for each row execute function public.audit_log();

create trigger contact_info_audit
after insert or update or delete on public.contact_info
for each row execute function public.audit_log();

alter table public.user_roles enable row level security;
alter table public.services enable row level security;
alter table public.service_prices enable row level security;
alter table public.queues enable row level security;
alter table public.transactions enable row level security;
alter table public.testimonials enable row level security;
alter table public.gallery_images enable row level security;
alter table public.gallery_tags enable row level security;
alter table public.gallery_image_tags enable row level security;
alter table public.team_members enable row level security;
alter table public.contact_info enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "Roles select own or superadmin" on public.user_roles;
drop policy if exists "Roles manage by superadmin" on public.user_roles;
drop policy if exists "Roles update by superadmin" on public.user_roles;
drop policy if exists "Roles delete by superadmin" on public.user_roles;

drop policy if exists "Services select public" on public.services;
drop policy if exists "Services manage by admin" on public.services;
drop policy if exists "Services update by admin" on public.services;
drop policy if exists "Services delete by admin" on public.services;

drop policy if exists "Service prices select public" on public.service_prices;
drop policy if exists "Service prices manage by admin" on public.service_prices;

drop policy if exists "Queues manage by admin" on public.queues;
drop policy if exists "Transactions manage by admin" on public.transactions;
drop policy if exists "Queues select authenticated" on public.queues;
drop policy if exists "Transactions select authenticated" on public.transactions;
drop policy if exists "Queues insert by admin" on public.queues;
drop policy if exists "Queues update by admin" on public.queues;
drop policy if exists "Queues delete by admin" on public.queues;
drop policy if exists "Transactions insert by admin" on public.transactions;
drop policy if exists "Transactions update by admin" on public.transactions;
drop policy if exists "Transactions delete by admin" on public.transactions;

drop policy if exists "Testimonials select" on public.testimonials;
drop policy if exists "Testimonials manage by admin" on public.testimonials;

drop policy if exists "Gallery select" on public.gallery_images;
drop policy if exists "Gallery manage by admin" on public.gallery_images;
drop policy if exists "Gallery tags select" on public.gallery_tags;
drop policy if exists "Gallery tags manage by admin" on public.gallery_tags;
drop policy if exists "Gallery image tags select" on public.gallery_image_tags;
drop policy if exists "Gallery image tags manage by admin" on public.gallery_image_tags;

drop policy if exists "Team members select" on public.team_members;
drop policy if exists "Team members manage by admin" on public.team_members;

drop policy if exists "Contact info select" on public.contact_info;
drop policy if exists "Contact info manage by admin" on public.contact_info;

drop policy if exists "Audit log insert by admin" on public.audit_logs;
drop policy if exists "Audit log select by superadmin" on public.audit_logs;

drop policy if exists "Gallery files are public" on storage.objects;
drop policy if exists "Gallery files managed by admin" on storage.objects;
drop policy if exists "Gallery files update by admin" on storage.objects;
drop policy if exists "Gallery files delete by admin" on storage.objects;

create policy "Roles select own or superadmin"
  on public.user_roles
  for select
  using (auth.uid() = user_id or public.is_superadmin());

create policy "Roles manage by superadmin"
  on public.user_roles
  for insert
  with check (public.is_superadmin());

create policy "Roles update by superadmin"
  on public.user_roles
  for update
  using (public.is_superadmin())
  with check (public.is_superadmin());

create policy "Roles delete by superadmin"
  on public.user_roles
  for delete
  using (public.is_superadmin());

create policy "Services select public"
  on public.services
  for select
  using (is_active = true or public.is_admin());

create policy "Services manage by admin"
  on public.services
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Service prices select public"
  on public.service_prices
  for select
  using (
    public.is_admin()
    or exists (
      select 1
      from public.services s
      where s.id = service_id
        and s.is_active = true
    )
  );

create policy "Service prices manage by admin"
  on public.service_prices
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Queues select authenticated"
  on public.queues
  for select
  using (auth.role() = 'authenticated');

create policy "Queues insert by admin"
  on public.queues
  for insert
  with check (public.is_admin());

create policy "Queues update by admin"
  on public.queues
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Queues delete by admin"
  on public.queues
  for delete
  using (public.is_admin());

create policy "Transactions select authenticated"
  on public.transactions
  for select
  using (auth.role() = 'authenticated');

create policy "Transactions insert by admin"
  on public.transactions
  for insert
  with check (public.is_admin());

create policy "Transactions update by admin"
  on public.transactions
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Transactions delete by admin"
  on public.transactions
  for delete
  using (public.is_admin());

create policy "Testimonials select"
  on public.testimonials
  for select
  using (is_visible = true or public.is_admin());

create policy "Testimonials manage by admin"
  on public.testimonials
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Gallery select"
  on public.gallery_images
  for select
  using (is_visible = true or public.is_admin());

create policy "Gallery manage by admin"
  on public.gallery_images
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Gallery tags select"
  on public.gallery_tags
  for select
  using (true);

create policy "Gallery tags manage by admin"
  on public.gallery_tags
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Gallery image tags select"
  on public.gallery_image_tags
  for select
  using (true);

create policy "Gallery image tags manage by admin"
  on public.gallery_image_tags
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Team members select"
  on public.team_members
  for select
  using (is_active = true or public.is_admin());

create policy "Team members manage by admin"
  on public.team_members
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Contact info select"
  on public.contact_info
  for select
  using (true);

create policy "Contact info manage by admin"
  on public.contact_info
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Audit log insert by admin"
  on public.audit_logs
  for insert
  with check (public.is_admin());

create policy "Audit log select by superadmin"
  on public.audit_logs
  for select
  using (public.is_superadmin());

create policy "Gallery files are public"
  on storage.objects
  for select
  using (bucket_id = 'gallery');

create policy "Gallery files managed by admin"
  on storage.objects
  for insert
  with check (bucket_id = 'gallery' and public.is_admin());

create policy "Gallery files update by admin"
  on storage.objects
  for update
  using (bucket_id = 'gallery' and public.is_admin())
  with check (bucket_id = 'gallery' and public.is_admin());

create policy "Gallery files delete by admin"
  on storage.objects
  for delete
  using (bucket_id = 'gallery' and public.is_admin());
