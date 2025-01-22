import React, { useState } from 'react';
import { Layout, Typography } from 'antd';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
	const [results, setResults] = useState<{ title: string; abstract: string }[]>([]);

	const handleSearch = async (query: string) => {
		try {
			const response = await fetch(
				`http://localhost:8050/search?query=${encodeURIComponent(query)}`
			);
			const data = await response.json();
			setResults(data.results);
		} catch (error) {
			console.error('Error fetching search results:', error);
		}
	};

	return (
		<Layout
			style={{
				minHeight: '100vh',
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between', // Ensures full height is used
			}}
		>
			<Header
				style={{
					backgroundColor: '#001529',
					color: '#fff',
					padding: '0 50px',
					textAlign: 'center', // Center content inside header
				}}
			>
				<Typography.Title level={3} style={{ color: '#fff' }}>
					Semantic Search App
				</Typography.Title>
			</Header>
			<Content
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center', // Centers the content horizontally
					padding: '16px 50px',
					maxWidth: '100%',
				}}
			>
				<SearchBar onSearch={handleSearch} />
				<ResultsList results={results} />
			</Content>
			<Footer
				style={{
					textAlign: 'center',
					width: '100%',
				}}
			>
				Semantic Search App ©2025 Created by TwoSetAI
			</Footer>
		</Layout>
	);
};

export default App;
