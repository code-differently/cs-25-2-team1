# Database Setup Instructions

## 🗄️ Setting up the Database with Row Level Security

### Step 1: Run the SQL Migration

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Copy the contents of `database/schema.sql`
5. Paste and run the SQL script

This will create:
- ✅ **users** table with RLS enabled
- ✅ **habits** table with RLS enabled & enhanced constraints
- ✅ **habit_logs** table with RLS enabled & duplicate prevention
- ✅ All necessary RLS policies
- ✅ Performance indexes (including partial indexes)
- ✅ Auto-updating timestamps
- ✅ Auto user profile creation trigger
- ✅ **habit_stats** analytics view
- ✅ **get_habit_completion_rate()** function
- ✅ Data integrity constraints

### Step 2: Verify RLS is Working

After running the migration, you can verify RLS is working by:

1. **Check Tables**: Go to Table Editor and confirm all tables exist
2. **Check RLS**: Each table should show "RLS enabled" 
3. **Check Policies**: Go to Authentication → Policies to see all policies

### Expected Tables:

#### 🧑‍💼 **users** table
- `id` (UUID, references auth.users)
- `email` (TEXT, unique)
- `full_name` (TEXT, nullable)
- `avatar_url` (TEXT, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### 📋 **habits** table  
- `id` (UUID, primary key)
- `user_id` (UUID, references users)
- `title` (TEXT, required, trimmed)
- `description` (TEXT, nullable)
- `frequency` (daily/weekly/monthly, required)
- `target_count` (INTEGER, required, > 0)
- `color` (TEXT, hex color validation)
- `is_active` (BOOLEAN, required)
- `created_at` (TIMESTAMP, required)
- `updated_at` (TIMESTAMP, required)

#### 📊 **habit_logs** table
- `id` (UUID, primary key)
- `habit_id` (UUID, references habits)
- `user_id` (UUID, references users)
- `completed_at` (TIMESTAMP, required)
- `notes` (TEXT, nullable)
- `created_at` (TIMESTAMP, required)
- **Constraint**: Prevents duplicate daily logs
- **Constraint**: Ensures habit belongs to user

#### 📈 **habit_stats** view
- `habit_id` (UUID)
- `title` (TEXT)
- `user_id` (UUID)
- `frequency` (TEXT)
- `target_count` (INTEGER)
- `color` (TEXT)
- `is_active` (BOOLEAN)
- `total_completions` (INTEGER)
- `last_completed_at` (TIMESTAMP)
- `unique_completion_days` (INTEGER)
- `last_7_days` (INTEGER)
- `last_30_days` (INTEGER)
- `today_count` (INTEGER)

### Step 3: Test the Setup

After running the migration, test that everything works:

```bash
# Start the development server
npm run dev
```

The app should now be able to connect to your Supabase database with full RLS protection!

## 🔒 Row Level Security Policies Created

### Users Table Policies:
- ✅ Users can view own profile
- ✅ Users can update own profile  
- ✅ Users can insert own profile

### Habits Table Policies:
- ✅ Users can view own habits
- ✅ Users can insert own habits
- ✅ Users can update own habits
- ✅ Users can delete own habits

### Habit Logs Table Policies:
- ✅ Users can view own habit logs
- ✅ Users can insert own habit logs
- ✅ Users can update own habit logs
- ✅ Users can delete own habit logs

## 🚀 Next Steps

After the database is set up, you can proceed to:
1. Build authentication components
2. Create API routes
3. Add validation with Zod
4. Test the endpoints

The database foundation with RLS is now complete!
