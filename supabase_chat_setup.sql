-- 1. Create the messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sender_type TEXT CHECK (sender_type IN ('user', 'ai')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Turn on Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 3. Policy: User can only read their OWN messages
CREATE POLICY "Users can view their own messages" 
ON messages FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Policy: User can only insert messages belonging to them
CREATE POLICY "Users can insert their own messages" 
ON messages FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 5. Explicitly enable Realtime for the messages table
-- This tells Supabase to stream INSERT/UPDATE/DELETE events for this table
alter publication supabase_realtime add table messages;
