import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../api/axiosInstance";

export default function BookShelfComponent() {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameInput, setRenameInput] = useState("");
  const [selectedBookIndex, setSelectedBookIndex] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [profileImage, setProfileImage] = useState("/default-profile.png");

  const fetchBooks = async (showRefreshIndicator = false) => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      if (!userId) {
        setError("User not authenticated");
        return;
      }
      if (showRefreshIndicator) setIsRefreshing(true);
      else setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `/secure/typing-sessions/${userId}`,
      );
      if (response.data.status) {
        setProfileImage(JSON.parse(localStorage.getItem("user")).img_url);
        setBooks(response.data.books);
      } else {
        setError("Failed to fetch books");
      }
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Separate books into completed and non-completed
  const completedBooks = books
    .filter(
      (book) =>
        book.status &&
        book.theme.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const nonCompletedBooks = books
    .filter(
      (book) =>
        !book.status &&
        book.theme.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  function openRenameModal(index, bookId, isCompleted) {
    const bookArray = isCompleted ? completedBooks : nonCompletedBooks;
    const book = bookArray[index];
    setSelectedBookIndex(index);
    setSelectedBookId(bookId);
    setRenameInput(book.theme);
    setIsRenameModalOpen(true);
  }

  function closeRenameModal() {
    setIsRenameModalOpen(false);
    setSelectedBookIndex(null);
    setSelectedBookId(null);
    setRenameInput("");
  }

  async function handleRename() {
    if (renameInput.trim() === "") return;
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      if (!userId) {
        setError("User not authenticated");
        return;
      }
      const response = await axiosInstance.put(
        `/secure/rename-typing-session/${selectedBookId}`,
        {
          newName: renameInput.trim(),
          userId: userId,
        },
      );
      if (response.data.status) {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === selectedBookId
              ? { ...book, theme: renameInput.trim() }
              : book,
          ),
        );
        closeRenameModal();
      } else {
        setError("Failed to rename book");
      }
    } catch (err) {
      console.error("Error renaming book:", err);
      setError("Failed to rename book. Please try again.");
    }
  }

  async function handleDelete() {
    if (!bookToDelete) return;
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      if (!userId) {
        setError("User not authenticated");
        return;
      }
      const response = await axiosInstance.delete(
        `/secure/typing-session/${bookToDelete}`,
        {
          data: { userId },
        },
      );
      if (response.data.status) {
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book.id !== bookToDelete),
        );
        closeDeleteModal();
      } else {
        setError("Failed to delete book");
      }
    } catch (err) {
      console.error("Error deleting book:", err);
      setError("Failed to delete book. Please try again.");
    }
  }

  function openDeleteModal(bookId) {
    setBookToDelete(bookId);
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
    setBookToDelete(null);
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#5C5E81] mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <div className="text-[#5C5E81] text-xl font-semibold">
            Loading your library...
          </div>
          <div className="text-[#8C8DA3] text-sm mt-2">
            Please wait while we gather your stories
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col relative overflow-hidden">
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-white border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-lg z-50 max-w-md"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              знаем
              <svg
                className="w-5 h-5 mr-3 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-4 text-red-400 hover:text-red-600 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Section */}
      <Link to="/edit-account" className="absolute top-6 right-6 z-10">
        <motion.div
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer"
          whileHover={{ scale: 1.1, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </Link>

      <div className="pr-5 pb-13 pl-5 md:pt-13 lg:pt-13 pt-20">
        {/* Header */}
        <motion.div
          className="absolute top-6 left-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="text-[25px] md:text-[35px] font-bold text-[#5C5E81] tracking-wide mb-1"
            style={{ textShadow: "1px 1px 4px rgba(92, 94, 129, 0.2)" }}
          >
            TypeToTale
          </div>
          <div className="font-medium text-[10px] md:text-[15px] text-[#8C8DA3] tracking-wide">
            Start typing to begin your storytelling journey!
          </div>
        </motion.div>

        {/* Title Section */}
        <motion.div
          className="mt-10 md:mt-18 ml-10 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="text-[20px] md:text-[28px] font-bold text-[#5C5E81]">
              Your Bookshelf
            </div>
            <motion.div
              className="px-3 py-1 bg-[#5C5E81] text-white text-sm rounded-full font-medium"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {books.length} {books.length === 1 ? "book" : "books"}
            </motion.div>
          </div>
          <div className="h-1 w-16 bg-gradient-to-r from-[#5C5E81] to-[#8C8DA3] rounded-full"></div>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex flex-col ml-10 lg:flex-row lg:items-center mr-8 lg:justify-between mb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex w-full lg:flex-1 gap-3">
            <div className="relative flex-1">
              <motion.input
                type="text"
                placeholder="Search your stories..."
                className="w-full py-3 px-12 rounded-2xl bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5C5E81] focus:border-transparent transition-all duration-300 text-[14px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 absolute left-4 top-3.5 text-[#9D9191]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              {searchTerm && (
                <motion.button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-3.5 text-[#9D9191] hover:text-[#5C5E81] transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>
              )}
            </div>
            <motion.button
              onClick={toggleSortOrder}
              className="p-3 text-[#9D9191] hover:text-[#5C5E81] bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 relative group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={
                sortOrder === "newest" ? "Sort by oldest" : "Sort by newest"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                />
              </svg>
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-10 bg-[#5C5E81] text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {sortOrder === "newest" ? "Sort by oldest" : "Sort by newest"}
              </div>
            </motion.button>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => fetchBooks(true)}
              disabled={isRefreshing}
              className="hidden lg:flex items-center gap-2 text-[#5C5E81] hover:text-[#4a4c6b] bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 disabled:opacity-50 relative group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Refresh books"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              <span className="text-sm font-medium">Refresh</span>
              <div
                className="absolute left-1/2 transform -translate-x-1/2 -top-10 bg-[#5C5E81] text-white text-xs rounded py-1 px-2
                opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
              >
                Refresh books
              </div>
            </motion.button>
            <Link to="/create-book">
              <motion.button
                className="bg-gradient-to-r from-[#5C5E81] to-[#6B7BA5] text-white px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 20px rgba(92, 94, 129, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold text-[14px] lg:text-[18px] tracking-wide">
                  New Book
                </span>
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Books Sections */}
        {completedBooks.length === 0 && nonCompletedBooks.length === 0 ? (
          <motion.div
            className="text-center mt-20 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {searchTerm ? (
              <div className="bg-white rounded-3xl p-12 shadow-lg max-w-md mx-auto">
                <motion.div
                  className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold text-[#5C5E81] mb-2">
                  No matching stories
                </h3>
                <p className="text-[#8C8DA3] mb-6">
                  We couldn't find any books matching "{searchTerm}"
                </p>
                <motion.button
                  onClick={() => setSearchTerm("")}
                  className="text-[#5C5E81] font-semibold hover:underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear search
                </motion.button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 shadow-lg max-w-md mx-auto">
                <motion.div
                  className="w-20 h-20 bg-[#5C5E81] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    className="w-10 h-10 text-[#5C5E81]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-[#5C5E81] mb-3">
                  Your library awaits
                </h3>
                <p className="text-[#8C8DA3] mb-8">
                  Create your first book and start your storytelling journey!
                </p>
                <Link to="/create-book">
                  <motion.button
                    className="bg-gradient-to-r from-[#5C5E81] to-[#6B7BA5] text-white px-8 py-3 rounded-2xl font-semibold shadow-lg"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 4px 20px rgba(92, 94, 129, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Your First Book
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="ml-10 mr-10 mt-10">
            {/* Completed Books Section */}
            {completedBooks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-[18px] md:text-[24px] font-bold text-[#5C5E81] mb-4">
                  Completed Books ({completedBooks.length})
                </h2>
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {completedBooks.map((book, index) => (
                    <motion.div
                      key={book.id}
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {/* group book */}
                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-[150px] h-[200px] cursor-pointer rounded-[12px]"
                      >
                        <Link
                          to={`/complete-story/${book.id}`}
                          className="block w-full h-full rounded-[12px] overflow-hidden"
                        >
                          {/* spine */}
                          <div className="absolute left-0 top-0 w-[18px] h-full bg-gradient-to-b from-[#494141] to-[#2d2828] rounded-l-lg shadow-inner z-10"></div>

                          {/* cover */}
                          <div className="absolute left-[18px] top-0 right-0 h-full bg-gradient-to-br from-[#5C5E81] via-[#6B7BA5] to-[#4a4c6b] rounded-r-lg shadow-lg z-15 overflow-hidden">
                            <div className="absolute inset-0 bg-white bg-opacity-5 rounded-r-lg"></div>
                            <div className="absolute inset-4 flex items-end">
                              <div className="text-white text-xs font-bold line-clamp-3 text-center w-full">
                                {book.theme}
                              </div>
                            </div>
                          </div>

                          <div className="absolute top-3 left-3 w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg opacity-60 z-0"></div>

                          {/* completed icon */}
                          <div className="absolute top-3 right-3 z-20">
                            <div
                              className="w-4 h-4 rounded-full shadow-lg border-2 border-white bg-emerald-400"
                              title="Completed"
                            >
                              <div className="w-full h-full rounded-full bg-emerald-300 opacity-60"></div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>

                      {/* book name and delete button */}
                      <div className="mt-4 w-full flex justify-center">
                        <div className="flex items-center max-w-[150px]">
                          <motion.div
                            onClick={() =>
                              openRenameModal(index, book.id, true)
                            }
                            className="cursor-pointer text-[#5C5E81] text-[15px] font-semibold hover:text-[#4a4c6b] transition-colors duration-300 line-clamp-2 px-2 py-1 rounded-lg hover:bg-opacity-50 text-center flex-1"
                            title="Click to rename"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            {book.theme}
                          </motion.div>

                          <motion.button
                            onClick={() => openDeleteModal(book.id)}
                            className="text-red-500 hover:text-red-600 transition-colors duration-300"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete book"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </motion.button>
                        </div>
                      </div>

                      {/* date */}
                      <div className="text-[12px] text-[#8C8DA3] font-medium">
                        {formatDate(book.createdAt)}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* In Progress Books Section */}
            {nonCompletedBooks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-[18px] md:text-[24px] font-bold text-[#5C5E81] mb-4">
                  In Progress Books ({nonCompletedBooks.length})
                </h2>

                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {nonCompletedBooks.map((book, index) => (
                    <motion.div
                      key={book.id}
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {/* group book */}
                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-[150px] h-[200px] cursor-pointer rounded-[12px]"
                      >
                        <Link
                          to={`/story/${book.id}`}
                          className="block w-full h-full rounded-[12px] overflow-hidden"
                        >
                          {/* spine */}
                          <div className="absolute left-0 top-0 w-[18px] h-full bg-gradient-to-b from-[#8B4513] to-[#654321] rounded-l-lg shadow-inner z-10"></div>

                          {/* cover */}
                          <div className="absolute left-[18px] top-0 right-0 h-full bg-gradient-to-br from-[#A0A0A0] via-[#B8B8B8] to-[#888888] rounded-r-lg shadow-lg z-15 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white bg-opacity-5 rounded-r-lg"></div>
                            <div className="absolute inset-4 flex items-end">
                              <div className="text-white text-xs font-bold line-clamp-3 text-center w-full">
                                {book.theme}
                              </div>
                            </div>
                          </div>

                          {/* overlay */}
                          <div className="absolute top-3 left-3 w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg opacity-60 z-0"></div>

                          {/* in progress icon */}
                          <div className="absolute top-3 right-3 z-20">
                            <div
                              className="w-4 h-4 rounded-full shadow-lg border-2 border-white bg-amber-400"
                              title="In Progress"
                            >
                              <div className="w-full h-full rounded-full bg-amber-300 opacity-60"></div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>

                      {/* book name and delete button */}
                      <div className="mt-4 w-full flex justify-center">
                        <div className="flex items-center max-w-[150px]">
                          <motion.div
                            onClick={() =>
                              openRenameModal(index, book.id, false)
                            }
                            className="cursor-pointer text-[#5C5E81] text-[15px] font-semibold hover:text-[#4a4c6b] transition-colors duration-300 line-clamp-2 px-2 py-1 rounded-lg hover:bg-opacity-50 text-center flex-1"
                            title="Click to rename"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            {book.theme}
                          </motion.div>

                          <motion.button
                            onClick={() => openDeleteModal(book.id)}
                            className="text-red-500 hover:text-red-600 transition-colors duration-300"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete book"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </motion.button>
                        </div>
                      </div>

                      {/* date */}
                      <div className="text-[12px] text-[#8C8DA3] font-medium">
                        {formatDate(book.createdAt)}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Rename Modal */}
      <AnimatePresence>
        {isRenameModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white shadow-2xl rounded-3xl p-8 w-[90%] max-w-[450px] border border-gray-100"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-center mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="w-16 h-16 bg-[#5C5E81] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-[#5C5E81]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#5C5E81] mb-2">
                  Rename Your Book
                </h2>
                <p className="text-[#8C8DA3]">Give your story a new title</p>
              </motion.div>
              <div className="space-y-4">
                <motion.input
                  type="text"
                  placeholder="Enter new book name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C5E81] focus:border-transparent text-[15px] font-medium transition-all duration-300"
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename();
                    if (e.key === "Escape") closeRenameModal();
                  }}
                  autoFocus
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
                <div className="flex gap-3">
                  <motion.button
                    className="flex-1 text-[#8C8DA3] hover:text-[#5C5E81] py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-[#5C5E81] font-semibold transition-all duration-300"
                    onClick={closeRenameModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="flex-1 bg-gradient-to-r from-[#5C5E81] to-[#6B7BA5] text-white py-3 px-4 rounded-xl font-semibold shadow-lg"
                    onClick={handleRename}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 4px 20px rgba(92, 94, 129, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Rename Book
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white shadow-2xl rounded-3xl p-8 w-[90%] max-w-[450px] border border-gray-100"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-center mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7v12m6-12v12"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#5C5E81] mb-2">
                  Delete Book
                </h2>
                <p className="text-[#8C8DA3]">
                  Are you sure you want to delete this book? This action cannot
                  be undone.
                </p>
              </motion.div>
              <div className="flex gap-3">
                <motion.button
                  className="flex-1 text-[#8C8DA3] hover:text-[#5C5E81] py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-[#5C5E81] font-semibold transition-all duration-300"
                  onClick={closeDeleteModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="flex-1 bg-red-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg"
                  onClick={handleDelete}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 4px 20px rgba(239, 68, 68, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
