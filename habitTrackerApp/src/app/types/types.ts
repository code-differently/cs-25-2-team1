export interface Users {
    id: string
    name: string
    email: string
    avatar_url?: string
}

export interface Habits {
    id: string
    user_id: string
    title: string
    frequency: string
    created_at: string
}

export interface HabitProgress {
    id: string
    user_id: string
    habit_id: string
    date: string
    completed: boolean
    created_at: string
}