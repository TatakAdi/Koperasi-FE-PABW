import { useState } from 'react';

export default function Sidebar({ onSelectCategory, selectedCategory }) {
  const [filterActive, setFilterActive] = useState(false);
  const categories = ['Makanan Berat', 'Makanan Ringan', 'Minuman'];

  return (
    <aside className="w-60 h-[90vh] ml-4 mt-4 bg-gray-100 px-4 py-6 rounded-2xl">
      <nav className="space-y-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`w-full text-left px-4 py-2 rounded-md font-medium transition-all text-sm ${
              selectedCategory === cat
                ? 'bg-gray-100 text-green-600 font-medium'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      <hr className="my-4 border-gray-300" />

      <div className="flex items-center justify-between px-2">
        <span className="text-sm font-medium text-black">Terapkan Filter</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filterActive}
            onChange={() => setFilterActive(!filterActive)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
          <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
            filterActive ? 'translate-x-5' : ''
          }`} />
        </label>
      </div>
    </aside>
  );
}
