-- Run this once in Supabase SQL Editor to fix recursive audit logging.

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

drop trigger if exists audit_logs_audit on public.audit_logs;
