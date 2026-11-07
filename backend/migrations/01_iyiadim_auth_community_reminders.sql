create table public.health_records(
 user_id uuid primary key references auth.users(id) on delete cascade,
 payload jsonb not null check(jsonb_typeof(payload)='object' and octet_length(payload::text)<2000000),
 revision bigint not null default 1,updated_at timestamptz not null default now()
);
alter table public.health_records enable row level security;
create policy health_self_read on public.health_records for select to authenticated using ((select auth.uid())=user_id);
create policy health_self_insert on public.health_records for insert to authenticated with check ((select auth.uid())=user_id);
create policy health_self_update on public.health_records for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy health_self_delete on public.health_records for delete to authenticated using ((select auth.uid())=user_id);
grant select,insert,update,delete on public.health_records to authenticated;
create function public.save_health_record(p_payload jsonb,p_expected bigint) returns setof public.health_records language plpgsql security invoker set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Authentication required' using errcode='28000'; end if;
 if p_expected=0 then
  return query insert into public.health_records(user_id,payload,revision) values(auth.uid(),p_payload,1) returning *;
 else
  return query update public.health_records set payload=p_payload,revision=revision+1,updated_at=now() where user_id=auth.uid() and revision=p_expected returning *;
  if not found then raise exception 'Newer cloud record exists' using errcode='40001'; end if;
 end if;
end $$;
revoke all on function public.save_health_record(jsonb,bigint) from public,anon;
grant execute on function public.save_health_record(jsonb,bigint) to authenticated;
create table public.community_posts(
 id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,
 group_slug text not null check(group_slug in('general','joints','balance','caregivers')),
 alias text not null check(char_length(alias) between 2 and 40),body text not null check(char_length(body) between 1 and 1500),
 created_at timestamptz not null default now(),status text not null default 'published' check(status in('published','hidden'))
);
create index community_group_date on public.community_posts(group_slug,created_at desc);
create index community_user on public.community_posts(user_id);
create table public.user_blocks(blocker_id uuid not null references auth.users(id) on delete cascade,blocked_id uuid not null references auth.users(id) on delete cascade,primary key(blocker_id,blocked_id),check(blocker_id<>blocked_id));
alter table public.user_blocks enable row level security;
create policy blocks_self on public.user_blocks for all to authenticated using ((select auth.uid())=blocker_id) with check ((select auth.uid())=blocker_id);
grant select,insert,delete on public.user_blocks to authenticated;
alter table public.community_posts enable row level security;
create policy posts_read on public.community_posts for select to authenticated using ((status='published' or user_id=(select auth.uid())) and not exists(select 1 from public.user_blocks b where b.blocker_id=(select auth.uid()) and b.blocked_id=community_posts.user_id));
create policy posts_insert on public.community_posts for insert to authenticated with check(user_id=(select auth.uid()) and status='published');
create policy posts_delete on public.community_posts for delete to authenticated using(user_id=(select auth.uid()));
grant select,delete on public.community_posts to authenticated;
grant insert(user_id,group_slug,alias,body) on public.community_posts to authenticated;
create table public.reports(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,post_id uuid not null references public.community_posts(id) on delete cascade,reason text not null check(char_length(reason) between 3 and 500),created_at timestamptz not null default now(),unique(user_id,post_id));
alter table public.reports enable row level security;
create policy reports_self on public.reports for select to authenticated using(user_id=(select auth.uid()));
create policy reports_create on public.reports for insert to authenticated with check(user_id=(select auth.uid()));
grant select on public.reports to authenticated;
grant insert(user_id,post_id,reason) on public.reports to authenticated;
create table public.push_subscriptions(user_id uuid not null references auth.users(id) on delete cascade,endpoint text primary key check(endpoint ~ '^https://(fcm.googleapis.com|updates.push.services.mozilla.com|web.push.apple.com|[A-Za-z0-9.-]+\.notify.windows.com)/'),p256dh text not null,auth text not null,created_at timestamptz default now());
create index push_user on public.push_subscriptions(user_id);
alter table public.push_subscriptions enable row level security;
create policy push_self on public.push_subscriptions for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
grant select,insert,update,delete on public.push_subscriptions to authenticated;
create table public.reminder_schedules(user_id uuid not null references auth.users(id) on delete cascade,med_id text not null check(char_length(med_id)<80),hour int not null check(hour between 0 and 23),minute int not null check(minute between 0 and 59),time_zone text not null check(char_length(time_zone)<100),enabled boolean not null default true,primary key(user_id,med_id));
alter table public.reminder_schedules enable row level security;
create policy schedules_self on public.reminder_schedules for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
grant select,insert,update,delete on public.reminder_schedules to authenticated;
create table public.reminder_deliveries(user_id uuid not null references auth.users(id) on delete cascade,med_id text not null,local_day date not null,primary key(user_id,med_id,local_day));
alter table public.reminder_deliveries enable row level security;
create table public.server_config(id text primary key,secret text not null,public_key text not null,private_key text not null);
alter table public.server_config enable row level security;
revoke all on public.server_config,public.reminder_deliveries from anon,authenticated;
grant all on public.server_config,public.reminder_deliveries to service_role;
create table public.assistant_usage(user_id uuid not null references auth.users(id) on delete cascade,bucket timestamptz not null,requests int not null default 1,primary key(user_id,bucket));
alter table public.assistant_usage enable row level security;
revoke all on public.assistant_usage from anon,authenticated;
grant all on public.assistant_usage to service_role;

