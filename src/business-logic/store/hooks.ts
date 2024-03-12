import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

/**
 * Custom hook that provides a typed version of the `useDispatch` hook from `react-redux`.
 * Use this hook throughout your app instead of plain `useDispatch`.
 */
export const useAppDispatch: () => AppDispatch = useDispatch

/**
 * Custom hook that provides a typed version of the `useSelector` hook from `react-redux`.
 * Use this hook throughout your app instead of plain `useSelector`.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector