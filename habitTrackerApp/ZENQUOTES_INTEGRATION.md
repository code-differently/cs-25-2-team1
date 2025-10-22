# ZenQuotes API Integration Guide

## 🎯 Overview

The ZenQuotes API has been successfully integrated into your Habit Tracker app to provide motivational quotes that enhance user engagement and motivation.

## 📡 API Endpoints

### GET Requests

#### Random Quote
```bash
GET /api/integrations/quotes?type=random
```

#### Daily Quote
```bash
GET /api/integrations/quotes?type=daily
```

#### Multiple Quotes
```bash
GET /api/integrations/quotes?type=multiple&count=3
```

#### Habit-Specific Motivation
```bash
GET /api/integrations/quotes?type=habit-motivation&habit_name=Exercise
```

### POST Requests

#### Personalized Quote
```bash
POST /api/integrations/quotes
Content-Type: application/json

{
  "action": "get_personalized_quote",
  "habit_name": "Morning Run"
}
```

#### Streak Celebration Quote
```bash
POST /api/integrations/quotes
Content-Type: application/json

{
  "action": "get_streak_celebration"
}
```

## 🔧 Frontend Integration

### Using the React Hook

```typescript
import { useMotivationalQuotes } from '@/hooks/useMotivationalQuotes';

function MyComponent() {
  const { quote, loading, error, fetchQuote } = useMotivationalQuotes({
    type: 'daily',
    autoFetch: true
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <blockquote>"{quote?.quote}"</blockquote>
      <cite>— {quote?.author}</cite>
      <button onClick={fetchQuote}>New Quote</button>
    </div>
  );
}
```

### Using the Quote Component

```typescript
import { QuoteComponent } from '@/app/components/quote-component';

function Dashboard() {
  return (
    <div>
      {/* Daily inspiration */}
      <QuoteComponent type="daily" autoFetch={true} />
      
      {/* Habit-specific motivation */}
      <QuoteComponent 
        type="habit-motivation" 
        habitName="Exercise"
        autoFetch={true} 
      />
    </div>
  );
}
```

## 💡 Integration Ideas

### 1. Dashboard Welcome
Add daily quotes to the welcome section for daily inspiration.

### 2. Habit Completion Celebration
Show motivational quotes when users complete habits or reach milestones.

### 3. Streak Motivation
Display encouraging quotes when users are on long streaks.

### 4. Habit Creation
Provide relevant quotes when users create new habits to motivate them.

### 5. Low Activity Encouragement
Show motivational quotes to users who haven't been active recently.

## 📊 Response Format

```typescript
{
  "success": true,
  "data": {
    "quote": "The only way to do great work is to love what you do.",
    "author": "Steve Jobs",
    "category": "inspirational",
    "timestamp": "2025-10-21T10:30:00.000Z",
    "source": "zenquotes"
  },
  "message": "Quote fetched successfully from ZenQuotes"
}
```

## 🛡️ Error Handling

The integration includes:
- **Fallback quotes** if the API is unavailable
- **Error boundaries** for graceful degradation
- **Retry mechanisms** for failed requests
- **Caching** to reduce API calls (5-minute cache)

## 🎨 Styling

The QuoteComponent comes with:
- **Responsive design** that works on all screen sizes
- **Gradient backgrounds** for visual appeal
- **Loading states** with smooth transitions
- **Error states** with retry options
- **Customizable styling** via className prop

## 🚀 Usage Examples in Your App

### In Dashboard
```typescript
// Add to src/app/page.tsx
import { QuoteComponent } from './components/quote-component';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Welcome onAddHabit={() => setIsModalOpen(true)} />
      
      {/* NEW: Add daily inspiration */}
      <div className="mt-6">
        <QuoteComponent type="daily" autoFetch={true} />
      </div>
      
      {/* Rest of your existing components */}
      <WeeklyStreak />
      <ProgressTracker progress={progressPercentage} />
    </div>
  );
}
```

### In Habit Modal
```typescript
// Add to habit creation success
const handleHabitCreated = () => {
  // Show success message with motivational quote
  fetchHabitMotivation(newHabitName);
  onClose();
};
```

### In Progress Tracker
```typescript
// Show quotes when milestones are reached
if (progress === 100) {
  return (
    <div>
      <div>🎉 All habits completed!</div>
      <QuoteComponent type="random" autoFetch={true} />
    </div>
  );
}
```

## 🔄 Rate Limiting & Best Practices

- **Caching**: Responses are cached for 5 minutes
- **Fallbacks**: Offline quotes available if API fails
- **Respectful usage**: Built-in delays between multiple requests
- **Error handling**: Graceful degradation with user-friendly messages

## 🎉 Benefits

1. **User Engagement**: Motivational content keeps users inspired
2. **No API Key Required**: ZenQuotes is completely free
3. **Reliable**: Built-in fallbacks ensure quotes always display
4. **Customizable**: Easy to integrate anywhere in your app
5. **Type Safe**: Full TypeScript support with proper error handling

The ZenQuotes integration is now ready to inspire your habit tracker users! 🌟