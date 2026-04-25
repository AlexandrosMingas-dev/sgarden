import { createContext, useContext, useState, useCallback } from "react";

const BookmarkContext = createContext();

export const useBookmarks = () => useContext(BookmarkContext);

export const BookmarkProvider = ({ children }) => {
	const [bookmarks, setBookmarks] = useState(() => {
		try {
			const stored = localStorage.getItem("dashboardBookmarks");
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	});

	const toggleBookmark = useCallback((dashboardId) => {
		setBookmarks((prev) => {
			const updated = prev.includes(dashboardId)
				? prev.filter((id) => id !== dashboardId)
				: [...prev, dashboardId];
			localStorage.setItem("dashboardBookmarks", JSON.stringify(updated));
			return updated;
		});
	}, []);

	const isBookmarked = useCallback((dashboardId) => {
		return bookmarks.includes(dashboardId);
	}, [bookmarks]);

	return (
		<BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
			{children}
		</BookmarkContext.Provider>
	);
};

export default BookmarkContext;
