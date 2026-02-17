# Student Management with TanStack Query 🚀

This branch demonstrates the migration from manual state management (using `useEffect` and `useState`) to **TanStack Query (v5)** for handling server state.

## 💡 Core Concepts Implemented

### 1. Global Provider Setup
The application is wrapped in a `QueryClientProvider` in `main.jsx`. This initializes the Query Client which manages all caching and background background syncing.

```javascript
/* src/main.jsx */
const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

### 2. Fetching Data (`useQuery`)
Instead of manually creating loading states and using `useEffect`, we filter data using the `useQuery` hook.

*   **`queryKey`**: `['students']` - A unique key used to cache and track this specific data.
*   **`queryFn`**: The function that actually fetches data (using Axios).
*   **Automatic States**: `isLoading`, `isError`, and `data` are provided out-of-the-box.

```javascript
/* src/StudentCrud.jsx */
const { data: students, isLoading, isError } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
});
```

### 3. Modifying Data (`useMutation`)
For Create, Update, and Delete operations, we use the `useMutation` hook. This handles the lifecycle of an asynchronous change.

*   **`mutationFn`**: The function that performs the API call (POST, PUT, DELETE).
*   **`onSuccess`**: A callback that runs after the API call finishes successfully.

```javascript
/* src/StudentCrud.jsx */
const createMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
        // ✨ Magic happens here:
        // We tell React Query that 'students' data is now stale.
        // It automatically re-fetches the fresh list in the background!
        queryClient.invalidateQueries({ queryKey: ['students'] });
    }
});
```

### 4. Automatic Refetching (Cache Invalidation)
The most powerful feature implemented here is **Query Invalidation**.

In the previous version, after adding a student, we had to manually update the local `students` array state. With TanStack Query, we simply call:

```javascript
queryClient.invalidateQueries({ queryKey: ['students'] });
```

This ensures our UI is always in sync with the server without complex manual state logic.

## ⚡ Main Benefits Over `useEffect`

| Feature | Manual (`useEffect`) | TanStack Query |
| :--- | :--- | :--- |
| **Boilerplate** | High (Loading/Error states manually managed) | Low (Handled by hook) |
| **Caching** | None (Fetches on every mount) | Automatic (Configurable stale times) |
| **Updates** | Manual array manipulation | Automatic Refetching |
| **Deduping** | No (Multiple requests possible) | Yes (Requests deduped) |

---
*Check `src/StudentCrud.jsx` to see the full implementation.*
