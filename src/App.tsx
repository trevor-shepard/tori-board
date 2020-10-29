import React from 'react'
import './styles/App.css'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import Board from 'components/Board'
// import { useMediaQuery } from 'react-responsive'

import store from 'store'

export const persistor = persistStore(store)

function App() {
	// const isTabletOrMobileDevice = useMediaQuery({
	// 	query: '(max-device-width: 1224px)'
	// })
	return (
		<div className="App">
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<Board />
				</PersistGate>
			</Provider>
		</div>
	)
}

export default App
