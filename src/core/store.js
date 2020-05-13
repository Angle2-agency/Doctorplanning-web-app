/* global window:true */

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'
import createSagaMiddleware from 'redux-saga'

import { rehydrationCompleted } from './global/globalActions'

/**
 * Reducer
 */
import reducer from './reducers'

/**
 * Sagas
 */
import rootSagas from './sagas'

/**
 * ## configureStore
 * @param {Object} the state
 */
export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // eslint-disable-line

  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(autoRehydrate(), applyMiddleware(sagaMiddleware, thunk)),
  )

  // to backup state in local storage and restore on load
  persistStore(
    store,
    {
      transforms: [immutableTransform()],
      blacklist: ['global', 'iccapi'],
    },
    () => {
      store.dispatch(rehydrationCompleted(true))
    },
  )

  sagaMiddleware.run(rootSagas)

  return store
}
