function Pagination({ totalExpenseCount, pageSize, currentPage, onPageChange }) {
    if (totalExpenseCount === 0) return null;
   
    const totalPages = Math.max(1, Math.ceil(totalExpenseCount / pageSize));
    const startDoc = (currentPage - 1) * pageSize + 1;
    const endDoc = Math.min(currentPage * pageSize, totalExpenseCount);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="mb-2 sm:mb-0">
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{totalExpenseCount === 0 ? 0 : startDoc}</span>
                    {" "}to <span className="font-medium">{endDoc}</span>
                    {" "}of <span className="font-medium">{totalExpenseCount}</span> results
                </p>
            </div>
            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                    <span className="sr-only">Previous</span>
                    &lt;
                </button>
                {[...Array(totalPages).keys()].map((page) => {
                    page += 1
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${page === currentPage
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            aria-current={page === currentPage ? "page" : undefined}
                        >
                            {page}
                        </button>
                    );
                })}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                    <span className="sr-only">Next</span>
                    &gt;
                </button>
            </nav>
        </div>
    );
}

export default Pagination