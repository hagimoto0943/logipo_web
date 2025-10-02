import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import MeApi from '../api/base/me.js'
import AuthApi from '../api/base/auth.js'

const SessionContext = createContext(undefined)

export const SessionProvider = ({ children }) => {
  const [me, setMe] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const meApi = useMemo(() => new MeApi(), [])
  const authApi = useMemo(() => new AuthApi(), [])
  const extractUser = useCallback((payload) => {
    if (!payload) return null
    if (payload?.data) return payload.data
    return payload
  }, [])

  const fetchMe = useCallback(async () => {
    setIsLoading(true)
    try {
      const payload = await meApi.get()
      setMe(extractUser(payload))
      setError(null)
    } catch (err) {
      setMe(null)
      setError(err?.message || '現在のユーザー情報を取得できませんでした')
    } finally {
      setIsLoading(false)
    }
  }, [meApi, extractUser])

  const signUp = useCallback(async (formValues) => {
    setError(null)
    try {
      const payload = await authApi.signUp(formValues)
      const user = extractUser(payload)
      if (user) setMe(user)
      return payload
    } catch (err) {
      setError(err?.message || '会員登録に失敗しました')
      throw err
    }
  }, [authApi, extractUser])

  const signIn = useCallback(async (credentials) => {
    setError(null)
    try {
      const payload = await authApi.signIn(credentials)
      const user = extractUser(payload)
      if (user) setMe(user)
      return payload
    } catch (err) {
      setError(err?.message || 'ログインに失敗しました')
      throw err
    }
  }, [authApi, extractUser])

  const signOut = useCallback(async () => {
    setError(null)
    try {
      await authApi.signOut()
      await fetchMe()
    } catch (err) {
      setError(err?.message || 'ログアウトに失敗しました')
      throw err
    }
  }, [authApi, fetchMe])

  const activateEmail = useCallback(async (token) => {
    setError(null)
    try {
      const payload = await authApi.activate(token)
      const user = extractUser(payload)
      if (user) setMe(user)
      return payload
    } catch (err) {
      setError(err?.message || 'メール確認に失敗しました')
      throw err
    }
  }, [authApi, extractUser])

  const resendActivation = useCallback(async () => {
    setError(null)
    try {
      return await authApi.resendActivation()
    } catch (err) {
      setError(err?.message || '確認メールの再送に失敗しました')
      throw err
    }
  }, [authApi])

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  const contextValue = useMemo(() => ({
    me,
    isLoading,
    error,
    refetch: fetchMe,
    signUp,
    signIn,
    signOut,
    activateEmail,
    resendActivation,
  }), [me, isLoading, error, fetchMe, signUp, signIn, signOut, activateEmail, resendActivation])

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used within a SessionProvider')
  return context
}
