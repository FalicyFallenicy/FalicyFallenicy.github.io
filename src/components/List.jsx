import { SectionWrapper } from "../wrapper";
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { addDoc, collection, doc, getDocs, deleteDoc, updateDoc, query, where } from "@firebase/firestore";
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

const ListCard = ({ id, title, seasons, total_episodes, watched_episodes, status, person, handleDelete, refreshCards, isEditing, setIsEditing, handleSaveClick }) => {
	const [editedValues, setEditedValues] = useState({
		title, seasons, total_episodes, watched_episodes, status, person
	});

	useEffect(() => {
		setEditedValues({ title, seasons, total_episodes, watched_episodes, status, person });
	}, [title, seasons, total_episodes, watched_episodes, status, person]);

	useEffect(() => {
		const { total_episodes, watched_episodes } = editedValues;
		const percentage = total_episodes ? ((watched_episodes / total_episodes) * 100).toFixed(2) : 0;
		setEditedValues((prev) => ({ ...prev, percentage }));
	}, [editedValues.total_episodes, editedValues.watched_episodes]);

	const handleFieldChangeLocal = (e) => {
		const { name, value } = e.target;
		setEditedValues({
			...editedValues,
			[name]: value
		});
	};

	const handleStatusChangeLocal = async (e) => {
		const { value } = e.target;
		setEditedValues({
			...editedValues,
			status: value
		});

		try {
			const cardDocRef = doc(firestore, 'series', id);
			await updateDoc(cardDocRef, { status: value });
			console.log('Status updated successfully!');
		} catch (error) {
			console.error('Error updating status: ', error);
		}
	};

	const handleIncrementWatchedEpisodes = async () => {
		const newWatchedEpisodes = Math.min(parseInt(editedValues.watched_episodes, 10) + 1, parseInt(editedValues.total_episodes, 10));
		setEditedValues({
			...editedValues,
			watched_episodes: newWatchedEpisodes
		});

		try {
			const cardDocRef = doc(firestore, 'series', id);
			await updateDoc(cardDocRef, { watched_episodes: newWatchedEpisodes });
			console.log('Watched episodes updated successfully!');
		} catch (error) {
			console.error('Error updating watched episodes: ', error);
		}
	};

	const handleEditClick = () => {
		setIsEditing(id);
	};

	const handleSaveClickLocal = async () => {
		await handleSaveClick(id, editedValues);
		setIsEditing(null);
	};

	const handleDeleteClick = async () => {
		await handleDelete(id);
		refreshCards();
	};

	return (
		<tr className="border-table border-gray-200">
			{isEditing === id ? (
				<>
					<td className="px-4 py-2 border-table">
						<input
							type="text"
							name="title"
							value={editedValues.title}
							onChange={handleFieldChangeLocal}
							className="w-full px-2 py-1 border rounded-lg bg-purple"
						/>
					</td>
					<td className="px-4 py-2 border-table">
						<input
							type="text"
							name="seasons"
							value={editedValues.seasons}
							onChange={handleFieldChangeLocal}
							className="w-full px-2 py-1 border rounded-lg bg-purple"
						/>
					</td>
					<td className="px-4 py-2 border-table">
						<input
							type="number"
							name="total_episodes"
							value={editedValues.total_episodes}
							onChange={handleFieldChangeLocal}
							className="w-full px-2 py-1 border rounded-lg bg-purple"
						/>
					</td>
					<td className="px-4 py-2 flex items-center">
						<input
							type="number"
							name="watched_episodes"
							value={editedValues.watched_episodes}
							onChange={handleFieldChangeLocal}
							className="w-full px-2 py-1 border rounded-lg bg-purple"
						/>
						<button
							onClick={handleIncrementWatchedEpisodes}
							className="ml-2 bg-purple text-white px-2 py-1 rounded-lg shadow hover:bg-purple-800"
						>
							+
						</button>
					</td>
					<td className="px-4 py-2 border-table text-center">{editedValues.percentage}%</td>
					<td className="px-4 py-2 border-table">
						<select
							name="status"
							value={editedValues.status}
							onChange={handleStatusChangeLocal}
							className="w-full px-2 py-1 border rounded-lg bg-purple"
						>
							<option value="Completed">Completed</option>
							<option value="On Hold">On Hold</option>
							<option value="Watching">Watching</option>
							<option value="Dropped">Dropped</option>
							<option value="Plan to watch">Plan to watch</option>
						</select>
					</td>
					<td className="px-4 py-2 border-table">
						<input
							type="text"
							name="person"
							value={editedValues.person}
							onChange={handleFieldChangeLocal}
							className="w-full px-2 py-1 border rounded-lg bg-purple"
						/>
					</td>
				</>
			) : (
				<>
					<td className="px-4 py-2 border-table text-center">{title}</td>
					<td className="px-4 py-2 border-table text-center">{seasons}</td>
					<td className="px-4 py-2 border-table text-center">{total_episodes}</td>
					<td className="px-4 py-2 items-center text-center border-table">
						{editedValues.watched_episodes}
						<button
							onClick={handleIncrementWatchedEpisodes}
							className="ml-2 bg-purple text-white px-2 py-1 rounded-lg shadow hover:bg-purple-800"
						>
							+
						</button>
					</td>
					<td className="px-4 py-2 border-table text-center">{editedValues.percentage}%</td>
					<td className="px-4 py-2 border-table text-center">
						<select
							name="status"
							value={editedValues.status}
							onChange={handleStatusChangeLocal}
							className="w-full px-2 py-1 border rounded-lg bg-purple text-center"
						>
							<option value="Completed">Completed</option>
							<option value="On Hold">On Hold</option>
							<option value="Watching">Watching</option>
							<option value="Dropped">Dropped</option>
							<option value="Plan to watch">Plan to watch</option>
						</select>
					</td>
					<td className="px-4 py-2 border-table text-center">{person}</td>
				</>
			)}
			<td className="border-table">
				<span className="px-4 py-2 flex space-x-2 ">
					{isEditing === id ? (
						<button
							onClick={handleSaveClickLocal}
							className="bg-green-500 text-white px-3 py-1 rounded-lg shadow hover:bg-green-600"
						>
							Save
						</button>
					) : (
						<button
							onClick={handleEditClick}
							className="bg-purple text-white px-3 py-1 rounded-lg shadow hover:bg-purple-800"
						>
							Edit
						</button>
					)}
					<button
						onClick={handleDeleteClick}
						className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600"
					>
						Delete
					</button>
				</span>
			</td>

		</tr>
	);
};

const List = () => {
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(null);
	const [newCard, setNewCard] = useState(null);
	const [statusFilter, setStatusFilter] = useState("");
	const [sortOrder, setSortOrder] = useState('asc');

	const fetchCards = async () => {
		setLoading(true);

		try {
			let q;
			if (statusFilter) {
				q = query(collection(firestore, 'series'), where('status', '==', statusFilter));
			} else {
				q = query(collection(firestore, 'series'));
			}

			const querySnapshot = await getDocs(q);

			let cardsData = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			}));

			if (sortOrder === 'asc') {
				cardsData = cardsData.sort((a, b) => a.title.localeCompare(b.title));
				setSortOrder('asc');
			} else if (sortOrder === 'desc') {
				cardsData = cardsData.sort((a, b) => b.title.localeCompare(a.title));
				setSortOrder('desc');
			}

			setCards(cardsData);
			setLoading(false);
		} catch (error) {
			console.error('Error fetching cards: ', error);
			setLoading(false);
		}
	};

	const handleAddClick = () => {
		const newCardTemplate = {
			id: null,
			title: '',
			seasons: '',
			total_episodes: '',
			watched_episodes: '',
			status: 'Plan to watch',
			person: ''
		};
		SectionWrapper(end)
		setNewCard(newCardTemplate);
		setIsEditing(null);
	};

	const handleSaveClick = async (id, values) => {
		try {
			if (id) {
				const cardDocRef = doc(firestore, 'series', id);
				await updateDoc(cardDocRef, values);
				console.log('Document updated with ID: ', id);
			} else {
				await addDoc(collection(firestore, 'series'), values);
				console.log('Document added!');
				setNewCard(null);
			}
			fetchCards();
		} catch (error) {
			console.error('Error saving document: ', error);
		}
	};

	const handleDelete = async (id) => {
		try {
			await deleteDoc(doc(firestore, 'series', id));
			console.log('Document deleted with ID: ', id);
			fetchCards();
		} catch (error) {
			console.error('Error deleting document: ', error);
		}
	};

	const handleStatusFilterChange = (e) => {
		setStatusFilter(e.target.value);
	};

	const handleImportCSV = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		Papa.parse(file, {
			header: true,
			complete: async (results) => {
				const seriesData = results.data;
				try {
					for (const series of seriesData) {
						await addDoc(collection(firestore, 'series'), series);
					}
					console.log('Data imported successfully!');
					fetchCards();  // Refresh the list
				} catch (error) {
					console.error('Error importing data: ', error);
				}
			},
			error: (error) => {
				console.error('Error parsing CSV file: ', error);
			}
		});
	};

	const handleExportCSV = async () => {
		try {
			const querySnapshot = await getDocs(collection(firestore, 'series'));
			const data = querySnapshot.docs.map(doc => doc.data());

			const csv = Papa.unparse(data);
			const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
			saveAs(blob, 'series_data.csv');
			console.log('Data exported successfully!');
		} catch (error) {
			console.error('Error exporting data: ', error);
		}
	};

	const handleSort = () => {
		const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		setSortOrder(newSortOrder);
		fetchCards();
	};

	useEffect(() => {
		fetchCards();
	}, [statusFilter, sortOrder]);

	return (
		<>
			<div className="flex justify-between items-center mb-4">
				<a href='#end'>
					<button
						onClick={handleAddClick}
						className="bg-purple text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-purple-800"
					>
						Add
					</button>
				</a>
				<form className="">
					<div>
						<select
							id="statusFilter"
							value={statusFilter}
							onChange={handleStatusFilterChange}
							className="w-full px-3 py-2 border rounded-lg shadow-sm bg-purple"
							style={{ width: '300px' }}
						>
							<option value="">All</option>
							<option value="Completed">Completed</option>
							<option value="On Hold">On Hold</option>
							<option value="Watching">Watching</option>
							<option value="Dropped">Dropped</option>
							<option value="Plan to watch">Plan to watch</option>
						</select>
					</div>
				</form>
				<div>
					<input
						type="file"
						accept=".csv"
						onChange={handleImportCSV}
						className="hidden"
						id="upload-csv"
					/>
					<label
						htmlFor="upload-csv"
						className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-green-600 cursor-pointer"
					>
						Import CSV
					</label>
					<button
						onClick={handleExportCSV}
						className="ml-2 bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-orange-600"
					>
						Export CSV
					</button>
				</div>
			</div>

			{loading ? (
				<p>Loading...</p>
			) : (
				<table className="min-w-full">
					<thead className="bg-thead">
					<tr className="bg-table">
						<th className="py-2 px-4 border-top-left-rad">
							Title
							<button onClick={handleSort}>
								{sortOrder === 'asc' ? '▲' : '▼'}
							</button>
						</th>
						<th className="py-2 px-4 ">Seasons</th>
						<th className="py-2 px-4 ">Total Episodes</th>
						<th className="py-2 px-4 ">Watched Episodes</th>
						<th className="py-2 px-4 ">Percentage</th>
						<th className="py-2 px-4 ">Status</th>
						<th className="py-2 px-4 ">Person</th>
						<th className="py-2 px-4 border-top-right-rad">Actions</th>
					</tr>
					</thead>
					<tbody className="bg-tbody">
					{cards.map(card => (
						<ListCard
							key={card.id}
							id={card.id}
							title={card.title}
							seasons={card.seasons}
							total_episodes={card.total_episodes}
							watched_episodes={card.watched_episodes}
							status={card.status}
							person={card.person}
							handleDelete={handleDelete}
							refreshCards={fetchCards}
							isEditing={isEditing}
							setIsEditing={setIsEditing}
							handleSaveClick={handleSaveClick}
						/>
					))}
					{newCard && (
						<ListCard
							id={null}
							title={newCard.title}
							seasons={newCard.seasons}
							total_episodes={newCard.total_episodes}
							watched_episodes={newCard.watched_episodes}
							status={newCard.status}
							person={newCard.person}
							handleDelete={handleDelete}
							refreshCards={fetchCards}
							isEditing={isEditing}
							setIsEditing={setIsEditing}
							handleSaveClick={handleSaveClick}
						/>
					)}
					</tbody>
				</table>
			)}
		</>
	);
};

export default SectionWrapper(List, "list");
