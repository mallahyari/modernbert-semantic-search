import React from 'react';
import { Card, List, Typography } from 'antd';

interface ResultsListProps {
	results: { title: string; score: number }[];
}

const ResultsList: React.FC<ResultsListProps> = ({ results }) => {
	return (
		<List
			dataSource={results}
			renderItem={(item) => (
				<List.Item>
					<Card
						bordered={false}
						hoverable
						style={{
							width: '100%',
							boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Box shadow for the card
							marginBottom: '16px', // Spacing between cards
						}}
					>
						<div>
							<Typography.Title level={5} style={{ fontWeight: 'bold' }}>
								{item.title}
							</Typography.Title>
							<Typography.Paragraph ellipsis={{ rows: 3, expandable: true }}>
								Relevance: {parseFloat(item.score.toFixed(4))}
							</Typography.Paragraph>
						</div>
					</Card>
				</List.Item>
			)}
			style={{ marginTop: '16px' }}
		/>
	);
};

export default ResultsList;
