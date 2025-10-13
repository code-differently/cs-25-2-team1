# Habit Tracker — User Stories

---

## Epic 1: User Authentication & Profiles

**Goal:** Allow users to securely create accounts and manage their habit data.

---

### **User Story 1**

**As a user,** I want to sign up, sign in, and sign out securely so that my habits and progress are saved.

**Acceptance Criteria:**
* Validates user credentials
* Persists user sessions

---

### **User Story 2**

**As a user,** I want to edit my profile (name, avatar, email) so I can personalize my dashboard.

**Acceptance Criteria:**
* Allows updating profile fields
* Option to upload or choose an avatar
* Saves changes to user profile in the database

---

## 📅 Epic 2: Habit Management (Core Feature)

**Goal:** Let users create, view, update, and delete habits easily.

---

### **User Story 3**

**As a user,** I want to create a new habit with a name, goal frequency (e.g., daily, weekly), and category so that I can track it over time.

**Acceptance Criteria:**
* Form includes fields for habit name, frequency, and category
* Saves new habits to user’s list
* Displays confirmation on successful creation

---

### **User Story 4**

**As a user,** I want to mark a habit as completed for today so I can maintain a streak.

**Acceptance Criteria:**
* Completion updates displayed instantly in UI
* Streak counter increments correctly
* Updates persisted in backend

---

### **User Story 5**

**As a user,** I want to edit or delete habits so I can keep my list up to date.

**Acceptance Criteria:**
* Edit modal allows updating habit details
* Deleting shows a confirmation prompt
* Habit list refreshes automatically

---

## Epic 3: Progress Tracking & Streaks

**Goal:** Give users motivational feedback and visual progress.

---

### **User Story 6**

**As a user,** I want to see my streak count and completion history per habit so I can stay motivated.

**Acceptance Criteria:**
* Displays streak counter (🔥)
* Shows daily completion grid or mini calendar view
* Fetches streak data from backend

---

### **User Story 7**

**As a user,** I want to see an overview dashboard of my habit progress with charts so I can visualize consistency.

**Acceptance Criteria:**
* Dashboard uses **Recharts** or **Chart.js**
* Displays weekly or monthly completion stats
* Responsive and accessible charts

---

### **User Story 8**

**As a user,** I want to earn badges or milestones for completing streaks (e.g., “7 days in a row”) so I feel rewarded.

**Acceptance Criteria:**
* Tracks milestone achievements
* Displays badges or celebration modal
* Optional stretch: animated celebration popup

---

## Epic 4: Gamification & Engagement

**Goal:** Make the experience interactive and habit-forming.

---

### **User Story 9**

**As a user,** I want to see motivational messages or confetti animations when I hit streak milestones so it feels rewarding.

**Acceptance Criteria:**
* Trigger animations or messages upon milestones
* Uses **framer-motion** for transitions or effects
* Non-blocking and reusable animation component

---

### **User Story 10**

**As a user,** I want to have a leaderboard showing top streaks among all users so I can compete socially.

**Acceptance Criteria:**
* Displays global leaderboard (username + streak)
* Fetches and sorts data by streak count
* Optional: toggle between global and friends view

---

## Epic 5: UI/UX Polish & Accessibility

**Goal:** Make the app feel professional and easy to use.

---

### **User Story 11**

**As a user,** I want a clean dashboard with clear visual hierarchy and progress indicators so I can track habits at a glance.

**Acceptance Criteria:**
* Uses **Tailwind CSS** for consistent styling
* Includes progress bars and visual cues
* Optional: dark mode toggle

---

### **User Story 12**

**As a user,** I want the app to be responsive and accessible across devices so I can use it on my phone or laptop.

**Acceptance Criteria:**
* Fully responsive layout
* Keyboard navigable
* Meets accessibility color contrast standards

---

