import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/app.scss'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
 import 'mdb-react-ui-kit/dist/css/mdb.min.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  </React.StrictMode>,
)