-- Hotfix: shared read access for dashboard data.
-- This makes queue/financial/report data visible to all authenticated users,
-- while keeping writes restricted to admin/superadmin.

alter table public.queues enable row level security;
alter table public.transactions enable row level security;

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
