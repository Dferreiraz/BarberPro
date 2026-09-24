import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('@BarberPro:user')) || null,
  token: localStorage.getItem('@BarberPro:token') || null,
  
  setAuth: (user, token) => {
    localStorage.setItem('@BarberPro:user', JSON.stringify(user))
    localStorage.setItem('@BarberPro:token', token)
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('@BarberPro:user')
    localStorage.removeItem('@BarberPro:token')
    set({ user: null, token: null })
  }
}))

export default useAuthStore