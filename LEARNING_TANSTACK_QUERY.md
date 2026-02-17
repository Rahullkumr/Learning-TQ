# 🎓 Learning TanStack Query (React Query)

TanStack Query (formerly React Query) is often described as the missing data-fetching library for React. But more accurately, it is an **Async State Manager**.

## 1. The Core Problem: Client State vs. Server State

React's built-in `useState` and `useReducer` are great for **Client State** (e.g., is the modal open? what is the input value?).

However, they are not designed for **Server State** (e.g., data fetched from an API), which has unique challenges:
*   **Caching**: Storing data so you don't have to re-fetch it immediately.
*   **Deduping**: If two components ask for the same data, only send one request.
*   **Background Updates**: Keeping data fresh ("out of date" data is "stale").
*   **Pagination/Infinite Scroll**: Managing complex loading states.

TanStack Query solves all of this automatically.

---

## 2. Key Concepts

### 🧠 The Query Client
The `QueryClient` is the brain. It holds the **Cache**. You create it once (usually in `main.jsx`) and provide it to your entire app.

### 🔑 Query Keys
Everything in TanStack Query relies on **Query Keys**.
A Query Key is an array that uniquely identifies your data. it acts like the dependency array of `useEffect`.

-   `['user']` -> Generic user list
-   `['user', 1]` -> Specific user with ID 1
-   `['todos', { status: 'done' }]` -> Todos filtered by status

**If the key changes, TanStack Query will automatically re-fetch the data.**

### 📥 useQuery (Reading Data)
Used for **GET** requests.
It requires:
1.  **`queryKey`**: To identify the data.
2.  **`queryFn`**: A function that returns a Promise (e.g., `axios.get(...)`).

```javascript
const { data, isLoading, isError, error } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
});
```

### 📤 useMutation (Writing Data)
Used for **POST, PUT, DELETE** requests.
Unlike queries, mutations don't run automatically. You trigger them.

```javascript
const mutation = useMutation({
  mutationFn: newTodo => axios.post('/todos', newTodo),
  onSuccess: () => {
    // 💡 Invalidating the query triggers a re-fetch of the list!
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

---

## 3. Important Methodologies: StaleTime vs. GcTime

This is often the most confusing part for beginners.

**1. `staleTime` (Default: 0)**
*   **Question**: "How long is this data considered 'fresh'?"
*   **Behavior**:
    *   If data is **fresh**, the cached version is returned immediately, and **no API request is made**.
    *   If data is **stale** (which it is by default immediately), the cached version is returned, **BUT** a background refetch is triggered to update it.
*   **Use Case**: Set `staleTime: 5000` (5 seconds) if you know your data doesn't change often.

**2. `gcTime` (Garbage Collection Time) (Default: 5 minutes)**
*   **Question**: "How long should I keep unused data in memory?"
*   **Behavior**: If a query is not being used by any component (e.g., you navigated away from the page), the data sits in the "cold storage". If you come back within 5 minutes, it appears instantly. After 5 minutes, it is deleted from memory.

---

## 4. The "Standard" Data Flow

1.  **Component Mounts**: `useQuery` checks the cache.
2.  **Stale Check**:
    *   If data exists but is stale (default), show cached data -> fetch in background -> update UI.
    *   If no data, show loading -> fetch -> update UI.
3.  **User Interaction**: You create a new item (`useMutation`).
4.  **Optimistic Updates** (Advanced) OR **Invalidation** (Standard):
    *   **Invalidation**: You tell the client "The 'todos' list is dirty".
    *   The client creates a new fetch for `['todos']` automatically.
    *   Your UI updates with the new item without you manually messing with arrays.

## 5. DevTools
TanStack Query comes with amazing DevTools (`@tanstack/react-query-devtools`) that let you visualize the cache, see what is stale, and force fetches.
