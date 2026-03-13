-- Create a table for public users
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text not null,
  avatar_url text,
  total_xp integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;

-- Create policy so any user can read public profiles
create policy "Public profiles are viewable by everyone." on public.users
  for select using (true);
create policy "Users can update their own profile." on public.users
  for update using (auth.uid() = id);

-- Function to handle new user sign ups
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, username, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for auth.users creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
