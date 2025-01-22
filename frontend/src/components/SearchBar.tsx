import React, { useState } from 'react';
import { AutoComplete, Input } from 'antd';

interface SearchBarProps {
	onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
	const [options, setOptions] = useState<{ value: string }[]>([]);

	const handleSearch = async (query: string) => {
		if (!query) {
			setOptions([]);
			return;
		}

		try {
			const response = await fetch(
				`http://localhost:8050/suggestions?query=${encodeURIComponent(query)}`
			);
			const data = await response.json();

			// Check if suggestions are available and map them into the expected format
			if (data.suggestions && Array.isArray(data.suggestions)) {
				setOptions(data.suggestions.map((item: string) => ({ value: item })));
			} else {
				setOptions([]);
			}
		} catch (error) {
			console.error('Error fetching suggestions:', error);
			setOptions([]);
		}
	};

	const handleSelect = (value: string) => {
		onSearch(value);
	};

	const handleSearchEnter = (value: string) => {
		onSearch(value);
	};

	return (
		<AutoComplete
			options={options}
			onSearch={handleSearch} // Update options as the user types
			onSelect={handleSelect} // Trigger the search on select
			style={{ width: '100%' }}
		>
			<Input.Search
				placeholder="Search for papers..."
				allowClear
				onSearch={handleSearchEnter} // Handle Enter key press
				size="large"
			/>
		</AutoComplete>
	);
};

export default SearchBar;
